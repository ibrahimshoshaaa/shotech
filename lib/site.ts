import { unstable_cache } from 'next/cache';
import { query } from './db';
import { CACHE_REVALIDATE_SECONDS, siteTags } from './site-cache';

const getSettingsCached = unstable_cache(
  async () => {
    const r = await query('SELECT key,value FROM settings');
    return Object.fromEntries(r.rows.map((x: any) => [x.key, x.value]));
  },
  ['site-settings'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.settings] }
);

const getServicesCached = unstable_cache(
  async () => (await query('SELECT * FROM services WHERE visible=1 ORDER BY sort_order,id')).rows as any[],
  ['site-services'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.services] }
);

const getProjectsAllCached = unstable_cache(
  async () => (await query("SELECT * FROM projects WHERE status='published' ORDER BY created_at DESC")).rows as any[],
  ['site-projects-all'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects] }
);

const getFeaturedProjectsCached = unstable_cache(
  async () => (await query("SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY created_at DESC")).rows as any[],
  ['site-projects-featured'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects] }
);

export async function getSettings() {
  return getSettingsCached();
}

export async function getServices() {
  return getServicesCached();
}

export async function getService(slug: string) {
  const getCached = unstable_cache(
    async () => (await query('SELECT * FROM services WHERE slug=? AND visible=1', [slug])).rows[0] as any,
    ['site-service', slug],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.services, siteTags.service(slug)] }
  );
  return getCached();
}

export async function getProjects(featured = false) {
  return featured ? getFeaturedProjectsCached() : getProjectsAllCached();
}

export async function getProject(slug: string) {
  const getCached = unstable_cache(
    async () => (await query("SELECT * FROM projects WHERE slug=? AND status='published'", [slug])).rows[0] as any,
    ['site-project', slug],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects, siteTags.project(slug)] }
  );
  return getCached();
}

export async function getSections(page = 'home') {
  const getCached = unstable_cache(
    async () => {
      const core = ['hero', 'services', 'about', 'why', 'process', 'projects', 'cta'];
      const placeholders = core.map(() => '?').join(',');
      const sql = `SELECT * FROM site_sections
        WHERE page=? AND visible=1
        AND (type NOT IN (${placeholders}) OR id IN (
          SELECT MIN(id) FROM site_sections WHERE page=? AND type IN (${placeholders}) GROUP BY type
        ) OR ? <> 'home')
        ORDER BY sort_order,id`;
      const args = [page, ...core, page, ...core, page];
      return (await query(sql, args)).rows as any[];
    },
    ['site-sections', page],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.sections(page)] }
  );
  return getCached();
}
