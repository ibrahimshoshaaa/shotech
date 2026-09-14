import {cookies} from 'next/headers';export async function POST(){const c=await cookies();c.delete('shotech_admin');return Response.json({ok:true})}
