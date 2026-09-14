import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectGallery from './project-gallery';
import { ArrowLeft } from 'lucide-react';

export const dynamic='force-dynamic';

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const r=await query("SELECT * FROM projects WHERE slug=? AND status='published'",[slug]);
  const p:any=r.rows[0];
  if(!p)notFound();

  let tech:string[]=[],images:string[]=[];
  try{tech=JSON.parse(p.technologies||'[]')}catch{}
  try{images=JSON.parse(p.images||'[]')}catch{}
  if(p.cover_image&&!images.includes(p.cover_image))images.unshift(p.cover_image);
  images=images.filter(Boolean);

  return <main>
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">{p.category||'PROJECT'}</div>
        <h1>{p.title}</h1>
        {p.excerpt&&<p>{p.excerpt}</p>}
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div style={{marginBottom:40}}>
          {images.length
            ? <ProjectGallery images={images} title={p.title}/>
            : <div className="detail-image"><div className="visual-center"><div className="visual-card"><b>{p.title}</b><p>تفاصيل المشروع</p></div></div></div>
          }
        </div>

        <div className="split" style={{alignItems:'start'}}>
          <div>
            <div className="eyebrow">عن المشروع</div>
            <h2>من المشكلة للحل.</h2>
          </div>
          <div>
            <p className="muted" style={{whiteSpace:'pre-wrap',fontSize:16}}>{p.content||p.excerpt}</p>
            {!!tech.length&&<div className="tags" style={{marginTop:25}}>{tech.map(t=><span className="tag" key={t}>{t}</span>)}</div>}
            {(p.demo_url||p.github_url)&&<div className="hero-actions">
              {p.demo_url&&<a className="btn btn-primary" href={p.demo_url} target="_blank" rel="noreferrer">مشاهدة المشروع <ArrowLeft size={16}/></a>}
              {p.github_url&&<a className="btn btn-outline" href={p.github_url} target="_blank" rel="noreferrer">GitHub <ArrowLeft size={16}/></a>}
            </div>}
          </div>
        </div>
      </div>
    </section>

    <section className="container section" style={{paddingTop:0}}>
      <div className="cta">
        <div><div className="eyebrow">YOUR PROJECT</div><h2>عايز مشروع مشابه؟</h2><p>خلينا نعرف احتياجك ونبني الحل المناسب.</p></div>
        <Link href="/contact" className="btn btn-primary">ابدأ مشروعك <ArrowLeft size={17}/></Link>
      </div>
    </section>
  </main>
}
