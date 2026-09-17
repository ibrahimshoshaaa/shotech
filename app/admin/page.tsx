import {query} from '@/lib/db';
import {FolderKanban,BriefcaseBusiness,Inbox,ArrowUpLeft,ArrowUpRight,Plus,ExternalLink} from 'lucide-react';
import {PageHeader,QuickLink,StatusBadge} from '@/components/admin/AdminUI';
import Link from 'next/link';

export const dynamic='force-dynamic';

export default async function Page(){
  const [[p],[pub],[s],[m],[u]]=await Promise.all([
    'SELECT count(*) c FROM projects',
    "SELECT count(*) c FROM projects WHERE status='published'",
    'SELECT count(*) c FROM services',
    'SELECT count(*) c FROM messages',
    "SELECT count(*) c FROM messages WHERE status='unread'",
  ].map(async sql=>(await query(sql)).rows));

  const stats=[
    ['المشاريع',(p as any).c,FolderKanban],
    ['منشور',(pub as any).c,ArrowUpLeft],
    ['الخدمات',(s as any).c,BriefcaseBusiness],
    ['الرسائل',(m as any).c,Inbox],
    ['غير المقروء',(u as any).c,Inbox],
  ];

  return <>
    <PageHeader eyebrow="لوحة التحكم" title="أهلًا بك في ShoTech" description="إدارة سريعة للمحتوى والخدمات والمشاريع والرسائل من شاشة واحدة."/>
    <section className="admin-welcome-card">
      <div><span className="admin-welcome-kicker">مركز التحكم</span><h2>كل أدواتك في مكان واحد</h2><p>ابدأ بالمهمة التي تريدها، واحفظ تعديلاتك من الموبايل بدون الحاجة للكمبيوتر.</p></div>
      <div className="admin-welcome-actions"><Link href="/admin/projects" className="admin-primary"><Plus size={17}/> مشروع جديد</Link><Link href="/" target="_blank" className="admin-secondary"><ExternalLink size={16}/> عرض الموقع</Link></div>
    </section>
    <div className="admin-stats">{stats.map(([label,value,Icon]:any)=><div className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong><Icon size={18}/></div>)}</div>
    <section className="admin-card"><div className="admin-card-head"><div><h2>إدارة سريعة</h2><p>أهم الأقسام التي ستستخدمها يوميًا.</p></div><ArrowUpRight size={18} className="admin-card-head-icon"/></div><div className="admin-quick-grid"><QuickLink href="/admin/sections" title="محتوى الموقع" description="الأقسام، النصوص، الصور والأيقونات"/><QuickLink href="/admin/services" title="الخدمات" description="إضافة وتعديل وترتيب خدمات الشركة"/><QuickLink href="/admin/projects" title="المشاريع" description="الصور، التفاصيل وحالة النشر"/><QuickLink href="/admin/messages" title="رسائل العملاء" description="متابعة طلبات التواصل والرسائل"/></div></section>
    <section className="admin-card"><div className="admin-card-head"><div><h2>حالة الموقع</h2><p>المؤشرات الأساسية لحالة لوحة التحكم.</p></div><StatusBadge tone="success">النظام يعمل</StatusBadge></div><div className="admin-health-grid"><div><span>الرسائل الجديدة</span><strong>{(u as any).c}</strong></div><div><span>المشاريع المنشورة</span><strong>{(pub as any).c}</strong></div></div><div className="admin-notice">أي تعديل تحفظه هنا ينعكس على الموقع العام بعد تحديث البيانات. لا تحتاج لتعديل الكود.</div></section>
  </>;
}
