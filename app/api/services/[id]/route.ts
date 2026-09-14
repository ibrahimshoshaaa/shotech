import {query} from '@/lib/db';
import {isAdmin} from '@/lib/admin';
import {slugify} from '@/lib/utils';

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});const {id}=await params,b=await req.json();await query('UPDATE services SET title=?,description=?,content=?,slug=?,cover_image=?,icon=?,sort_order=?,visible=? WHERE id=?',[b.title,b.description||'',b.content||'',slugify(b.slug||b.title),b.cover_image||'',b.icon||'Code2',Number(b.sort_order||0),b.visible===false?0:1,id]);return Response.json({ok:true})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});const {id}=await params;await query('DELETE FROM services WHERE id=?',[id]);return Response.json({ok:true})}
