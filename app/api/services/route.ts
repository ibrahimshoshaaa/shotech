import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { slugify } from '@/lib/utils';
import { invalidateServicesCache } from '@/lib/site-cache';

export async function GET() {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(
    (await query('SELECT * FROM services ORDER BY sort_order,id')).rows,
  );
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const b = await req.json();
    const slug = slugify(b.slug || b.title);
    await query(
      'INSERT INTO services(title,title_en,description,description_en,content,content_en,slug,cover_image,icon,sort_order,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
      [b.title,b.title_en||'',b.description||'',b.description_en||'',b.content||'',b.content_en||'',slug,b.cover_image||'',b.icon||'Code2',Number(b.sort_order||0),b.visible===false?0:1],
    );
    invalidateServicesCache(slug);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Unable to save service.' }, { status: 400 });
  }
}
