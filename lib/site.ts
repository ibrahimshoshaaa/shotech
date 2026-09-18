import { unstable_cache } from 'next/cache';
import { query } from './db';
import { CACHE_REVALIDATE_SECONDS, siteTags } from './site-cache';
import type { Locale } from './i18n';

const getSettingsCached=unstable_cache(async()=>{const r=await query('SELECT key,value FROM settings');return Object.fromEntries(r.rows.map((x:any)=>[x.key,x.value]));},['site-settings'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.settings]});
export async function getSettings(){return getSettingsCached();}
const getServicesCached=unstable_cache(async()=>(await query('SELECT * FROM services WHERE visible=1 ORDER BY sort_order,id')).rows as any[],['site-services'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.services]});
const getServiceCached=unstable_cache(async(slug:string)=>(await query('SELECT * FROM services WHERE slug=? AND visible=1',[slug])).rows[0] as any,['site-service'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.services]});
function serviceLocale(x:any,locale:Locale){return locale!=='en'?x:{...x,title:x.title_en||x.title,description:x.description_en||x.description,content:x.content_en||x.content};}
export async function getServices(locale:Locale='ar'){return(await getServicesCached()).map(x=>serviceLocale(x,locale));}
export async function getService(slug:string,locale:Locale='ar'){const x=await getServiceCached(slug);return x?serviceLocale(x,locale):x;}
const getProjectsAllCached=unstable_cache(async()=>(await query("SELECT * FROM projects WHERE status='published' ORDER BY sort_order,created_at DESC")).rows as any[],['site-projects-all'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.projects]});
const getFeaturedProjectsCached=unstable_cache(async()=>(await query("SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY sort_order,created_at DESC")).rows as any[],['site-projects-featured'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.projects]});
const getProjectCached=unstable_cache(async(slug:string)=>(await query("SELECT * FROM projects WHERE slug=? AND status='published'",[slug])).rows[0] as any,['site-project'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.projects]});
function projectLocale(x:any,locale:Locale){return locale!=='en'?x:{...x,title:x.title_en||x.title,excerpt:x.excerpt_en||x.excerpt,content:x.content_en||x.content,category:x.category_en||x.category};}
export async function getProjects(featured=false,locale:Locale='ar'){const rows=featured?await getFeaturedProjectsCached():await getProjectsAllCached();return rows.map(x=>projectLocale(x,locale));}
export async function getProject(slug:string,locale:Locale='ar'){const x=await getProjectCached(slug);return x?projectLocale(x,locale):x;}
const getSectionsCached=unstable_cache(async(page:string)=>(await query('SELECT * FROM site_sections WHERE page=? AND visible=1 ORDER BY sort_order,id',[page])).rows as any[],['site-sections'],{revalidate:CACHE_REVALIDATE_SECONDS,tags:[siteTags.sectionsAll]});
export async function getSections(page='home',locale:Locale='ar'){const rows=await getSectionsCached(page);return rows.map((x:any)=>locale!=='en'?x:{...x,title:x.title_en||x.title,subtitle:x.subtitle_en||x.subtitle,body:x.body_en||x.body,button_text:x.button_text_en||x.button_text});}
