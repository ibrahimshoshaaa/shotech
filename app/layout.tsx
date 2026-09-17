import './globals.css';
import './website.css';
import './section-headings.css';
import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale-server';
import { getSettings } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getSettings();
  const english = locale === 'en';
  return {
    title: english
      ? settings.seoTitle_en || settings.seoTitle || 'ShoTech Solutions'
      : settings.seoTitle || 'ShoTech Solutions | حلول رقمية تبني فرقًا',
    description: english
      ? settings.seoDescription_en || settings.seoDescription || 'Smart digital solutions and powerful systems that help businesses grow.'
      : settings.seoDescription || 'ShoTech تبني مواقع وأنظمة وحلولًا رقمية عملية تساعد الشركات على النمو.',
  };
}

export default async function Root({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body>{children}</body></html>;
}
