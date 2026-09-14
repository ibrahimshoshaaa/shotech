import { createClient } from '@libsql/client';
export const db = createClient({url: process.env.TURSO_DATABASE_URL || 'file:local.db', authToken: process.env.TURSO_AUTH_TOKEN});
export async function query(sql:string,args:any[]=[]){return db.execute({sql,args});}
