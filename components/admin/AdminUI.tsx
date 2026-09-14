'use client';
import Link from 'next/link';
import {ArrowLeft, ExternalLink, Plus, Save, X} from 'lucide-react';

export function PageHeader({eyebrow,title,description,action,actionHref}:{eyebrow?:string;title:string;description?:string;action?:string;actionHref?:string}){
 return <div className="admin-page-header"><div><div className="admin-eyebrow">{eyebrow}</div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action&&actionHref&&<Link className="admin-primary" href={actionHref}><Plus size={17}/>{action}</Link>}</div>
}
export function SectionCard({title,description,children,actions}:{title:string;description?:string;children:React.ReactNode;actions?:React.ReactNode}){
 return <section className="admin-card"><div className="admin-card-head"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{actions}</div>{children}</section>
}
export function Field({label,required,children,hint}:{label:string;required?:boolean;children:React.ReactNode;hint?:string}){
 return <label className="admin-field"><span>{label}{required&&<b> *</b>}</span>{children}{hint&&<small>{hint}</small>}</label>
}
export function SaveBar({editing,onCancel,saving=false}:{editing:boolean;onCancel?:()=>void;saving?:boolean}){
 return <div className="admin-savebar"><button className="admin-primary" disabled={saving}><Save size={17}/>{saving?'جاري الحفظ...':editing?'حفظ التعديلات':'إضافة وحفظ'}</button>{editing&&onCancel&&<button type="button" className="admin-secondary" onClick={onCancel}><X size={17}/>إلغاء</button>}</div>
}
export function EmptyState({title,description,href,button}:{title:string;description:string;href?:string;button?:string}){
 return <div className="admin-empty"><h3>{title}</h3><p>{description}</p>{href&&button&&<Link className="admin-primary" href={href}>{button}<ArrowLeft size={16}/></Link>}</div>
}
export function StatusBadge({children,tone='neutral'}:{children:React.ReactNode;tone?:'success'|'warning'|'danger'|'neutral'}){return <span className={`admin-badge ${tone}`}>{children}</span>}
export function QuickLink({href,title,description}:{href:string;title:string;description:string}){return <Link href={href} className="admin-quick"><span><strong>{title}</strong><small>{description}</small></span><ArrowLeft size={18}/></Link>}
export function OpenSite(){return <Link href="/" target="_blank" className="admin-top-link">عرض الموقع <ExternalLink size={15}/></Link>}
