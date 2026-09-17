'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const COOKIE = 'shotech-locale';

type Locale = 'ar' | 'en';

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function change(next: Locale) {
    if (next === locale || busy) return;

    setBusy(true);
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();

    // router.refresh() does not change the pathname, so a pathname-based
    // effect cannot reliably clear this state. Allow the next toggle after
    // the refresh has been scheduled.
    window.setTimeout(() => setBusy(false), 250);
  }

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={() => change(locale === 'ar' ? 'en' : 'ar')}
      disabled={busy}
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
