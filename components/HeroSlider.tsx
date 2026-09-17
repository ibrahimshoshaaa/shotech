'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type HeroSlide = {
  id: string;
  image: string;
  title: string;
  title_en?: string;
  subtitle: string;
  subtitle_en?: string;
  body: string;
  body_en?: string;
  button_text: string;
  button_text_en?: string;
  button_url: string;
  visible?: boolean;
};

type HeroData = {
  slides?: HeroSlide[];
  interval?: number;
};

function readHeroData(raw: unknown): HeroData {
  try {
    const parsed = JSON.parse(typeof raw === 'string' ? raw : '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function HeroSlider({ hero, en }: { hero: any; en: boolean }) {
  const data = useMemo(() => readHeroData(hero?.data), [hero?.data]);
  const slides = useMemo(() => {
    const configured = Array.isArray(data.slides)
      ? data.slides.filter((slide: HeroSlide) => slide && slide.visible !== false)
      : [];

    if (configured.length) return configured;

    return [
      {
        id: 'default',
        image: hero?.image || '',
        title: hero?.title || (en ? 'We turn ideas into powerful digital systems.' : 'نحوّل أفكارك إلى أنظمة رقمية قوية.'),
        title_en: hero?.title_en,
        subtitle: hero?.subtitle || (en ? 'Built around your work.' : 'تشتغل معاك.'),
        subtitle_en: hero?.subtitle_en,
        body:
          hero?.body ||
          (en
            ? 'We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster.'
            : 'من موقع احترافي إلى نظام متكامل لإدارة شغلك، بنحوّل احتياجاتك إلى تجربة رقمية واضحة، سريعة، ومصممة حول طريقة عملك.'),
        body_en: hero?.body_en,
        button_text: hero?.button_text || 'ابدأ مشروعك',
        button_text_en: hero?.button_text_en || 'Start your project',
        button_url: hero?.button_url || '#contact',
        visible: true,
      },
    ];
  }, [data.slides, hero, en]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  const interval = Math.min(30000, Math.max(2000, Number(data.interval) * 1000 || 6000));

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, interval]);

  const slide = slides[active] || slides[0];
  const title = en ? slide.title_en || slide.title : slide.title;
  const subtitle = en ? slide.subtitle_en || slide.subtitle : slide.subtitle;
  const body = en ? slide.body_en || slide.body : slide.body;
  const buttonText = en ? slide.button_text_en || slide.button_text : slide.button_text;

  const move = (direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="hero-shell">
      <div className="hero container" aria-label={en ? 'Hero slider' : 'الواجهة الرئيسية'}>
        {slide.image && (
          <div className="hero-background" aria-hidden="true">
            <Image src={slide.image} alt="" fill priority={active === 0} sizes="100vw" />
          </div>
        )}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-pill">ShoTech Solutions</div>
          <h1>
            {title}
            {subtitle && <span>{subtitle}</span>}
          </h1>
          {body && <p className="hero-lead">{body}</p>}
          <div className="hero-actions">
            {buttonText && slide.button_url && (
              <Link href={slide.button_url} className="btn btn-primary">
                {buttonText} <ArrowLeft size={18} />
              </Link>
            )}
            <Link href="#projects" className="btn btn-outline">
              {en ? 'View our work' : 'شوف أعمالنا'}
            </Link>
          </div>
          <div className="hero-note">
            <span><i /> {en ? 'Custom solutions' : 'حلول مخصصة'}</span>
            <span><i /> {en ? 'Design & UX' : 'تصميم وتجربة مستخدم'}</span>
            <span><i /> {en ? 'Ongoing support' : 'دعم وتطوير مستمر'}</span>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="hero-controls" aria-label={en ? 'Hero controls' : 'التحكم في الواجهة'}>
            <button type="button" onClick={() => move(-1)} aria-label={en ? 'Previous slide' : 'الشريحة السابقة'}>
              <ChevronRight size={18} />
            </button>
            <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? (en ? 'Play slider' : 'تشغيل العرض') : (en ? 'Pause slider' : 'إيقاف العرض')}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button type="button" onClick={() => move(1)} aria-label={en ? 'Next slide' : 'الشريحة التالية'}>
              <ChevronLeft size={18} />
            </button>
            <div className="hero-dots">
              {slides.map((item, index) => (
                <button
                  type="button"
                  key={item.id || index}
                  className={index === active ? 'active' : ''}
                  onClick={() => setActive(index)}
                  aria-label={`${en ? 'Slide' : 'الشريحة'} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
