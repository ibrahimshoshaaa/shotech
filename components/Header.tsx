'use client';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
export default function Header(){const pathname=usePathname();if(pathname.startsWith('/admin'))return null;return <header className="site-header"><div className="container nav"><Link className="brand" href="/"><Image src="/shotech-header.png" alt="ShoTech logo" width={170} height={68} priority/></Link><nav className="links"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav><Link className="btn nav-cta" href="/contact">Start a Project <span>↗</span></Link></div></header>}
