import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

export async function PUT(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await query("UPDATE messages SET status='read' WHERE id=?", [id]);
  return Response.json({ ok: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await query('DELETE FROM messages WHERE id=?', [id]);
  return Response.json({ ok: true });
}
