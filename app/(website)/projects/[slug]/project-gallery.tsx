"use client";
import { useState } from "react";

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((active - 1 + images.length) % images.length);
  const next = () => setActive((active + 1) % images.length);
  return <section className="project-gallery">
    <div className="gallery-main">
      <img src={images[active]} alt={`${title} – image ${active + 1}`} />
      {images.length > 1 && <><button className="gallery-nav prev" onClick={prev} aria-label="Previous image">‹</button><button className="gallery-nav next" onClick={next} aria-label="Next image">›</button></>}
      <span className="gallery-count">{active + 1} / {images.length}</span>
    </div>
    {images.length > 1 && <div className="gallery-thumbs">{images.map((src, i) => <button key={`${src}-${i}`} className={i === active ? "active" : ""} onClick={() => setActive(i)}><img src={src} alt={`${title} thumbnail ${i + 1}`} /></button>)}</div>}
  </section>;
}
