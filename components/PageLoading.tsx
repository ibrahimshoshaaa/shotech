'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function SkeletonBlock({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`shotech-skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function PageLoadingSkeleton() {
  return (
    <main className="shotech-page-loading" aria-label="جاري تحميل الصفحة" aria-busy="true">
      <style>{`
        .shotech-page-loading{
          min-height:calc(100vh - 78px);
          padding:72px 0 100px;
          background:#fff;
          color:#111;
        }
        .shotech-page-loading .loading-container{
          width:min(1180px,92%);
          margin:0 auto;
        }
        .shotech-skeleton{
          background:linear-gradient(90deg,#f1f1ef 0%,#ffffff 45%,#f1f1ef 100%);
          background-size:220% 100%;
          animation:shotech-loading-shimmer 1.35s ease-in-out infinite;
          border:1px solid #e5e5e3;
          border-radius:12px;
        }
        .shotech-page-loading .loading-eyebrow{
          width:112px;
          height:12px;
          margin:0 auto 24px;
          border-radius:999px;
        }
        .shotech-page-loading .loading-title{
          width:min(650px,88%);
          height:58px;
          margin:0 auto 18px;
          border-radius:14px;
        }
        .shotech-page-loading .loading-lead{
          width:min(540px,82%);
          height:18px;
          margin:0 auto 58px;
          border-radius:999px;
        }
        .shotech-page-loading .loading-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:18px;
        }
        .shotech-page-loading .loading-card{
          height:250px;
          border-radius:20px;
        }
        @keyframes shotech-loading-shimmer{
          0%{background-position:220% 0}
          100%{background-position:-220% 0}
        }
        @media(max-width:700px){
          .shotech-page-loading{
            min-height:calc(100vh - 70px);
            padding:62px 0 80px;
          }
          .shotech-page-loading .loading-grid{
            grid-template-columns:1fr;
            gap:14px;
          }
          .shotech-page-loading .loading-card{
            height:190px;
          }
          .shotech-page-loading .loading-title{
            height:46px;
          }
        }
        @media(prefers-reduced-motion:reduce){
          .shotech-skeleton{animation:none}
        }
      `}</style>
      <div className="loading-container">
        <SkeletonBlock className="loading-eyebrow" />
        <SkeletonBlock className="loading-title" />
        <SkeletonBlock className="loading-lead" />
        <div className="loading-grid">
          {[1,2,3].map((item) => <SkeletonBlock key={item} className="loading-card" />)}
        </div>
      </div>
    </main>
  );
}

export default function NavigationLoading() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const current = window.location.pathname + window.location.search;
      const next = url.pathname + url.search;
      if (current === next) return;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(true), 80);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="shotech-navigation-loading" aria-live="polite" aria-label="جاري تحميل الصفحة">
      <PageLoadingSkeleton />
      <style>{`
        .shotech-navigation-loading{
          position:fixed;
          inset:0;
          z-index:40;
          overflow:auto;
          background:#fff;
        }
        .shotech-navigation-loading .shotech-page-loading{
          min-height:100vh;
          padding-top:72px;
        }
      `}</style>
    </div>
  );
}
