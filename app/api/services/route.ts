import {query} from '@/lib/db';
import {isAdmin} from '@/lib/admin';
import {slugify} from '@/lib/utils';

export async function GET(){return Response.json((await query('SELECT * FROM services ORDER BY sort_order,id')).rows)}
export async function POST(req:Request){if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});const b=await req.json();const slug=slugify(b.slug||b.title);await query('INSERT INTO services(title,description,content,slug,cover_image,icon,sort_order,visible) VALUES(?,?,?,?,?,?,?,?)',[b.title,b.description||'',b.content||'',slug,b.cover_image||'',b.icon||'Code2',Number(b.sort_order||0),b.visible===false?0:1]);return Response.json({ok:true})}
