'use client';

import './admin.css';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard, PanelsTopLeft, BriefcaseBusiness, FolderKanban, Inbox, Settings, ExternalLink, Menu} from 'lucide-react';

const nav=[
  ['/admin','الرئيسية',LayoutDashboard],
  ['/admin/sections','محتوى الموقع',PanelsTopLeft],
  ['/admin/services','الخدمات',BriefcaseBusiness],
  ['/admin/projects','المشاريع',FolderKanban],
  ['/admin/messages','الرسائل',Inbox],
  ['/admin/settings','الإعدادات',Settings],
] as const;

export default function Layout({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  if(pathname==='/admin/login') return <>{children}</>;

  return <div className="admin-shell" dir="rtl">
    <aside className="sidebar">
      <Link href="/admin" className="admin-brand">Sho<span>Tech</span><small>لوحة التحكم</small></Link>
      <nav className="admin-nav" aria-label="التنقل داخل لوحة التحكم">
        {nav.map(([href,label,Icon])=><Link key={href} href={href} className={pathname===href||pathname.startsWith(href+'/')?'active':''}>
          <Icon size={19}/><span>{label}</span>
        </Link>)}
      </nav>
      <div className="admin-bottom"><Link href="/" target="_blank"><ExternalLink size={16}/> فتح الموقع</Link></div>
    </aside>

    <section className="admin-content">
      <header className="admin-topbar">
        <div className="admin-top-title"><Menu size={20}/><strong>لوحة تحكم ShoTech</strong></div>
        <Link href="/" target="_blank" className="admin-top-link">عرض الموقع <ExternalLink size={15}/></Link>
      </header>
      <main className="adminmain">{children}</main>
    </section>
  </div>;
}
