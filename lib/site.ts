import { query } from './db';

export async function getSettings(){const r=await query('SELECT key,value FROM settings');return Object.fromEntries(r.rows.map((x:any)=>[x.key,x.value]));}
export async function getServices(){return (await query('SELECT * FROM services WHERE visible=1 ORDER BY sort_order,id')).rows as any[]}
export async function getService(slug:string){return (await query("SELECT * FROM services WHERE slug=? AND visible=1",[slug])).rows[0] as any}
export async function getProjects(featured=false){const sql=featured?"SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY created_at DESC":"SELECT * FROM projects WHERE status='published' ORDER BY created_at DESC";return (await query(sql)).rows as any[]}
export async function getSections(page='home'){return (await query('SELECT * FROM site_sections WHERE page=? AND visible=1 ORDER BY sort_order,id',[page])).rows as any[]}
