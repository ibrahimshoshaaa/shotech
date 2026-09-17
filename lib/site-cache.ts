import { revalidateTag } from 'next/cache';

/** How long (seconds) Next.js caches DB responses before re-fetching. */
export const CACHE_REVALIDATE_SECONDS = 300;

export const siteTags = {
  settings:         'site-settings',
  services:         'site-services',
  projects:         'site-projects',
  sections:         (page: string)  => `site-sections-${page}`,
  service:          (slug: string)  => `site-service-${slug}`,
  project:          (slug: string)  => `site-project-${slug}`,
};

export function invalidateSettingsCache() {
  revalidateTag(siteTags.settings);
}

export function invalidateServicesCache(slug?: string) {
  revalidateTag(siteTags.services);
  if (slug) revalidateTag(siteTags.service(slug));
}

export function invalidateProjectsCache(slug?: string) {
  revalidateTag(siteTags.projects);
  if (slug) revalidateTag(siteTags.project(slug));
}

export function invalidateSectionsCache(page?: string) {
  const pages = page ? [page] : ['home', 'about', 'why', 'process'];
  for (const p of pages) {
    revalidateTag(siteTags.sections(p));
  }
}
