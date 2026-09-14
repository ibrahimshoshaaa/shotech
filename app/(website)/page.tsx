import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Code2, Database, LayoutDashboard, Smartphone, Sparkles, Globe2, ShoppingCart, Building2, MonitorSmartphone, Workflow, Palette, ShieldCheck, Rocket, Settings, Layers3, ChartNoAxesCombined } from 'lucide-react';
import { getProjects, getServices, getSettings } from '@/lib/site';

export const dynamic = 'force-dynamic';

const iconMap: Record<string, any> = { Code2, Database, LayoutDashboard, Smartphone, Sparkles, Globe2, ShoppingCart, Building2, MonitorSmartphone, Workflow, Palette, ShieldCheck, Rocket, Settings, Layers3, ChartNoAxesCombined };

const fallbackServices = [
  { id: '1', title: 'تطوير المواقع', description: 'مواقع سريعة، احترافية، ومتجاوبة مصممة حول هدف مشروعك.', icon: 'Globe2', slug: 'web-development' },
  { id: '2', title: 'الأنظمة الإدارية', description: 'أنظمة مخصصة لإدارة المبيعات، العملاء، المخزون والعمليات اليومية.', icon: 'LayoutDashboard', slug: 'business-systems' },
  { id: '3', title: 'تطبيقات الموبايل', description: 'تطبيقات Android وiOS بتجربة استخدام واضحة وأداء عملي.', icon: 'Smartphone', slug: 'mobile-apps' },
  { id: '4', title: 'قواعد البيانات والربط', description: 'بنية بيانات منظمة وربط آمن بين أجزاء النظام المختلفة.', icon: 'Database', slug: 'databases' },
  { id: '5', title: 'حلول مخصصة', description: 'نحوّل الفكرة أو المشكلة المتكررة إلى أداة رقمية مناسبة.', icon: 'Sparkles', slug: 'custom-solutions' },
  { id: '6', title: 'تطوير وتحسين', description: 'تطوير الأنظمة الموجودة وتحسين السرعة وتجربة المستخدم.', icon: 'Code2', slug: 'development' },
];

const fallbackProjects = [
  { id: '1', title: 'أنظمة أعمال مخصصة', category: 'BUSINESS SYSTEM', excerpt: 'حلول رقمية صُممت لتبسيط التشغيل والمتابعة اليومية.', slug: 'business-systems' },
  { id: '2', title: 'متاجر ومنصات رقمية', category: 'WEB PLATFORM', excerpt: 'تجارب ويب حديثة تساعد المشروع على الظهور والبيع بشكل أفضل.', slug: 'web-platforms' },
  { id: '3', title: 'تطبيقات موبايل', category: 'MOBILE APP', excerpt: 'تطبيقات عملية تربط العميل بالخدمة في خطوات واضحة.', slug: 'mobile-apps' },
];

