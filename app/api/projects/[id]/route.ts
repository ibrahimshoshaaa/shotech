import {query} from '@/lib/db';
import {json,slugify} from '@/lib/utils';
import {isAdmin} from '@/lib/admin';
import { invalidateProjectsCache } from '@/lib/site-cache';

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});
    const {id}=await params,b=await req.json();
    const old=await query('SELECT slug FROM projects WHERE id=?',[id]);
    const slug=slugify(b.slug||b.title);
    await query('UPDATE projects SET title=?,slug=?,excerpt=?,content=?,cover_image=?,images=?,technologies=?,category=?,demo_url=?,github_url=?,status=?,featured=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[b.title,slug,b.excerpt||'',b.content||'',b.cover_image||'',json(b.images||[]),json(b.technologies||[]),b.category||'',b.demo_url||'',b.github_url||'',b.status||'draft',b.featured?1:0,id]);
    invalidateProjectsCache(slug);
    const oldSlug=(old.rows[0] as any)?.slug;
    if(oldSlug&&oldSlug!==slug)invalidateProjectsCache(oldSlug);
    return Response.json({ok:true});
  }catch(e:any){return Response.json({error:e.message},{status:400})}
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});
  const {id}=await params;
  const old=await query('SELECT slug FROM projects WHERE id=?',[id]);
  await query('DELETE FROM projects WHERE id=?',[id]);
  invalidateProjectsCache((old.rows[0] as any)?.slug);
  return Response.json({ok:true});
}
