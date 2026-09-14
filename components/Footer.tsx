'use client';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
export default function Footer(){const pathname=usePathname();if(pathname.startsWith('/admin'))return null;return <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><Image src="/shotech-mark.png" alt="ShoTech" width={36} height={39}/><span><b>ShoTech Solutions</b><small>Smart Solutions. Powerful Systems.</small></span></div><div className="footer-links"><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/contact">Contact</Link></div><div>© {new Date().getFullYear()} ShoTech.</div></div></footer>}
