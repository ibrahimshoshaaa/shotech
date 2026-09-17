import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(
    (await query('SELECT * FROM messages ORDER BY created_at DESC')).rows,
  );
}
