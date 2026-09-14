import { query } from './db';

export async function getSettings(){const r=await query('SELECT key,value FROM settings');return Object.fromEntries(r.rows.map((x:any)=>[x.key,x.value]));}
export async function getServices(){return (await query('SELECT * FROM services WHERE visible=1 ORDER BY sort_order,id')).rows as any[]}
export async function getService(slug:string){return (await query("SELECT * FROM services WHERE slug=? AND visible=1",[slug])).rows[0] as any}
export async function getProjects(featured=false){const sql=featured?"SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY created_at DESC":"SELECT * FROM projects WHERE status='published' ORDER BY created_at DESC";return (await query(sql)).rows as any[]}

// The homepage has one slot for each core section. Older seed data could contain
// duplicate rows because site_sections has no unique constraint on page/type.
// Keep the first row for each core homepage section and leave custom sections alone.
export async function getSections(page='home'){
  const core=['hero','services','about','why','process','projects','cta'];
  const placeholders=core.map(()=>'?').join(',');
  const sql=`SELECT * FROM site_sections
    WHERE page=? AND visible=1
    AND (type NOT IN (${placeholders}) OR id IN (
      SELECT MIN(id) FROM site_sections WHERE page=? AND type IN (${placeholders}) GROUP BY type
    ) OR ? <> 'home')
    ORDER BY sort_order,id`;
  const args=[page,...core,page,...core,page];
  return (await query(sql,args)).rows as any[];
}
