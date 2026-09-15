import {query} from '@/lib/db';
import {isAdmin} from '@/lib/admin';
import { invalidateSectionsCache } from '@/lib/site-cache';

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});
  const {id}=await params;
  const b=await req.json();
  const page=b.page||'home';
  await query('UPDATE site_sections SET page=?,type=?,title=?,subtitle=?,body=?,icon=?,image=?,button_text=?,button_url=?,data=?,sort_order=?,visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[page,b.type||'custom',b.title||'',b.subtitle||'',b.body||'',b.icon||'',b.image||'',b.button_text||'',b.button_url||'',b.data||'{}',Number(b.sort_order||0),b.visible===false?0:1,id]);
  invalidateSectionsCache(page);
  return Response.json({ok:true});
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});
  const {id}=await params;
  const existing=await query('SELECT page FROM site_sections WHERE id=?',[id]);
  await query('DELETE FROM site_sections WHERE id=?',[id]);
  const page=(existing.rows[0] as any)?.page;
  if(page) invalidateSectionsCache(page);
  return Response.json({ok:true});
}
