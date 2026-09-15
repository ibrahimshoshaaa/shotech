import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="website-shell">
      <ScrollToTop />
      <style>{`
        .website-shell .hero-actions{display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:nowrap!important;gap:12px!important}
        .website-shell .hero-actions .btn{white-space:nowrap!important}
        @media (max-width:420px){.website-shell .hero-actions{gap:8px!important}.website-shell .hero-actions .btn{padding:11px 13px!important;font-size:13px!important;flex:1 1 0!important}}
      `}</style>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
