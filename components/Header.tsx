'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

type Locale = 'ar' | 'en';

const labels = {
  ar: {
    home: 'الرئيسية',
    services: 'خدماتنا',
    projects: 'أعمالنا',
    about: 'من نحن',
    contact: 'تواصل معنا',
    start: 'ابدأ مشروعك',
  },
  en: {
    home: 'Home',
    services: 'Services',
    projects: 'Work',
    about: 'About',
    contact: 'Contact',
    start: 'Start a project',
  },
};

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const l = labels[locale];
  const links = [
    [l.home, '/'],
    [l.services, '/services'],
    [l.projects, '/#projects'],
    [l.about, '/#about'],
    [l.contact, '/#contact'],
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="ShoTech">
            <Image src="/shotech-header.png" alt="ShoTech" width={220} height={74} priority />
          </Link>

          <nav className={`nav-links ${open ? 'is-open' : ''}`}>
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <LanguageSwitcher locale={locale} />
            <Link href="/#contact" className="btn btn-primary nav-cta">
              {l.start} <ArrowLeft size={17} />
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 900px) {
          .website-shell .site-header .nav {
            width: 100%;
            max-width: none;
            min-width: 0;
            margin: 0;
            padding: 0 16px;
            justify-content: space-between;
          }

          .website-shell .site-header .nav-links {
            display: none;
          }

          .website-shell .site-header .nav-actions {
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            gap: 10px;
            margin: 0;
          }

          .website-shell .site-header .nav-cta {
            display: none;
          }

          .website-shell .site-header .menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 44px;
          }

          .website-shell .site-header .brand {
            flex: 0 0 auto;
            min-width: 0;
          }

          .website-shell .site-header .brand img {
            max-width: min(178px, 48vw);
          }
        }
      `}</style>
    </>
  );
}
