"use client";

import { useEffect, useRef, useState } from "react";

const blank: any = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "", images: [],
  technologies: [], category: "", demo_url: "", github_url: "", status: "draft", featured: false,
};

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [edit, setEdit] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const r = await fetch("/api/projects");
    setItems(await r.json());
  };
  useEffect(() => { load(); }, []);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const normalize = (p: any) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]"),
    technologies: Array.isArray(p.technologies) ? p.technologies : JSON.parse(p.technologies || "[]"),
    featured: !!p.featured,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const payload = { ...form, cover_image: form.cover_image || form.images?.[0] || "" };
    const url = edit ? `/api/projects/${edit}` : "/api/projects";
    const r = await fetch(url, { method: edit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) { setError(d.error || "Could not save project"); return; }
    setForm(blank); setEdit(null); if (fileRef.current) fileRef.current.value = ""; load();
  }

  async function del(id: number) {
    if (!confirm("Delete this project?")) return;
    const r = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!r.ok) alert("Could not delete project");
    load();
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((file) => fd.append("files", file));
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Upload failed");
      const urls: string[] = d.urls || (d.url ? [d.url] : []);
      setForm((f: any) => {
        const images = [...(f.images || []), ...urls];
        return { ...f, images, cover_image: f.cover_image || images[0] || "" };
      });
    } catch (e: any) { setError(e.message || "Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  function removeImage(index: number) {
    setForm((f: any) => {
      const removed = f.images[index];
      const images = f.images.filter((_: string, i: number) => i !== index);
      return { ...f, images, cover_image: f.cover_image === removed ? (images[0] || "") : f.cover_image };
    });
  }
  function moveImage(index: number, direction: -1 | 1) {
    setForm((f: any) => {
      const next = [...f.images], target = index + direction;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, images: next };
    });
  }
  function makeCover(url: string) { set("cover_image", url); }

  return <>
    <div className="row"><div><div className="eyebrow">PROJECTS</div><h1>Manage Projects</h1><p className="muted">Upload multiple images. The first image is used as the default cover unless you choose another one.</p></div></div>

    <form className="form card project-form" onSubmit={save}>
      <input className="input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Project title" required />
      <input className="input" value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="Custom slug (optional)" />
      <input className="input" value={form.category} onChange={e => set("category", e.target.value)} placeholder="Category" />
      <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Short description" />
      <textarea value={form.content} onChange={e => set("content", e.target.value)} placeholder="Full project content" />

      <div className="upload-box">
        <div><strong>Project gallery</strong><p className="muted">Select one or multiple images at once. JPG, PNG, WEBP or GIF.</p></div>
        <input ref={fileRef} className="input" type="file" accept="image/*" multiple onChange={e => uploadImages(e.target.files)} />
        {uploading && <div className="upload-status">Uploading images to Cloudinary…</div>}
      </div>

      {!!form.images?.length && <div className="image-manager">
        {form.images.map((url: string, i: number) => <div className={`admin-image ${form.cover_image === url ? "is-cover" : ""}`} key={`${url}-${i}`}>
          <img src={url} alt={`Project image ${i + 1}`} />
          {form.cover_image === url && <span className="cover-badge">Cover</span>}
          <div className="image-actions">
            <button type="button" className="btn small alt" onClick={() => makeCover(url)}>Set cover</button>
            <button type="button" className="btn small alt" disabled={i === 0} onClick={() => moveImage(i, -1)}>←</button>
            <button type="button" className="btn small alt" disabled={i === form.images.length - 1} onClick={() => moveImage(i, 1)}>→</button>
            <button type="button" className="btn small danger" onClick={() => removeImage(i)}>Remove</button>
          </div>
        </div>)}
      </div>}

      <input className="input" value={form.technologies.join(", ")} onChange={e => set("technologies", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} placeholder="Technologies: Next.js, TypeScript" />
      <input className="input" value={form.demo_url} onChange={e => set("demo_url", e.target.value)} placeholder="Demo URL" />
      <input className="input" value={form.github_url} onChange={e => set("github_url", e.target.value)} placeholder="GitHub URL" />
      <select value={form.status} onChange={e => set("status", e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select>
      <label><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} /> Featured on Home</label>
      {error && <div className="error-box">{error}</div>}
      <div><button className="btn" disabled={uploading}>{edit ? "Update Project" : "Add Project"}</button>{" "}
        {edit && <button type="button" className="btn alt" onClick={() => { setEdit(null); setForm(blank); }}>Cancel</button>}
      </div>
    </form>

    <h2>All Projects</h2><div style={{ overflowX: "auto" }}><table className="table"><thead><tr><th>Title</th><th>Images</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{items.map(p => {
      const images = (() => { try { return JSON.parse(p.images || "[]"); } catch { return []; } })();
      return <tr key={p.id}><td>{p.title}</td><td>{images.length}</td><td>{p.status}</td><td>{p.featured ? "Yes" : "No"}</td><td><button className="btn small alt" onClick={() => { setEdit(p.id); setForm(normalize(p)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>{" "}<button className="btn small danger" onClick={() => del(p.id)}>Delete</button></td></tr>;
    })}</tbody></table></div>
  </>;
}
