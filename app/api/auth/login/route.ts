import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const MAX_ATTEMPTS=5, WINDOW_MS=15*60*1000;
const attempts=new Map<string,{count:number;resetAt:number}>();
function getIP(req:Request){return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||'unknown';}
function checkRateLimit(ip:string){const now=Date.now(),entry=attempts.get(ip);if(!entry||now>entry.resetAt){attempts.set(ip,{count:1,resetAt:now+WINDOW_MS});return{allowed:true,retryAfterSec:0};}if(entry.count>=MAX_ATTEMPTS)return{allowed:false,retryAfterSec:Math.ceil((entry.resetAt-now)/1000)};entry.count+=1;return{allowed:true,retryAfterSec:0};}
function resetAttempts(ip:string){attempts.delete(ip);}
function safeEqual(a:Buffer,b:Buffer){return a.length===b.length&&timingSafeEqual(a,b);}
function verifyPassword(password:string){
  const stored=process.env.ADMIN_PASSWORD_HASH;
  if(stored){
    const [algorithm,saltHex,hashHex]=stored.split('$');
    if(algorithm!=='scrypt'||!saltHex||!hashHex)return false;
    try{return safeEqual(scryptSync(password,Buffer.from(saltHex,'hex'),64,{N:16384,r:8,p:1}),Buffer.from(hashHex,'hex'));}catch{return false;}
  }
  return safeEqual(Buffer.from(password),Buffer.from(process.env.ADMIN_PASSWORD||''));
}
export async function POST(req:Request){
  const ip=getIP(req),{allowed,retryAfterSec}=checkRateLimit(ip);
  if(!allowed)return Response.json({error:`Too many failed attempts. Try again in ${Math.ceil(retryAfterSec/60)} minutes.`},{status:429,headers:{'Retry-After':String(retryAfterSec)}});
  try{
    const body=await req.json(),email=typeof body.email==='string'?body.email:'',password=typeof body.password==='string'?body.password:'';
    if(!safeEqual(Buffer.from(email),Buffer.from(process.env.ADMIN_EMAIL||''))||!verifyPassword(password))return Response.json({error:'Invalid credentials'},{status:401});
    resetAttempts(ip);
    const token=await createToken(),c=await cookies();
    c.set('shotech_admin',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:604800});
    return Response.json({ok:true});
  }catch{return Response.json({error:'Invalid request.'},{status:400});}
}
