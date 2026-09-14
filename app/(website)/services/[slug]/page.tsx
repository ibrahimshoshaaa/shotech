import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getService } from '@/lib/site';
import { getServiceIcon } from '@/lib/service-icons';

export const dynamic = 'force-dynamic';

function contentParagraphs(content: string, fallback: string) {
  const text = (content || fallback || '').trim();
  return text
    .split(/\n\s*\n|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const Icon = getServiceIcon(service.icon);
  const paragraphs = contentParagraphs(service.content, service.description);

  return (
    <main>
      <section className="page-hero" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div className="eyebrow">SHOTECH SERVICE</div>
          <h1>{service.title}</h1>
          <p>{service.description || 'حل رقمي مصمم حسب احتياج مشروعك.'}</p>
        </div>
      </section>

      <section className="section" style={{ position: 'relative', zIndex: 1, clear: 'both' }}>
        <div className="container detail-layout">
          <div className="detail-copy">
            <div className="service-icon"><Icon size={28} /></div>
            <div className="eyebrow">تفاصيل الخدمة</div>
            <h2>حل رقمي معمول عشان يخدم هدفك.</h2>

            <div className="service-content">
              {paragraphs.map((paragraph, index) => (
                <p className={index === 0 ? 'lead' : ''} key={`${service.id}-${index}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="check-list">
              <div className="check">
                <span className="check-mark">✓</span>
                <div>
                  <b>تنفيذ حسب احتياجك</b>
                  <span>بنشتغل على المطلوب فعلاً بدل ما نفرض قالب ثابت على مشروعك.</span>
                </div>
              </div>
              <div className="check">
                <span className="check-mark">✓</span>
                <div>
                  <b>قابل للتطوير</b>
                  <span>بنراعي إن الحل يكبر مع مشروعك وتقدر تطور عليه بعدين.</span>
                </div>
              </div>
              <div className="check">
                <span className="check-mark">✓</span>
                <div>
                  <b>تجربة واضحة</b>
                  <span>الهدف إن المنتج النهائي يكون عملي وسهل الاستخدام والإدارة.</span>
                </div>
              </div>
            </div>

            <Link href="/contact" className="btn btn-primary">
              اطلب الخدمة <ArrowLeft size={17} />
            </Link>
          </div>

          <div
            className="detail-image"
            style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate' }}
          >
            {service.cover_image ? (
              <Image
                src={service.cover_image}
                alt={service.title}
                width={900}
                height={650}
                priority
              />
            ) : (
              <div
                style={{
                  minHeight: 440,
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  padding: 30,
                  background: 'linear-gradient(145deg,#102c3a,#0a1722)',
                }}
              >
                <div
                  style={{
                    width: 'min(360px, 90%)',
                    padding: '34px 28px',
                    borderRadius: 22,
                    background: '#102c3a',
                    border: '1px solid rgba(80,214,198,.2)',
                    boxShadow: '0 30px 60px rgba(0,0,0,.28)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      margin: '0 auto 18px',
                      borderRadius: 18,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(80,214,198,.09)',
                      border: '1px solid rgba(80,214,198,.15)',
                      color: 'var(--wa)',
                    }}
                  >
                    <Icon size={32} />
                  </div>
                  <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.5 }}>{service.title}</strong>
                  <p style={{ margin: '10px 0 0', color: 'var(--wm)', lineHeight: 1.9, fontSize: 13 }}>
                    {service.description || 'حل رقمي مصمم حول احتياج مشروعك.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <div className="eyebrow">LET'S BUILD</div>
              <h2>جاهز نبدأ في خدمتك؟</h2>
              <p>ابعت تفاصيل بسيطة عن مشروعك ونحدد مع بعض أفضل طريقة للتنفيذ.</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              تواصل معنا <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
