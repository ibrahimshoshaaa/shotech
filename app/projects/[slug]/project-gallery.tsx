"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((active - 1 + images.length) % images.length);
  const next = () => setActive((active + 1) % images.length);
  return <section className="project-gallery">
    <div className="gallery-main" style={{position:'relative'}}>
      <Image src={images[active]} alt={`${title} – image ${active + 1}`} fill sizes="(max-width: 768px) 100vw, 1200px" style={{objectFit:'contain'}} priority={active === 0} />
      {images.length > 1 && <><button className="gallery-nav prev" onClick={prev} aria-label="Previous image">‹</button><button className="gallery-nav next" onClick={next} aria-label="Next image">›</button></>}
      <span className="gallery-count">{active + 1} / {images.length}</span>
    </div>
    {images.length > 1 && <div className="gallery-thumbs">{images.map((src, i) => <button key={`${src}-${i}`} className={i === active ? "active" : ""} onClick={() => setActive(i)}><Image src={src} alt={`${title} thumbnail ${i + 1}`} width={76} height={58} /></button>)}</div>}
  </section>;
}
