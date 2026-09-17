import { createHash, timingSafeEqual } from 'node:crypto';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count:number; resetAt:number }>();

function getIP(req:Request){return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||'unknown';}
function checkRateLimit(ip:string){const now=Date.now(),entry=attempts.get(ip);if(!entry||now>entry.resetAt){attempts.set(ip,{count:1,resetAt:now+WINDOW_MS});return{allowed:true,retryAfterSec:0};}if(entry.count>=MAX_ATTEMPTS)return{allowed:false,retryAfterSec:Math.ceil((entry.resetAt-now)/1000)};entry.count+=1;return{allowed:true,retryAfterSec:0};}
function resetAttempts(ip:string){attempts.delete(ip);}
function safeEqual(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
function verifyPassword(password:string){
  const hashed=process.env.ADMIN_PASSWORD_HASH;
  if(hashed) return safeEqual(createHash('sha256').update(password).digest('hex'),hashed);
  return safeEqual(password,process.env.ADMIN_PASSWORD||'');
}

export async function POST(req:Request){
  const ip=getIP(req),{allowed,retryAfterSec}=checkRateLimit(ip);
  if(!allowed)return Response.json({error:`Too many failed attempts. Try again in ${Math.ceil(retryAfterSec/60)} minutes.`},{status:429,headers:{'Retry-After':String(retryAfterSec)}});
  try{
    const body=await req.json();
    const email=typeof body.email==='string'?body.email:'';
    const password=typeof body.password==='string'?body.password:'';
    if(!safeEqual(email,process.env.ADMIN_EMAIL||'')||!verifyPassword(password))return Response.json({error:'Invalid credentials'},{status:401});
    resetAttempts(ip);
    const token=await createToken(),c=await cookies();
    c.set('shotech_admin',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:604800});
    return Response.json({ok:true});
  }catch{return Response.json({error:'Invalid request.'},{status:400});}
}
