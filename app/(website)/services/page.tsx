import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServices } from '@/lib/site';
import { getServiceIcon } from '@/lib/service-icons';

export const dynamic = 'force-dynamic';

function titleSize(title: string) {
  return Math.max(12, Math.min(20, 430 / Math.max(title.length, 1)));
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">SHOTECH SERVICES</div>
          <h1>خدماتنا مبنية حول شغلك.</h1>
          <p>
            حلول رقمية مخصصة من الموقع والتطبيق إلى الأنظمة الداخلية وقواعد البيانات.
            كل خدمة لها هدف واضح، وكل جزء بيتبني عشان يكمل الصورة.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {services.length > 0 ? (
            <div className="cards">
              {services.map((service: any) => {
                const Icon = getServiceIcon(service.icon);
                const size = titleSize(service.title || '');
                return (
                  <article className="service-card" key={service.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div className="service-icon" style={{ flex: '0 0 54px' }}>
                        <Icon size={25} />
                      </div>
                      <h3 style={{ margin: 0, flex: 1, minWidth: 0, fontSize: `${size}px`, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {service.title}
                      </h3>
                    </div>
                    <p style={{ marginTop: 22 }}>{service.description || 'حل رقمي مصمم حسب احتياج مشروعك.'}</p>
                    <Link className="card-link" href={`/services/${service.slug}`}>
                      تفاصيل الخدمة <ArrowLeft size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty">الخدمات هتظهر هنا بعد إضافتها من لوحة التحكم.</div>
          )}
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="cta">
          <div>
            <div className="eyebrow">CUSTOM SOLUTIONS</div>
            <h2>مش لاقي الخدمة اللي محتاجها؟</h2>
            <p>قولنا فكرتك حتى لو لسه مش عارف تتنفذ إزاي.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            احكيلنا عن فكرتك <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
