import { unstable_cache } from 'next/cache';
import { query } from './db';
import { CACHE_REVALIDATE_SECONDS, siteTags } from './site-cache';
import type { Locale } from './i18n';

// ── Settings ─────────────────────────────────────────────────────────────────
const getSettingsCached = unstable_cache(
  async () => {
    const r = await query('SELECT key, value FROM settings');
    return Object.fromEntries(r.rows.map((x: any) => [x.key, x.value]));
  },
  ['site-settings'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.settings] },
);

export async function getSettings() {
  return getSettingsCached();
}

// ── Services ─────────────────────────────────────────────────────────────────
const getServicesCached = unstable_cache(
  async () =>
    (await query('SELECT * FROM services WHERE visible = 1 ORDER BY sort_order, id'))
      .rows as any[],
  ['site-services'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.services] },
);

function serviceLocale(x: any, locale: Locale) {
  if (locale !== 'en') return x;
  return {
    ...x,
    title:       x.title_en       || x.title,
    description: x.description_en || x.description,
    content:     x.content_en     || x.content,
  };
}

export async function getServices(locale: Locale = 'ar') {
  return (await getServicesCached()).map((x) => serviceLocale(x, locale));
}

export async function getService(slug: string, locale: Locale = 'ar') {
  const cached = unstable_cache(
    async () =>
      (await query('SELECT * FROM services WHERE slug = ? AND visible = 1', [slug]))
        .rows[0] as any,
    ['site-service', slug],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.services, siteTags.service(slug)] },
  );
  const x = await cached();
  return x ? serviceLocale(x, locale) : x;
}

// ── Projects ─────────────────────────────────────────────────────────────────
const getProjectsAllCached = unstable_cache(
  async () =>
    (await query("SELECT * FROM projects WHERE status = 'published' ORDER BY created_at DESC"))
      .rows as any[],
  ['site-projects-all'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects] },
);

const getFeaturedProjectsCached = unstable_cache(
  async () =>
    (await query("SELECT * FROM projects WHERE status = 'published' AND featured = 1 ORDER BY created_at DESC"))
      .rows as any[],
  ['site-projects-featured'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects] },
);

function projectLocale(x: any, locale: Locale) {
  if (locale !== 'en') return x;
  return {
    ...x,
    title:    x.title_en    || x.title,
    excerpt:  x.excerpt_en  || x.excerpt,
    content:  x.content_en  || x.content,
    category: x.category_en || x.category,
  };
}

export async function getProjects(featured = false, locale: Locale = 'ar') {
  const rows = featured ? await getFeaturedProjectsCached() : await getProjectsAllCached();
  return rows.map((x) => projectLocale(x, locale));
}

export async function getProject(slug: string, locale: Locale = 'ar') {
  const cached = unstable_cache(
    async () =>
      (await query("SELECT * FROM projects WHERE slug = ? AND status = 'published'", [slug]))
        .rows[0] as any,
    ['site-project', slug],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.projects, siteTags.project(slug)] },
  );
  const x = await cached();
  return x ? projectLocale(x, locale) : x;
}

// ── Site sections ─────────────────────────────────────────────────────────────
const CORE_SECTION_TYPES = ['hero', 'services', 'about', 'why', 'process', 'projects', 'cta'];

export async function getSections(page = 'home', locale: Locale = 'ar') {
  const cached = unstable_cache(
    async () => {
      // For home page: return only the canonical (MIN id) row per core type.
      // For other pages: return all visible sections ordered by sort_order.
      const placeholders = CORE_SECTION_TYPES.map(() => '?').join(', ');
      const sql = `
        SELECT * FROM site_sections
        WHERE page = ?
          AND visible = 1
          AND (
            type NOT IN (${placeholders})
            OR id IN (
              SELECT MIN(id)
              FROM site_sections
              WHERE page = ? AND type IN (${placeholders})
              GROUP BY type
            )
            OR ? <> 'home'
          )
        ORDER BY sort_order, id
      `;
      return (
        await query(sql, [page, ...CORE_SECTION_TYPES, page, ...CORE_SECTION_TYPES, page])
      ).rows as any[];
    },
    ['site-sections', page],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [siteTags.sections(page)] },
  );

  const rows = await cached();
  return rows.map((x: any) => {
    if (locale !== 'en') return x;
    return {
      ...x,
      title:       x.title_en       || x.title,
      subtitle:    x.subtitle_en    || x.subtitle,
      body:        x.body_en        || x.body,
      button_text: x.button_text_en || x.button_text,
    };
  });
}
