import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-change-me');
export async function createToken(){return new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret)}
export async function verifyToken(token?:string){try{return !!token && !!(await jwtVerify(token,secret));}catch{return false}}
