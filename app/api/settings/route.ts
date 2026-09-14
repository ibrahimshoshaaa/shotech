import {query} from '@/lib/db';import {isAdmin} from '@/lib/admin';
export async function GET(){const r=await query('SELECT key,value FROM settings');return Response.json(Object.fromEntries(r.rows.map((x:any)=>[x.key,x.value])))}
export async function PUT(req:Request){if(!await isAdmin())return Response.json({error:'Unauthorized'},{status:401});const b=await req.json();for(const [k,v] of Object.entries(b))await query('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',[k,String(v)]);return Response.json({ok:true})}
