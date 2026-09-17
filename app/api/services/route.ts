import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { slugify } from '@/lib/utils';
import { invalidateServicesCache } from '@/lib/site-cache';
import { serviceSchema } from '@/lib/validation';

export async function GET() {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json((await query('SELECT * FROM services ORDER BY sort_order,id')).rows);
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = serviceSchema.safeParse(await req.json());
    if (!parsed.success) return Response.json({ error: 'Invalid service data.', details: parsed.error.flatten() }, { status: 400 });
    const b = parsed.data;
    const slug = slugify(b.slug || b.title);
    const duplicate = await query('SELECT id FROM services WHERE slug=? LIMIT 1',[slug]);
    if (duplicate.rows.length) return Response.json({ error: 'A service with this slug already exists.' }, { status: 409 });
    await query('INSERT INTO services(title,title_en,description,description_en,content,content_en,slug,cover_image,icon,sort_order,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?)',[b.title,b.title_en,b.description,b.description_en,b.content,b.content_en,slug,b.cover_image,b.icon || 'Code2',b.sort_order,b.visible?1:0]);
    invalidateServicesCache(slug);
    return Response.json({ ok:true });
  } catch {
    return Response.json({ error:'Unable to save service.' }, { status:400 });
  }
}
