import { db, query } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { invalidateSettingsCache } from '@/lib/site-cache';
import { settingsSchema } from '@/lib/validation';

export async function GET() {
  if (!await isAdmin()) return Response.json({error:'Unauthorized'},{status:401});
  const r=await query('SELECT key,value FROM settings');
  return Response.json(Object.fromEntries(r.rows.map((x:any)=>[x.key,x.value])));
}
export async function PUT(req:Request) {
  try {
    if(!await isAdmin()) return Response.json({error:'Unauthorized'},{status:401});
    const parsed=settingsSchema.safeParse(await req.json());
    if(!parsed.success) return Response.json({error:'Invalid settings data.',details:parsed.error.flatten()},{status:400});
    const statements=Object.entries(parsed.data).map(([key,value])=>({
      sql:'INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
      args:[key,value],
    }));
    if(statements.length) await db.batch(statements,'write');
    invalidateSettingsCache();
    return Response.json({ok:true});
  } catch { return Response.json({error:'Unable to save settings.'},{status:400});}
}