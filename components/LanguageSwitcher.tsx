'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  useEffect(() => setBusy(false), [pathname]);
  function change(next: Locale) {
    if (next === locale || busy) return;
    setBusy(true);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  return <button type="button" className="language-switcher" onClick={() => change(locale === 'ar' ? 'en' : 'ar')} disabled={busy} aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>{locale === 'ar' ? 'EN' : 'عربي'}</button>;
}
