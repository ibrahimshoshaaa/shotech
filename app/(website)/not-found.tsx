import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main>
      <section className="page-hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow">404</div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '1rem' }}>
            الصفحة مش موجودة
          </h1>
          <p className="muted" style={{ maxWidth: 480, margin: '0 auto 2rem' }}>
            يمكن الرابط اتغير أو الصفحة دي اتحذفت.
            رجع للرئيسية وابدأ من هناك.
          </p>
          <Link href="/" className="btn btn-primary">
            الرئيسية <ArrowLeft size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
