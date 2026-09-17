"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((active - 1 + images.length) % images.length);
  const next = () => setActive((active + 1) % images.length);

  return (
    <section className="project-gallery">
      <div className="gallery-main" style={{position:'relative',width:'100%',height:'clamp(250px, 52vw, 540px)',minHeight:0,maxHeight:540,overflow:'hidden',borderRadius:24,background:'#0b1823'}}>
        <Image src={images[active]} alt={`${title} – image ${active + 1}`} fill sizes="(max-width: 768px) 100vw, 1200px" style={{objectFit:'contain'}} priority={active === 0} />
        {images.length > 1 && <>
          <button className="gallery-nav prev" onClick={prev} aria-label="Previous image">‹</button>
          <button className="gallery-nav next" onClick={next} aria-label="Next image">›</button>
        </>}
        <span className="gallery-count">{active + 1} / {images.length}</span>
      </div>
      {images.length > 1 && <div className="gallery-thumbs" style={{display:'flex',gap:10,marginTop:12,overflowX:'auto',paddingBottom:4}}>
        {images.map((src,i)=><button key={`${src}-${i}`} className={i===active?'active':''} onClick={()=>setActive(i)} style={{flex:'0 0 76px',width:76,height:58,padding:0,overflow:'hidden',borderRadius:10,cursor:'pointer'}}>
          <Image src={src} alt={`${title} thumbnail ${i + 1}`} width={76} height={58} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
        </button>)}
      </div>}
    </section>
  );
}
