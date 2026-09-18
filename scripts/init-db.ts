import { createClient } from '@libsql/client';
import fs from 'node:fs/promises';
import path from 'node:path';

const db = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db', authToken: process.env.TURSO_AUTH_TOKEN });

async function hasColumn(table: string, column: string) {
  const result = await db.execute('PRAGMA table_info(' + table + ')');
  return result.rows.some((row: any) => String(row.name) === column);
}
async function addColumn(table: string, column: string, definition: string) {
  if (!(await hasColumn(table, column))) await db.execute('ALTER TABLE ' + table + ' ADD COLUMN ' + column + ' ' + definition);
}

async function main() {
  const schema = await fs.readFile(path.join(process.cwd(), 'scripts', 'schema.sql'), 'utf8');
  const statements = schema.split(';').map((sql) => sql.trim()).filter(Boolean);

  // Create missing tables first, then migrate legacy tables, and only then
  // create indexes/seed rows that depend on the migrated columns.
  for (const statement of statements) {
    if (/^CREATE TABLE IF NOT EXISTS/i.test(statement)) await db.execute(statement);
  }

  await addColumn('projects', 'sort_order', 'INTEGER NOT NULL DEFAULT 0');
  await addColumn('messages', 'company', "TEXT NOT NULL DEFAULT ''");
  await addColumn('messages', 'subject', "TEXT NOT NULL DEFAULT ''");
  // Migrate legacy site_sections tables explicitly. CREATE TABLE IF NOT EXISTS
  // does not add new columns to an already-existing Turso table.
  await addColumn('site_sections', 'title_en', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'subtitle_en', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'body_en', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'icon', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'image', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'button_text', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'button_text_en', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'button_url', "TEXT NOT NULL DEFAULT ''");
  await addColumn('site_sections', 'data', "TEXT NOT NULL DEFAULT '{}'");
  await addColumn('site_sections', 'sort_order', 'INTEGER NOT NULL DEFAULT 0');
  await addColumn('site_sections', 'visible', 'INTEGER NOT NULL DEFAULT 1');
  await addColumn('site_sections', 'created_at', 'TEXT');
  await addColumn('site_sections', 'updated_at', 'TEXT');
  await db.execute("UPDATE site_sections SET created_at=COALESCE(created_at,CURRENT_TIMESTAMP), updated_at=COALESCE(updated_at,CURRENT_TIMESTAMP)");

  await db.execute("UPDATE services SET slug=lower(replace(trim(title),' ','-')) WHERE slug IS NULL OR trim(slug)=''");
  const services = await db.execute('SELECT id,slug FROM services ORDER BY id');
  const seen = new Set<string>();
  for (const row of services.rows as any[]) {
    let slug = String(row.slug || '').trim() || ('service-' + row.id);
    if (seen.has(slug)) {
      let candidate = slug + '-' + row.id, n = 2;
      while (seen.has(candidate)) candidate = slug + '-' + row.id + '-' + n++;
      slug = candidate;
    }
    seen.add(slug);
    await db.execute('UPDATE services SET slug=? WHERE id=?',[slug,row.id]);
  }
  await db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug_unique ON services(slug) WHERE slug IS NOT NULL AND slug<>''");

  const coreTypes=['hero','services','about','why','process','projects','cta'];
  const placeholders=coreTypes.map(()=>'?').join(',');
  const duplicates=await db.execute('SELECT page,type,COUNT(*) count FROM site_sections WHERE type IN ('+placeholders+') GROUP BY page,type HAVING COUNT(*)>1',coreTypes);
  for (const group of duplicates.rows as any[]) {
    const rows=await db.execute('SELECT id FROM site_sections WHERE page=? AND type=? ORDER BY id',[group.page,group.type]);
    for (const row of rows.rows.slice(1)) {
      // Never delete content during initialization. Preserve duplicates as editable custom sections.
      await db.execute("UPDATE site_sections SET type='custom', updated_at=CURRENT_TIMESTAMP WHERE id=?",[row.id]);
    }
  }
  await db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_site_sections_core_unique ON site_sections(page,type) WHERE type IN ('hero','services','about','why','process','projects','cta')");
  await db.execute("UPDATE site_sections SET title_en=CASE WHEN trim(title_en)='' THEN title ELSE title_en END, subtitle_en=CASE WHEN trim(subtitle_en)='' THEN subtitle ELSE subtitle_en END, body_en=CASE WHEN trim(body_en)='' THEN body ELSE body_en END");

  for (const statement of statements) {
    if (!/^CREATE TABLE IF NOT EXISTS/i.test(statement)) await db.execute(statement);
  }

  console.log('Database initialization, migrations, and backfills completed.');
}
main().catch((error)=>{console.error(error);process.exitCode=1;}).finally(async()=>{await db.close();});
