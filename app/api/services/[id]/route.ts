import { query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { slugify } from '@/lib/utils';
import { invalidateServicesCache } from '@/lib/site-cache';
import { serviceSchema } from '@/lib/validation';

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    if(!await isAdmin()) return Response.json({error:'Unauthorized'},{status:401});
    const {id}=await params, parsed=serviceSchema.safeParse(await req.json());
    if(!parsed.success) return Response.json({error:'Invalid service data.',details:parsed.error.flatten()},{status:400});
    const b=parsed.data, old=await query('SELECT slug FROM services WHERE id=?',[id]), slug=slugify(b.slug||b.title);if(!slug)return Response.json({error:'A valid title or slug is required.'},{status:400});
    const duplicate=await query('SELECT id FROM services WHERE slug=? AND id<>? LIMIT 1',[slug,id]);
    if(duplicate.rows.length) return Response.json({error:'A service with this slug already exists.'},{status:409});
    await query('UPDATE services SET title=?,title_en=?,description=?,description_en=?,content=?,content_en=?,slug=?,cover_image=?,icon=?,sort_order=?,visible=? WHERE id=?',[b.title,b.title_en,b.description,b.description_en,b.content,b.content_en,slug,b.cover_image,b.icon||'Code2',b.sort_order,b.visible?1:0,id]);
    invalidateServicesCache(slug);
    const oldSlug=(old.rows[0] as any)?.slug;
    if(oldSlug&&oldSlug!==slug) invalidateServicesCache(oldSlug);
    return Response.json({ok:true});
  } catch { return Response.json({error:'Unable to update service.'},{status:400}); }
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    if(!await isAdmin()) return Response.json({error:'Unauthorized'},{status:401});
    const {id}=await params, old=await query('SELECT slug FROM services WHERE id=?',[id]);
    await query('DELETE FROM services WHERE id=?',[id]);
    invalidateServicesCache((old.rows[0] as any)?.slug);
    return Response.json({ok:true});
  } catch { return Response.json({error:'Unable to delete service.'},{status:400}); }
}
