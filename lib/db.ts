import { createClient, type InArgs } from '@libsql/client';

// ── Connection ─────────────────────────────────────────────────────────────
const url = process.env.TURSO_DATABASE_URL;
const isVercel = process.env.VERCEL === '1';

if (!url && isVercel) {
  throw new Error(
    'TURSO_DATABASE_URL is required on Vercel. ' +
    'Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Project Settings → Environment Variables.',
  );
}

export const db = createClient({
  url: url || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ── Schema (CREATE TABLE IF NOT EXISTS) ────────────────────────────────────
const schema = [
  `CREATE TABLE IF NOT EXISTS projects (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    title_en     TEXT    DEFAULT '',
    slug         TEXT    NOT NULL UNIQUE,
    excerpt      TEXT,
    excerpt_en   TEXT    DEFAULT '',
    content      TEXT,
    content_en   TEXT    DEFAULT '',
    cover_image  TEXT,
    images       TEXT    DEFAULT '[]',
    technologies TEXT    DEFAULT '[]',
    category     TEXT,
    category_en  TEXT    DEFAULT '',
    demo_url     TEXT,
    github_url   TEXT,
    status       TEXT    DEFAULT 'draft',
    featured     INTEGER DEFAULT 0,
    created_at   TEXT    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TEXT    DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS services (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    title          TEXT    NOT NULL,
    title_en       TEXT    DEFAULT '',
    description    TEXT,
    description_en TEXT    DEFAULT '',
    content        TEXT    DEFAULT '',
    content_en     TEXT    DEFAULT '',
    slug           TEXT,
    cover_image    TEXT    DEFAULT '',
    icon           TEXT    DEFAULT 'Code2',
    sort_order     INTEGER DEFAULT 0,
    visible        INTEGER DEFAULT 1,
    created_at     TEXT    DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    message    TEXT NOT NULL,
    status     TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS site_sections (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    page           TEXT    NOT NULL DEFAULT 'home',
    type           TEXT    NOT NULL DEFAULT 'custom',
    title          TEXT    DEFAULT '',
    title_en       TEXT    DEFAULT '',
    subtitle       TEXT    DEFAULT '',
    subtitle_en    TEXT    DEFAULT '',
    body           TEXT    DEFAULT '',
    body_en        TEXT    DEFAULT '',
    icon           TEXT    DEFAULT '',
    image          TEXT    DEFAULT '',
    button_text    TEXT    DEFAULT '',
    button_text_en TEXT    DEFAULT '',
    button_url     TEXT    DEFAULT '',
    data           TEXT    DEFAULT '{}',
    sort_order     INTEGER DEFAULT 0,
    visible        INTEGER DEFAULT 1,
    created_at     TEXT    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TEXT    DEFAULT CURRENT_TIMESTAMP
  )`,

  // ── Default settings ──────────────────────────────────────────────────────
  `INSERT OR IGNORE INTO settings (key, value) VALUES
    ('companyName',       'ShoTech Solutions'),
    ('companyName_en',    'ShoTech Solutions'),
    ('tagline',           'حلول ذكية. أنظمة قوية.'),
    ('tagline_en',        'Smart solutions. Powerful systems.'),
    ('email',             ''),
    ('whatsapp',          ''),
    ('facebook',          ''),
    ('instagram',         ''),
    ('linkedin',          ''),
    ('github',            ''),
    ('seoTitle',          'ShoTech Solutions'),
    ('seoTitle_en',       'ShoTech Solutions | Digital solutions that make a difference'),
    ('seoDescription',    'حلول رقمية ذكية وأنظمة قوية تساعد عملك على النمو.'),
    ('seoDescription_en', 'Smart digital solutions and powerful systems that help businesses grow.'),
    ('aboutTitle',        'حلول ذكية. أنظمة قوية.'),
    ('aboutTitle_en',     'Smart solutions. Powerful systems.'),
    ('aboutBody',         'نبني منتجات رقمية عملية وأنظمة مخصصة تساعد الشركات على العمل بشكل أفضل، والتحرك بشكل أسرع، والنمو بثقة.'),
    ('aboutBody_en',      'We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.'),
    ('processTitle',      'طريقة شغل واضحة. ونتيجة أقوى.'),
    ('processTitle_en',   'A clear process. A stronger result.'),
    ('processBody',       'نفهم، نصمم، نبني ونطلق حلولًا رقمية حول احتياجات كل مشروع.'),
    ('processBody_en',    'We discover, design, build and launch digital solutions around the real needs of each business.')`,

  // ── Default site sections ─────────────────────────────────────────────────
  `INSERT OR IGNORE INTO site_sections (page, type, title, title_en, subtitle, subtitle_en, body, body_en, sort_order, visible) VALUES
    ('home', 'hero',     'نحوّل أفكارك إلى أنظمة رقمية قوية.',       'We turn ideas into powerful digital systems.',      'ShoTech Solutions • حلول رقمية', 'ShoTech Solutions • Digital solutions', 'نصمم ونبني مواقع حديثة، وأنظمة أعمال مخصصة، وتجارب رقمية تساعد المشاريع الطموحة على العمل بشكل أسرع وأوضح.', 'We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster and work more clearly.', 10, 1),
    ('home', 'services', 'تقنية مصممة حول شغلك.',                     'Technology designed around your business.',         'خدماتنا',                        'Our services',                          'من أول الفكرة إلى نظام جاهز للعمل، نبني حلولًا واضحة لها هدف حقيقي.',                                         'From the first idea to a production-ready system, we build focused solutions with a clear purpose.',                                                      20, 1),
    ('home', 'about',    'عن ShoTech',                                 'About ShoTech',                                    'من نحن',                         'About us',                              'نبني منتجات رقمية عملية وأنظمة مخصصة حول الاحتياجات الحقيقية للمشاريع الطموحة.',                              'We build practical digital products and custom systems around the real needs of ambitious businesses.',                                                    30, 1),
    ('home', 'why',      'ليه ShoTech؟',                               'Why ShoTech?',                                     'لماذا تختارنا',                  'Why choose us',                         'حلول مخصصة، تواصل واضح، بنية قابلة للتطوير، وطريقة شغل تركز على نتيجة حقيقية.',                               'Custom solutions, clear communication, scalable architecture and a process focused on real results.',                                                      40, 1),
    ('home', 'process',  'طريقة شغلنا',                                'How we work',                                      'خطوات التنفيذ',                  'Our process',                           'نفهم، نصمم، نبني ونطلق — طريقة بسيطة بنتيجة أقوى.',                                                            'Discover, design, build and launch — a simple process with a stronger result.',                                                                           50, 1),
    ('home', 'projects', 'أنظمة معمولة عشان تشتغل.',                  'Systems built to perform.',                        'أعمالنا',                        'Our work',                              'استكشف مجموعة من المشاريع التي بنيناها لحل مشاكل حقيقية في الأعمال.',                                          'Explore selected projects built to solve real business problems.',                                                                                        60, 1),
    ('home', 'cta',      'خلينا نبني حاجة مفيدة',                     'Let''s build something useful',                    'ابدأ مشروعك',                    'Start your project',                    'احكيلنا أنت عايز تبني إيه، وإحنا نحدد معاك الحل الرقمي المناسب.',                                             'Tell us what you want to build and we will shape the right digital solution.',                                                                            70, 1),
    ('about',   'about',   'حلول ذكية. أنظمة قوية.', 'Smart solutions. Powerful systems.', '', '', 'نبني منتجات رقمية عملية وأنظمة مخصصة تساعد الشركات على العمل بشكل أفضل، والتحرك بشكل أسرع، والنمو بثقة.', 'We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.', 10, 1),
    ('process', 'process', 'طريقة شغل واضحة. ونتيجة أقوى.', 'A clear process. A stronger result.', '', '', 'نفهم، نصمم، نبني ونطلق — وكل خطوة بتتدار حول أهداف مشروعك.', 'We discover, design, build and launch — with every step managed around your business goals.', 10, 1)`,
];

// ── Migrations (safe ALTER TABLE — errors are ignored) ──────────────────────
// These handle databases created before a column existed.
const migrations = [
  `ALTER TABLE services ADD COLUMN content        TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN slug           TEXT`,
  `ALTER TABLE services ADD COLUMN cover_image    TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN visible        INTEGER DEFAULT 1`,
  `ALTER TABLE services ADD COLUMN title_en       TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN description_en TEXT DEFAULT ''`,
  `ALTER TABLE services ADD COLUMN content_en     TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN title_en       TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN excerpt_en     TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN content_en     TEXT DEFAULT ''`,
  `ALTER TABLE projects ADD COLUMN category_en    TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN title_en       TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN subtitle_en    TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN body_en        TEXT DEFAULT ''`,
  `ALTER TABLE site_sections ADD COLUMN button_text_en TEXT DEFAULT ''`,
];

// ── Singleton initialiser ───────────────────────────────────────────────────
let initPromise: Promise<void> | null = null;

export function ensureDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      // 1. Create tables & seed defaults
      for (const sql of schema) {
        await db.execute(sql);
      }

      // 2. Run migrations — ignore "duplicate column" errors from older DBs
      for (const sql of migrations) {
        try {
          await db.execute(sql);
        } catch {
          // Column already exists — safe to ignore
        }
      }

      // 3. Back-fill missing slugs on services
      await db.execute(
        `UPDATE services
         SET slug = lower(replace(replace(trim(title), ' ', '-'), '--', '-'))
         WHERE slug IS NULL OR slug = ''`,
      );

      // 4. Back-fill English translations for site_sections (title / subtitle)
      const sectionTitleTranslations: [string, string, string, string, string, string][] = [
        ['home', 'hero',     'نحوّل أفكارك إلى أنظمة رقمية قوية.',      'We turn ideas into powerful digital systems.',     'ShoTech Solutions • حلول رقمية', 'ShoTech Solutions • Digital solutions'],
        ['home', 'services', 'تقنية مصممة حول شغلك.',                    'Technology designed around your business.',        'خدماتنا',                        'Our services'],
        ['home', 'about',    'عن ShoTech',                                'About ShoTech',                                   'من نحن',                         'About us'],
        ['home', 'why',      'ليه ShoTech؟',                              'Why ShoTech?',                                    'لماذا تختارنا',                  'Why choose us'],
        ['home', 'process',  'طريقة شغلنا',                               'How we work',                                     'خطوات التنفيذ',                  'Our process'],
        ['home', 'projects', 'أنظمة معمولة عشان تشتغل.',                 'Systems built to perform.',                       'أعمالنا',                        'Our work'],
        ['home', 'cta',      'خلينا نبني حاجة مفيدة',                    "Let's build something useful",                    'ابدأ مشروعك',                    'Start your project'],
        ['about',   'about',   'حلول ذكية. أنظمة قوية.',          'Smart solutions. Powerful systems.',  '', ''],
        ['process', 'process', 'طريقة شغل واضحة. ونتيجة أقوى.', 'A clear process. A stronger result.', '', ''],
      ];
      for (const [page, type, , enTitle, , enSub] of sectionTitleTranslations) {
        await db.execute(
          `UPDATE site_sections
           SET title_en = ?, subtitle_en = ?
           WHERE page = ? AND type = ? AND (title_en IS NULL OR length(title_en) = 0)`,
          [enTitle, enSub, page, type],
        );
      }

      // 5. Back-fill English body translations for site_sections
      const sectionBodyTranslations: [string, string, string][] = [
        ['home', 'hero',     'We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster and work more clearly.'],
        ['home', 'services', 'From the first idea to a production-ready system, we build focused solutions with a clear purpose.'],
        ['home', 'about',    'We build practical digital products and custom systems around the real needs of ambitious businesses.'],
        ['home', 'why',      'Custom solutions, clear communication, scalable architecture and a process focused on real results.'],
        ['home', 'process',  'Discover, design, build and launch — a simple process with a stronger result.'],
        ['home', 'projects', 'Explore selected projects built to solve real business problems.'],
        ['home', 'cta',      'Tell us what you want to build and we will shape the right digital solution.'],
        ['about',   'about',   'We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.'],
        ['process', 'process', 'We discover, design, build and launch — with every step managed around your business goals.'],
      ];
      for (const [page, type, enBody] of sectionBodyTranslations) {
        await db.execute(
          `UPDATE site_sections
           SET body_en = ?
           WHERE page = ? AND type = ? AND (body_en IS NULL OR length(body_en) = 0)`,
          [enBody, page, type],
        );
      }

      // 6. Deduplicate core sections (keep oldest row per page+type)
      const coreByPage: [string, string[]][] = [
        ['home',    ['hero', 'services', 'about', 'why', 'process', 'projects', 'cta']],
        ['about',   ['about']],
        ['why',     ['why']],
        ['process', ['process']],
      ];
      for (const [page, types] of coreByPage) {
        for (const type of types) {
          await db.execute(
            `DELETE FROM site_sections
             WHERE page = ? AND type = ?
               AND id NOT IN (
                 SELECT MIN(id) FROM site_sections WHERE page = ? AND type = ?
               )`,
            [page, type, page, type],
          );
        }
      }

      // 7. Unique index to prevent future duplicates of core sections
      try {
        await db.execute(
          `CREATE UNIQUE INDEX IF NOT EXISTS idx_site_sections_core_unique
           ON site_sections (page, type)
           WHERE type IN ('hero','services','about','why','process','projects','cta')`,
        );
      } catch {
        // Index already exists
      }
    })().catch((e) => {
      initPromise = null; // allow retry on next request
      throw e;
    });
  }
  return initPromise;
}

// ── Convenience query wrapper ───────────────────────────────────────────────export async function query(sql: string, args: InArgs = []) {
export async function query(sql: string, args: InArgs = []) {
  await ensureDatabase();
  return db.execute({ sql, args });
}
