import { createHash } from 'node:crypto';
import { query } from '@/lib/db';
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
function keyFor(scope: string, ip: string) { const secret = process.env.JWT_SECRET || 'shotech-rate-limit'; return scope + ':' + createHash('sha256').update(secret + ':' + ip).digest('hex'); }
export async function checkRateLimit(scope: string, ip: string) {
  const key=keyFor(scope,ip), now=Date.now();
  await query("INSERT INTO rate_limits(key,window_start,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET window_start=CASE WHEN window_start+? <= ? THEN excluded.window_start ELSE window_start END, count=CASE WHEN window_start+? <= ? THEN 1 ELSE count+1 END",[key,now,WINDOW_MS,now,WINDOW_MS,now]);
  const result=await query('SELECT window_start,count FROM rate_limits WHERE key=?',[key]); const row=result.rows[0] as any;
  const windowStart=Number(row?.window_start ?? now), count=Number(row?.count ?? 1);
  return {allowed:count<=MAX_ATTEMPTS,retryAfterSec:Math.max(0,Math.ceil((windowStart+WINDOW_MS-now)/1000))};
}
export async function resetRateLimit(scope:string,ip:string){await query('DELETE FROM rate_limits WHERE key=?',[keyFor(scope,ip)]);}