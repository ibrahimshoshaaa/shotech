import {query} from '@/lib/db';
import {isAdmin} from '@/lib/admin';

const coreTypes=['hero','services','about','why','process','projects','cta'];

export async function GET(req:Request){const page=new URL(req.url).searchParams.get('page')||'home';return Response.json((await query('SELECT * FROM site_sections WHERE page=? ORDER BY sort_order,id',[page])).rows)}

export async function POST(req:Request){
 if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});
 const b=await req.json();
 const page=b.page||'home',type=b.type||'custom';
 const values=[page,type,b.title||'',b.subtitle||'',b.body||'',b.icon||'',b.image||'',b.button_text||'',b.button_url||'',b.data||'{}',Number(b.sort_order||0),b.visible===false?0:1];
 if(coreTypes.includes(type)){
   const existing=await query('SELECT id FROM site_sections WHERE page=? AND type=? ORDER BY id LIMIT 1',[page,type]);
   if(existing.rows.length){
     const id=(existing.rows[0] as any).id;
     await query('UPDATE site_sections SET title=?,subtitle=?,body=?,icon=?,image=?,button_text=?,button_url=?,data=?,sort_order=?,visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[b.title||'',b.subtitle||'',b.body||'',b.icon||'',b.image||'',b.button_text||'',b.button_url||'',b.data||'{}',Number(b.sort_order||0),b.visible===false?0:1,id]);
     return Response.json({ok:true,id,updated:true});
   }
 }
 await query('INSERT INTO site_sections(page,type,title,subtitle,body,icon,image,button_text,button_url,data,sort_order,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',values);
 return Response.json({ok:true});
}
