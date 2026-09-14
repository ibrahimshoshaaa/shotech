'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['الرئيسية', '/'],
  ['خدماتنا', '/services'],
  ['أعمالنا', '/projects'],
  ['من نحن', '/about'],
  ['لماذا ShoTech', '/why'],
  ['الأسئلة الشائعة', '/faq'],
  ['تواصل معنا', '/contact'],
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith('/admin')) return null;
  return <header className="site-header"><div className="container nav"><Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="ShoTech"><Image src="/shotech-header.png" alt="ShoTech" width={220} height={74} priority /></Link><nav className={`nav-links ${open ? 'is-open' : ''}`}>{links.map(([label, href]) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={() => setOpen(false)}>{label}</Link>)}</nav><div className="nav-actions"><Link href="/contact" className="btn btn-primary nav-cta">ابدأ مشروعك <ArrowLeft size={17} /></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="فتح القائمة">{open ? <X size={23} /> : <Menu size={23} />}</button></div></div></header>;
}
