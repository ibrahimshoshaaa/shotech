import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="website-shell">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
