import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectGallery from "./project-gallery";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await query("SELECT * FROM projects WHERE slug=? AND status='published'", [slug]);
  const p: any = r.rows[0];
  if (!p) notFound();
  let tech: string[] = [], images: string[] = [];
  try { tech = JSON.parse(p.technologies || "[]"); } catch {}
  try { images = JSON.parse(p.images || "[]"); } catch {}
  if (p.cover_image && !images.includes(p.cover_image)) images.unshift(p.cover_image);
  images = images.filter(Boolean);

  return <main className="container page project-detail">
    <div className="eyebrow">{p.category || "PROJECT"}</div>
    <h1>{p.title}</h1>
    {p.excerpt && <p className="lead muted">{p.excerpt}</p>}
    {images.length > 0 && <ProjectGallery images={images} title={p.title} />}
    <div className="project-content"><p className="muted" style={{ fontSize: 18, whiteSpace: "pre-wrap" }}>{p.content || p.excerpt}</p></div>
    {!!tech.length && <><h3>Technologies</h3><div className="tags">{tech.map(t => <span className="tag" key={t}>{t}</span>)}</div></>}
    <div className="project-links">
      {p.demo_url && <a className="btn" href={p.demo_url} target="_blank" rel="noreferrer">View Demo ↗</a>}
      {p.github_url && <a className="btn alt" href={p.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
    </div>
  </main>;
}
