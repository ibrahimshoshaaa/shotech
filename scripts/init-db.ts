import { createClient } from '@libsql/client';
import fs from 'node:fs/promises';
import path from 'node:path';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error('TURSO_DATABASE_URL is required');

const db = createClient({ url, authToken });

async function main() {
  const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');

  for (const statement of schema
    .split(';')
    .map((sql) => sql.trim())
    .filter(Boolean)) {
    await db.execute(statement);
  }

  const migrations = [
    'ALTER TABLE projects ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE services ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE site_sections ADD COLUMN title_en TEXT NOT NULL DEFAULT \'\'',
    'ALTER TABLE site_sections ADD COLUMN subtitle_en TEXT NOT NULL DEFAULT \'\'',
    'ALTER TABLE site_sections ADD COLUMN content_en TEXT NOT NULL DEFAULT \'\'',
  ];

  for (const sql of migrations) {
    try {
      await db.execute(sql);
    } catch {
      // Columns may already exist on an existing database.
    }
  }

  await db.execute(
    `UPDATE services
     SET slug = lower(replace(replace(trim(title), ' ', '-'), '--', '-'))
     WHERE slug IS NULL OR slug = ''`,
  );

  const rows = await db.execute(
    `SELECT id, slug FROM services WHERE slug IS NOT NULL AND slug <> '' ORDER BY id`,
  );
  const seen = new Set<string>();

  for (const row of rows.rows as unknown as Array<{ id: number; slug: string }>) {
    const slug = String(row.slug).trim();
    if (!seen.has(slug)) {
      seen.add(slug);
      continue;
    }

    let candidate = `${slug}-${row.id}`;
    let suffix = 2;
    while (seen.has(candidate)) candidate = `${slug}-${row.id}-${suffix++}`;
    await db.execute('UPDATE services SET slug=? WHERE id=?', [candidate, row.id]);
    seen.add(candidate);
  }

  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug_unique
     ON services(slug)
     WHERE slug IS NOT NULL AND slug <> ''`,
  );

  const sectionTypes = ['hero', 'services', 'about', 'why', 'process', 'projects', 'cta'];
  for (const type of sectionTypes) {
    const rows = await db.execute(
      'SELECT id FROM site_sections WHERE page=? AND type=? ORDER BY id',
      ['home', type],
    );
    const ids = rows.rows.map((row) => Number(row.id));
    for (const id of ids.slice(1)) {
      await db.execute('DELETE FROM site_sections WHERE id=?', [id]);
    }
  }

  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_site_sections_core_unique
     ON site_sections(page, type)
     WHERE type IN ('hero','services','about','why','process','projects','cta')`,
  );

  await db.execute(
    `UPDATE site_sections
     SET title_en = CASE WHEN title_en = '' THEN title ELSE title_en END,
         subtitle_en = CASE WHEN subtitle_en = '' THEN subtitle ELSE subtitle_en END,
         content_en = CASE WHEN content_en = '' THEN content ELSE content_en END`,
  );

  console.log('Database initialization, migrations, and backfills completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