export default async function Home() {
  const [settings, servicesData, projectsData] = await Promise.all([getSettings(), getServices(), getProjects(true)]);
  const services = servicesData.length ? servicesData.slice(0, 6) : fallbackServices;
  const projects = projectsData.length ? projectsData.slice(0, 3) : fallbackProjects;
  const about = settings.aboutBody || 'نحن في ShoTech نعمل على تحويل الأفكار والاحتياجات اليومية إلى حلول رقمية بسيطة، سريعة، وقابلة للتوسع. لا نبيع منتجًا واحدًا للجميع؛ نبني ما يناسب طبيعة كل مشروع.';

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">SHOTECH · DIGITAL SOLUTIONS</div>
          <h1>نبني حلولًا رقمية<br /><span>تشتغل معاك.</span></h1>
          <p className="hero-lead">من موقع احترافي إلى نظام متكامل لإدارة شغلك، بنحوّل احتياجاتك إلى تجربة رقمية واضحة، سريعة، ومصممة حول طريقة عملك.</p>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-primary">ابدأ مشروعك <ArrowLeft size={18}/></Link>
            <Link href="/projects" className="btn btn-outline">شوف أعمالنا</Link>
          </div>
          <div className="hero-note"><span><i/> حلول مخصصة</span><span><i/> تصميم وتجربة مستخدم</span><span><i/> دعم وتطوير مستمر</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-orb"><div className="hero-logo"><Image src="/shotech-mark.png" alt="ShoTech" width={270} height={180} priority/></div></div>
          <div className="float-box float-one"><strong>نظامك تحت السيطرة</strong><small>من الفكرة إلى التشغيل</small></div>
          <div className="float-box float-two"><strong>Built for your business</strong><small>Simple · Scalable · Reliable</small></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">خدماتنا</div><h2>كل اللي مشروعك محتاجه<br/>في مكان واحد.</h2></div><p className="muted">بنختار التقنية على أساس احتياجك، مش العكس. والنتيجة حل واضح وسهل استخدامه وتطويره.</p></div>
          <div className="cards">
            {services.map((service: any, i: number) => { const Icon = iconMap[service.icon] || Code2; return <article className="service-card" key={service.id || i}><span className="service-number">0{i + 1}</span><div className="service-icon"><Icon size={24}/></div><h3>{service.title}</h3><p>{service.description}</p><Link className="card-link" href={`/services/${service.slug}`}>اعرف أكتر <ArrowLeft size={15}/></Link></article>; })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-visual"><div className="visual-lines"/><div className="visual-center"><div className="visual-card"><b>ShoTech</b><p>نحوّل العمليات المكررة إلى خطوات رقمية أبسط، ونخلي البيانات في المكان الصح.</p><span className="eyebrow">SMART SYSTEMS</span></div></div></div>
          <div><div className="eyebrow">مين إحنا؟</div><h2>مش مجرد موقع.<br/>نبني لك نظام.</h2><p className="muted">{about}</p><div className="check-list"><div className="check"><span className="check-mark"><Check size={14}/></span><div><b>نفهم الشغل الأول</b><span>نبدأ من طريقة عملك والمشكلة اللي عايز تحلها.</span></div></div><div className="check"><span className="check-mark"><Check size={14}/></span><div><b>نبني بشكل عملي</b><span>واجهة سهلة، كود منظم، وبنية قابلة للتوسع.</span></div></div><div className="check"><span className="check-mark"><Check size={14}/></span><div><b>نكمل معاك</b><span>التطوير مش بيقف عند التسليم.</span></div></div></div><Link href="/about" className="btn btn-outline">اعرف ShoTech أكتر <ArrowLeft size={17}/></Link></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container"><div className="section-head"><div><div className="eyebrow">طريقة شغلنا</div><h2>من أول فكرة لحد التشغيل.</h2></div><p className="muted">خطوات بسيطة وواضحة من غير تعقيد.</p></div>
          <div className="steps"><div className="step"><span className="step-no">01</span><h3>نفهم</h3><p>نفهم هدف المشروع، المستخدمين، والعمليات اللي محتاجة تتطور.</p></div><div className="step"><span className="step-no">02</span><h3>نخطط</h3><p>نرتب المميزات والأولوية ونختار التقنية المناسبة.</p></div><div className="step"><span className="step-no">03</span><h3>نبني</h3><p>نصمم ونطور ونراجع كل جزء معاك خطوة بخطوة.</p></div><div className="step"><span className="step-no">04</span><h3>نطور</h3><p>بعد الإطلاق، نتابع ونحسن ونضيف حسب احتياجك.</p></div></div>
        </div>
      </section>

      <section className="section">
        <div className="container"><div className="section-head"><div><div className="eyebrow">أعمالنا</div><h2>مشاريع حقيقية.<br/>نتائج عملية.</h2></div><Link href="/projects" className="btn btn-outline">كل الأعمال <ArrowLeft size={17}/></Link></div>
          <div className="projects">{projects.map((project: any, i: number) => { let images:string[]=[]; try{images=JSON.parse(project.images||'[]')}catch{} const cover=project.cover_image||images[0]; return <Link href={`/projects/${project.slug}`} className="project-card" key={project.id||i}><div className="project-media">{cover?<Image src={cover} alt={project.title} width={700} height={450}/>:<div className="project-placeholder"><Sparkles size={34}/></div>}</div><div className="project-body"><div className="project-meta">{project.category || 'DIGITAL PROJECT'}</div><h3>{project.title}</h3><p>{project.excerpt}</p></div></Link>})}</div>
        </div>
      </section>

      <section className="container section" style={{paddingTop:10}}><div className="cta"><div><div className="eyebrow">جاهز نبدأ؟</div><h2>عندك فكرة؟ خلّيها تشتغل.</h2><p>احكيلنا عن مشروعك، ونرجعلك بخطوة واضحة نبدأ منها.</p></div><Link href="/contact" className="btn btn-primary">تواصل مع ShoTech <ArrowLeft size={18}/></Link></div></section>
    </main>
  );
}
