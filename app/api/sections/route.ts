import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { invalidateSectionsCache } from '@/lib/site-cache';
import { sectionSchema } from '@/lib/validation';

const coreTypes = ['hero','services','about','why','process','projects','cta'];

export async function GET(req: Request) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const page = new URL(req.url).searchParams.get('page') || 'home';
  return Response.json((await query('SELECT * FROM site_sections WHERE page=? ORDER BY sort_order,id',[page])).rows);
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = sectionSchema.safeParse(await req.json());
    if (!parsed.success) return Response.json({ error:'Invalid section data.', details:parsed.error.flatten() }, { status:400 });
    const b = parsed.data, page=b.page, type=b.type;
    if (coreTypes.includes(type)) {
      const existing=await query('SELECT id FROM site_sections WHERE page=? AND type=? ORDER BY id LIMIT 1',[page,type]);
      if(existing.rows.length){
        const id=(existing.rows[0] as any).id;
        await query('UPDATE site_sections SET title=?,title_en=?,subtitle=?,subtitle_en=?,body=?,body_en=?,icon=?,image=?,button_text=?,button_text_en=?,button_url=?,data=?,sort_order=?,visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[b.title,b.title_en,b.subtitle,b.subtitle_en,b.body,b.body_en,b.icon,b.image,b.button_text,b.button_text_en,b.button_url,b.data,b.sort_order,b.visible?1:0,id]);
        invalidateSectionsCache(page);
        return Response.json({ok:true,id,updated:true});
      }
    }
    await query('INSERT INTO site_sections(page,type,title,title_en,subtitle,subtitle_en,body,body_en,icon,image,button_text,button_text_en,button_url,data,sort_order,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[page,type,b.title,b.title_en,b.subtitle,b.subtitle_en,b.body,b.body_en,b.icon,b.image,b.button_text,b.button_text_en,b.button_url,b.data,b.sort_order,b.visible?1:0]);
    invalidateSectionsCache(page);
    return Response.json({ok:true});
  } catch { return Response.json({error:'Unable to save section.'},{status:400}); }
}
