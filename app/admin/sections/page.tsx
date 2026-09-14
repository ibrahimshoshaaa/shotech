'use client';
import {useEffect,useState} from 'react';

const blank={page:'home',type:'custom',title:'',subtitle:'',body:'',icon:'',image:'',button_text:'',button_url:'',data:'{}',sort_order:0,visible:true};
const types=[
  ['hero','الواجهة الرئيسية','أول جزء يظهر للزائر'],
  ['services','الخدمات','عرض خدمات الشركة'],
  ['about','من نحن','نبذة عن الشركة'],
  ['why','لماذا نحن','مميزات ShoTech'],
  ['process','طريقة العمل','خطوات تنفيذ المشروع'],
  ['projects','المشاريع','عرض أعمال ومشاريع الشركة'],
  ['cta','دعوة للتواصل','جزء يدعو العميل للتواصل'],
  ['custom','قسم مخصص','قسم نصي عادي']
];
const pages=[['home','الصفحة الرئيسية'],['about','من نحن'],['why','لماذا نحن'],['process','طريقة العمل']];

export default function Page(){
 const [page,setPage]=useState('home'),[items,setItems]=useState<any[]>([]),[f,setF]=useState<any>(blank),[id,setId]=useState<number|null>(null),[error,setError]=useState(''),[saving,setSaving]=useState(false);
 const load=()=>fetch('/api/sections?page='+page).then(r=>r.json()).then(setItems);
 useEffect(()=>{load();setId(null);setF({...blank,page})},[page]);
 const set=(k:string,v:any)=>setF((x:any)=>({...x,[k]:v}));
 async function save(e:any){e.preventDefault();setError('');setSaving(true);try{const r=await fetch(id?'/api/sections/'+id:'/api/sections',{method:id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,page,data:f.data||'{}'})});const d=await r.json();if(!r.ok){setError(d.error||'تعذر الحفظ');return}setF({...blank,page});setId(null);await load()}finally{setSaving(false)}}
 async function del(i:number){if(!confirm('هل تريد حذف هذا القسم؟'))return;await fetch('/api/sections/'+i,{method:'DELETE'});load()}
 function edit(x:any){setId(x.id);setF({...x,visible:!!x.visible,data:x.data||'{}'}) ;window.scrollTo({top:0,behavior:'smooth'})}
 return <div dir="rtl">
  <div className="eyebrow">إدارة محتوى الموقع</div>
  <h1>{id?'تعديل القسم':'محتوى الموقع'}</h1>
  <p className="muted">هنا تتحكم في الكلام والصور والأزرار والأقسام التي تظهر للزائر. لا تحتاج لتعديل أي كود.</p>

  <div className="card" style={{marginBottom:18}}>
   <label><strong>1. اختار الصفحة</strong><select value={page} onChange={e=>setPage(e.target.value)}>{pages.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
  </div>

  <form className="form card" onSubmit={save}>
   <div style={{marginBottom:12}}><strong>{id?'2. عدّل بيانات القسم':'2. أضف قسمًا جديدًا'}</strong><p className="muted" style={{margin:'5px 0 0'}}>اختار نوع القسم ثم اكتب المحتوى الذي تريد ظهوره على الموقع.</p></div>
   <label>نوع القسم<select value={f.type} onChange={e=>set('type',e.target.value)}>{types.map(([v,l,h])=><option value={v} key={v}>{l} — {h}</option>)}</select></label>
   <div className="grid">
    <label>العنوان<input className="input" value={f.title} onChange={e=>set('title',e.target.value)} placeholder="مثال: حلول رقمية تناسب شركتك"/></label>
    <label>العنوان الصغير<input className="input" value={f.subtitle} onChange={e=>set('subtitle',e.target.value)} placeholder="مثال: ماذا نقدم"/></label>
   </div>
   <label>الوصف<textarea value={f.body} onChange={e=>set('body',e.target.value)} placeholder="اكتب وصف القسم هنا..."/></label>
   <div className="grid">
    <label>الصورة <input className="input" value={f.image} onChange={e=>set('image',e.target.value)} placeholder="رابط الصورة (اختياري)"/></label>
    <label>الأيقونة <input className="input" value={f.icon} onChange={e=>set('icon',e.target.value)} placeholder="مثال: Sparkles أو Code2"/></label>
   </div>
   <div className="grid">
    <label>نص الزر <input className="input" value={f.button_text} onChange={e=>set('button_text',e.target.value)} placeholder="مثال: اعرف المزيد"/></label>
    <label>رابط الزر <input className="input" value={f.button_url} onChange={e=>set('button_url',e.target.value)} placeholder="مثال: /contact"/></label>
   </div>
   <div className="grid">
    <label>ترتيب القسم<input className="input" type="number" value={f.sort_order} onChange={e=>set('sort_order',+e.target.value)} /><small className="muted">الأرقام الأصغر تظهر أولًا: 10 ثم 20 ثم 30...</small></label>
    <label style={{display:'flex',alignItems:'center',gap:10,paddingTop:28}}><input type="checkbox" checked={!!f.visible} onChange={e=>set('visible',e.target.checked)}/> إظهار القسم على الموقع</label>
   </div>
   {error&&<div className="error-box">{error}</div>}
   <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button className="btn" disabled={saving}>{saving?'جاري الحفظ...':id?'حفظ التعديلات':'إضافة القسم'}</button>{id&&<button type="button" className="btn alt" onClick={()=>{setId(null);setF({...blank,page})}}>إلغاء</button>}</div>
  </form>

  <div style={{marginTop:28}}><div className="eyebrow">الأقسام الحالية</div><h2>ماذا يظهر في {pages.find(x=>x[0]===page)?.[1]}</h2><p className="muted">يمكنك تعديل أي قسم أو إخفاؤه أو حذفه.</p></div>
  <div className="grid">{items.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(x=><article className="card" key={x.id}>
   <div className="eyebrow">{x.sort_order||0} · {types.find(t=>t[0]===x.type)?.[1]||x.type}</div>
   <h3>{x.title||'قسم بدون عنوان'}</h3>
   <p className="muted">{x.subtitle||x.body||'لا يوجد وصف'}</p>
   <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}><span className="muted">{x.visible?'ظاهر على الموقع':'مخفي'}</span><button className="btn small alt" onClick={()=>edit(x)}>تعديل</button><button className="btn small danger" onClick={()=>del(x.id)}>حذف</button></div>
  </article>)}</div>
 </div>
}
