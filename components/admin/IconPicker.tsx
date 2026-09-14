'use client';
import {useState} from 'react';
import {SERVICE_ICONS} from '@/lib/service-icons';

const labels:Record<string,string>={
  Code2:'برمجة',ShoppingCart:'متجر إلكتروني',Building2:'شركات وأعمال',LayoutDashboard:'لوحات تحكم',
  MonitorSmartphone:'ويب وتطبيق',Workflow:'أتمتة',Sparkles:'حلول مبتكرة',Globe2:'مواقع',Database:'قواعد بيانات',
  Smartphone:'تطبيقات',Palette:'تصميم',ShieldCheck:'أمان',Rocket:'نمو وإطلاق',Settings:'إعدادات',Layers3:'أنظمة متكاملة',
  Server:'سيرفرات',Cloud:'سحابة',Zap:'سرعة وأداء',Users:'مستخدمون',MessageCircle:'تواصل',Mail:'بريد',Phone:'هاتف',
  Search:'بحث',ChartNoAxesCombined:'تحليلات',Heart:'اهتمام',Star:'مميز',Lightbulb:'أفكار',Headphones:'دعم',
  LockKeyhole:'حماية',PenTool:'أدوات',FileText:'محتوى',ImageIcon:'صور',Briefcase:'أعمال',Bot:'ذكاء اصطناعي',Boxes:'حلول متعددة',
  CheckCircle2:'تأكيد',
};

export default function IconPicker({value,onChange}:{value:string;onChange:(v:string)=>void}){
  const [open,setOpen]=useState(false);
  const Icon=SERVICE_ICONS[value]||SERVICE_ICONS.Sparkles;
  return <div className="icon-picker">
    <button type="button" className="icon-picker-trigger" onClick={()=>setOpen(!open)}>
      <span className="icon-picker-preview"><Icon size={20}/></span>
      <span><strong>{labels[value]||value||'اختر أيقونة'}</strong><small>{value||'لم يتم الاختيار'}</small></span>
      <span className="icon-picker-chevron">⌄</span>
    </button>
    {open&&<>
      <button className="icon-picker-backdrop" aria-label="إغلاق" onClick={()=>setOpen(false)}/>
      <div className="icon-picker-menu">
        {Object.entries(SERVICE_ICONS).map(([name,IconComp])=><button type="button" className={value===name?'selected':''} key={name} onClick={()=>{onChange(name);setOpen(false)}}><IconComp size={19}/><span>{labels[name]||name}</span></button>)}
      </div>
    </>}
  </div>
}
