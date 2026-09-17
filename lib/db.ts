import { createClient, type InArgs } from '@libsql/client';

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

/** Runtime database access only. Schema creation and migrations belong to scripts/init-db.ts. */
export async function query(sql: string, args: InArgs = []) {
  return db.execute({ sql, args });
}
