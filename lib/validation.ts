import { z } from 'zod';

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default('');

export const projectSchema = z.object({
  title: text(200).min(1), title_en: optionalText(200), slug: optionalText(200),
  excerpt: optionalText(2000), excerpt_en: optionalText(2000), content: optionalText(50000), content_en: optionalText(50000),
  cover_image: optionalText(2000), images: z.array(text(2000)).max(50).optional().default([]),
  technologies: z.array(text(100)).max(50).optional().default([]), category: optionalText(200), category_en: optionalText(200),
  demo_url: optionalText(2000), github_url: optionalText(2000), status: z.enum(['draft','published']).default('draft'), featured: z.boolean().optional().default(false),
});

export const serviceSchema = z.object({
  title: text(200).min(1), title_en: optionalText(200), description: optionalText(2000), description_en: optionalText(2000),
  content: optionalText(50000), content_en: optionalText(50000), slug: optionalText(200), cover_image: optionalText(2000), icon: optionalText(100),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0), visible: z.boolean().optional().default(true),
});

export const sectionSchema = z.object({
  page: text(100).default('home'), type: text(100).default('custom'), title: optionalText(500), title_en: optionalText(500),
  subtitle: optionalText(1000), subtitle_en: optionalText(1000), body: optionalText(20000), body_en: optionalText(20000),
  icon: optionalText(100), image: optionalText(2000), button_text: optionalText(300), button_text_en: optionalText(300),
  button_url: optionalText(2000), data: optionalText(20000), sort_order: z.coerce.number().int().min(0).max(100000).default(0), visible: z.boolean().optional().default(true),
});

export const settingsSchema = z.record(z.string().trim().min(1).max(100), z.string().max(10000));
