import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const isVercel = process.env.VERCEL === '1';

if (!url && isVercel) {
  throw new Error('TURSO_DATABASE_URL is required on Vercel. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Project Settings → Environment Variables.');
}

export const db = createClient({
  url: url || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = [
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    images TEXT DEFAULT '[]',
    technologies TEXT DEFAULT '[]',
    category TEXT,
    demo_url TEXT,
    github_url TEXT,
    status TEXT DEFAULT 'draft',
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Code2',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
  `INSERT OR IGNORE INTO settings(key,value) VALUES
    ('companyName','ShoTech Solutions'),
    ('tagline','Smart Solutions. Powerful Systems.'),
    ('email',''),('whatsapp',''),('facebook',''),('instagram',''),
    ('linkedin',''),('github',''),('seoTitle','ShoTech Solutions'),
    ('seoDescription','Smart digital solutions and powerful systems.')`
];

let initPromise: Promise<void> | null = null;

export function ensureDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      for (const sql of schema) await db.execute(sql);
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export async function query(sql: string, args: any[] = []) {
  await ensureDatabase();
  return db.execute({ sql, args });
}
