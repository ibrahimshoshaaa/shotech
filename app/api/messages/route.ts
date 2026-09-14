import {query} from '@/lib/db';export async function GET(){return Response.json((await query('SELECT * FROM messages ORDER BY created_at DESC')).rows)}
