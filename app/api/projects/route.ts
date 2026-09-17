import { query } from '@/lib/db';
import { slugify, json } from '@/lib/utils';
import { isAdmin } from '@/lib/admin';
import { invalidateProjectsCache } from '@/lib/site-cache';

export async function GET() {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(
    (await query('SELECT * FROM projects ORDER BY created_at DESC')).rows,
  );
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const b = await req.json();
    const slug = slugify(b.slug || b.title);
    await query(
      'INSERT INTO projects(title,title_en,slug,excerpt,excerpt_en,content,content_en,cover_image,images,technologies,category,category_en,demo_url,github_url,status,featured) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [b.title,b.title_en||'',slug,b.excerpt||'',b.excerpt_en||'',b.content||'',b.content_en||'',b.cover_image||'',json(b.images||[]),json(b.technologies||[]),b.category||'',b.category_en||'',b.demo_url||'',b.github_url||'',b.status||'draft',b.featured?1:0],
    );
    invalidateProjectsCache(slug);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Unable to save project.' }, { status: 400 });
  }
}
