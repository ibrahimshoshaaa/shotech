import Link from "next/link";
import { getProjects } from "@/lib/site";
export const dynamic = "force-dynamic";
export default async function Page(){
  const p=await getProjects();
  return <main className="container page"><div className="eyebrow">PORTFOLIO</div><h1>Our systems & products.</h1><div className="grid">{p.map((x:any)=>{
    let images:string[]=[]; try{images=JSON.parse(x.images||"[]")}catch{}
    const cover=x.cover_image||images[0];
    return <article className="card project" key={x.id}>{cover?<img src={cover} alt={x.title}/>:<div className="cover"/>}<div className="pad"><div className="project-meta">{x.category||"PROJECT"}{images.length>1?` · ${images.length} photos`:""}</div><h2>{x.title}</h2><p className="muted">{x.excerpt}</p><Link className="btn small" href={`/projects/${x.slug}`}>Details</Link></div></article>;
  })}</div>{!p.length&&<div className="empty">Projects added by the admin will appear here.</div>}</main>}
