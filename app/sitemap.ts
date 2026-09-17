import { MetadataRoute } from 'next';
import { query } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shotechsolutions.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,              priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${BASE_URL}/about`,   priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/process`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/contact`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/services`,priority: 0.9, changeFrequency: 'weekly'  },
    { url: `${BASE_URL}/projects`,priority: 0.9, changeFrequency: 'weekly'  },
  ];

  // Dynamic: services
  const servicesRows = (
    await query("SELECT slug FROM services WHERE visible = 1 AND slug IS NOT NULL AND slug != ''")
  ).rows as { slug: string }[];

  const servicePages: MetadataRoute.Sitemap = servicesRows.map(({ slug }) => ({
    url:             `${BASE_URL}/services/${slug}`,
    priority:        0.7,
    changeFrequency: 'monthly',
  }));

  // Dynamic: projects
  const projectRows = (
    await query("SELECT slug, updated_at FROM projects WHERE status = 'published'")
  ).rows as { slug: string; updated_at: string }[];

  const projectPages: MetadataRoute.Sitemap = projectRows.map(({ slug, updated_at }) => ({
    url:             `${BASE_URL}/projects/${slug}`,
    lastModified:    new Date(updated_at),
    priority:        0.8,
    changeFrequency: 'monthly',
  }));

  return [...staticPages, ...servicePages, ...projectPages];
}
