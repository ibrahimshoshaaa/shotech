import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { db } from '../lib/db';

async function executeSchema() {
  const schemaPath = resolve(process.cwd(), 'scripts/schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  const statements = schema
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const sql of statements) {
    await db.execute(sql);
  }
}

const migrations = [
  `ALTER TABLE services ADD COLUMN content TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN slug TEXT`,
  `ALTER TABLE services ADD COLUMN cover_image TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN visible INTEGER DEFAULT 1`,
  `ALTER TABLE services ADD COLUMN title_en TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN description_en TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN content_en TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN title_en TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN excerpt_en TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN content_en TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN category_en TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN title_en TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN subtitle_en TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN body_en TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN button_text_en TEXT DEFAULT ''`,
];

async function runMigrations() {
  for (const sql of migrations) {
    try {
      await db.execute(sql);
    } catch {
      // Existing columns are expected on already-migrated databases.
    }
  }
}

async function backfillServices() {
  await db.execute(
    `UPDATE services
     SET slug = lower(replace(replace(trim(title), ' ', '-'), '--', '-'))
     WHERE slug IS NULL OR slug = ''`,
  );

  const rows = await db.execute(
    `SELECT id, slug FROM services WHERE slug IS NOT NULL AND slug <> '' ORDER BY id`,
  );
  const seen = new Set<string>();

  for (const row of rows.rows as Array<{ id: number; slug: string }>) {
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
}

async function backfillSections() {
  const titleTranslations = [
    ['home', 'hero', 'We turn ideas into powerful digital systems.', 'ShoTech Solutions • Digital solutions'],
    ['home', 'services', 'Technology designed around your business.', 'Our services'],
    ['home', 'about', 'About ShoTech', 'About us'],
    ['home', 'why', 'Why ShoTech?', 'Why choose us'],
    ['home', 'process', 'How we work', 'Our process'],
    ['home', 'projects', 'Systems built to perform.', 'Our work'],
    ['home', 'cta', "Let's build something useful", 'Start your project'],
    ['about', 'about', 'Smart solutions. Powerful systems.', ''],
    ['process', 'process', 'A clear process. A stronger result.', ''],
  ];

  for (const [page, type, title, subtitle] of titleTranslations) {
    await db.execute(
      `UPDATE site_sections SET title_en=?, subtitle_en=?
       WHERE page=? AND type=? AND (title_en IS NULL OR length(title_en)=0)`,
      [title, subtitle, page, type],
    );
  }

  const bodyTranslations = [
    ['home', 'hero', 'We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster and work more clearly.'],
    ['home', 'services', 'From the first idea to a production-ready system, we build focused solutions with a clear purpose.'],
    ['home', 'about', 'We build practical digital products and custom systems around the real needs of ambitious businesses.'],
    ['home', 'why', 'Custom solutions, clear communication, scalable architecture and a process focused on real results.'],
    ['home', 'process', 'Discover, design, build and launch — a simple process with a stronger result.'],
    ['home', 'projects', 'Explore selected projects built to solve real business problems.'],
    ['home', 'cta', 'Tell us what you want to build and we will shape the right digital solution.'],
    ['about', 'about', 'We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.'],
    ['process', 'process', 'We discover, design, build and launch — with every step managed around your business goals.'],
  ];

  for (const [page, type, body] of bodyTranslations) {
    await db.execute(
      `UPDATE site_sections SET body_en=?
       WHERE page=? AND type=? AND (body_en IS NULL OR length(body_en)=0)`,
      [body, page, type],
    );
  }

  const coreByPage: Record<string, string[]> = {
    home: ['hero', 'services', 'about', 'why', 'process', 'projects', 'cta'],
    about: ['about'],
    why: ['why'],
    process: ['process'],
  };

  for (const [page, types] of Object.entries(coreByPage)) {
    for (const type of types) {
      await db.execute(
        `DELETE FROM site_sections
         WHERE page=? AND type=?
           AND id NOT IN (SELECT MIN(id) FROM site_sections WHERE page=? AND type=?)`,
        [page, type, page, type],
      );
    }
  }

  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_site_sections_core_unique
     ON site_sections(page, type)
     WHERE type IN ('hero','services','about','why','process','projects','cta')`,
  );
}

async function main() {
  await executeSchema();
  await runMigrations();
  await backfillServices();
  await backfillSections();
  console.log('Database initialized successfully.');
}

main().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
