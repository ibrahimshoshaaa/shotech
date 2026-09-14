import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight, CheckCircle2, Code2, ShoppingCart, Building2, LayoutDashboard, MonitorSmartphone, Workflow, Sparkles} from 'lucide-react';
import {getProjects,getServices} from '@/lib/site';
export const dynamic='force-dynamic';
const icons:any={Code2,ShoppingCart,Building2,LayoutDashboard,MonitorSmartphone,Workflow};
const fallback=[Code2,ShoppingCart,Building2,LayoutDashboard,MonitorSmartphone,Workflow];
export default async function Home(){
 const [services,projects]=await Promise.all([getServices(),getProjects(true)]);
 return <main>
  <section className="hero-shell">
   <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
   <div className="container hero-v2">
    <div className="hero-copy reveal">
     <div className="hero-pill"><Sparkles size={15}/> ShoTech Solutions <span>•</span> Digital Systems</div>
     <h1>We turn ideas into <span className="grad">powerful digital systems.</span></h1>
     <p className="hero-text">We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster.</p>
     <div className="hero-actions"><Link className="btn btn-large" href="/contact">Start a Project <ArrowRight size={18}/></Link><Link className="text-link" href="/projects">Explore our work <ArrowRight size={17}/></Link></div>
     <div className="hero-proof"><span><CheckCircle2 size={17}/> Custom built</span><span><CheckCircle2 size={17}/> Scalable systems</span><span><CheckCircle2 size={17}/> Modern technology</span></div>
    </div>
    <div className="hero-visual reveal delay-1">
      <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
      <div className="logo-stage"><div className="logo-beam"/><Image src="/shotech-mark.png" alt="ShoTech mark" width={310} height={335} priority/></div>
      <div className="float-card card-code"><Code2 size={19}/><div><b>Custom Systems</b><small>Built for your workflow</small></div></div>
      <div className="float-card card-status"><span className="status-dot"/><div><b>System online</b><small>Built to scale</small></div></div>
    </div>
   </div>
  </section>

  <section className="section section-services">
   <div className="container">
    <div className="section-head"><div><div className="eyebrow">WHAT WE BUILD</div><h2>Technology designed around <span className="grad">your business.</span></h2></div><p className="muted">From the first idea to a powerful production-ready system, we build solutions with purpose.</p></div>
    {services.length ? <div className="service-grid">{services.map((s:any,i:number)=>{const Icon=icons[s.icon]||fallback[i%fallback.length];return <article className="service-card" key={s.id}><div className="service-top"><div className="service-icon"><Icon size={25}/></div><span className="service-no">0{i+1}</span></div><h3>{s.title}</h3><p>{s.description}</p><Link href="/services" className="card-link">Discover service <ArrowRight size={16}/></Link></article>})}</div>:<div className="empty">Services will appear here after the admin adds them.</div>}
   </div>
  </section>

  <section className="section portfolio-section">
   <div className="container">
    <div className="section-head portfolio-head"><div><div className="eyebrow">FEATURED WORK</div><h2>Systems built to <span className="grad">perform.</span></h2></div><Link className="btn alt" href="/projects">View all projects <ArrowRight size={17}/></Link></div>
    {projects.length?<div className="project-grid">{projects.slice(0,6).map((p:any,i:number)=><article className="project-card" key={p.id}><div className="project-media">{p.cover_image?<img src={p.cover_image} alt={p.title}/>:<div className="project-placeholder"><Image src="/shotech-mark.png" alt="" width={90} height={98}/></div>}<div className="project-shine"/><span className="project-index">0{i+1}</span></div><div className="project-body"><div className="project-meta">{p.category||'DIGITAL SYSTEM'}</div><h3>{p.title}</h3><p>{p.excerpt}</p><Link href={`/projects/${p.slug}`} className="round-link" aria-label={`View ${p.title}`}><ArrowRight size={19}/></Link></div></article>)}</div>:<div className="empty">Featured projects added by the admin will appear here.</div>}
   </div>
  </section>

  <section className="section process-section"><div className="container"><div className="eyebrow">HOW WE WORK</div><h2>A clear process. <span className="grad">A stronger result.</span></h2><div className="process-grid">{[['01','Discover','We understand your business, goals and the problem we need to solve.'],['02','Design','We shape the experience, structure and technical direction.'],['03','Build','We turn the plan into a fast, reliable and scalable product.'],['04','Launch','We test, refine and help you move confidently into production.']].map(x=><article className="process-card" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>

  <section className="container"><div className="cta-banner"><div><div className="eyebrow">LET'S BUILD</div><h2>Have an idea worth building?</h2><p>Let&apos;s turn it into something useful, powerful and ready to grow.</p></div><Link className="btn btn-large" href="/contact">Start a conversation <ArrowRight size={18}/></Link></div></section>
 </main>
}
