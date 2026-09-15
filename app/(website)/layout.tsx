import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="website-shell">
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
