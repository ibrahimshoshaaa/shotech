import {query} from '@/lib/db';
import {isAdmin} from '@/lib/admin';

export async function GET(req:Request){const page=new URL(req.url).searchParams.get('page')||'home';return Response.json((await query('SELECT * FROM site_sections WHERE page=? ORDER BY sort_order,id',[page])).rows)}
export async function POST(req:Request){if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});const b=await req.json();await query('INSERT INTO site_sections(page,type,title,subtitle,body,icon,image,button_text,button_url,data,sort_order,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[b.page||'home',b.type||'custom',b.title||'',b.subtitle||'',b.body||'',b.icon||'',b.image||'',b.button_text||'',b.button_url||'',b.data||'{}',Number(b.sort_order||0),b.visible===false?0:1]);return Response.json({ok:true})}
