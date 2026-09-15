import { revalidateTag } from 'next/cache';

export const CACHE_REVALIDATE_SECONDS = 300;

export const siteTags = {
  settings: 'site-settings',
  services: 'site-services',
  projects: 'site-projects',
  sections: (page: string) => `site-sections-${page}`,
  service: (slug: string) => `site-service-${slug}`,
  project: (slug: string) => `site-project-${slug}`,
};

export function invalidateSettingsCache() {
  revalidateTag(siteTags.settings, 'max');
}

export function invalidateServicesCache(slug?: string) {
  revalidateTag(siteTags.services, 'max');
  if (slug) revalidateTag(siteTags.service(slug), 'max');
}

export function invalidateProjectsCache(slug?: string) {
  revalidateTag(siteTags.projects, 'max');
  if (slug) revalidateTag(siteTags.project(slug), 'max');
}

export function invalidateSectionsCache(page?: string) {
  if (page) revalidateTag(siteTags.sections(page), 'max');
  else {
    for (const p of ['home', 'about', 'why', 'process']) {
      revalidateTag(siteTags.sections(p), 'max');
    }
  }
}
