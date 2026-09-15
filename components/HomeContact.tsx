'use client';
import { useState } from 'react';
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone, Clock } from 'lucide-react';

export default function HomeContact({ settings }: { settings: any }) {
  const [ok, setOk] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setOk(r.ok ? 'تم استلام رسالتك، وهنرجعلك قريب.' : 'حصلت مشكلة، جرّب مرة تانية.');
    if (r.ok) form.reset();
  }
  const email = settings.email || 'hello@shotech.dev';
  const phone = settings.phone || settings.whatsapp || 'واتساب';
  const whatsapp = settings.whatsapp || phone;
  const address = settings.address || 'مصر · نخدم عملاءنا أينما كانوا';
  const hours = settings.working_hours || settings.hours || 'السبت – الخميس · 10 ص – 10 م';
  return <>
    <section id="contact" className="section section-soft home-contact">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">تواصل معنا</div><h2>احكيلنا عن مشروعك.</h2></div><p className="muted">مش لازم تكون مجهز كل التفاصيل. ابدأ بفكرة بسيطة وإحنا نساعدك نحولها لخطوة واضحة.</p></div>
        <div className="contact-layout">
          <div className="form-card"><form className="form" onSubmit={submit}>
            <div className="form-row"><input className="input" name="name" placeholder="الاسم" required/><input className="input" name="email" type="email" placeholder="البريد الإلكتروني" required/></div>
            <div className="form-row"><input className="input" name="phone" placeholder="رقم الهاتف / واتساب"/><input className="input" name="company" placeholder="اسم الشركة (اختياري)"/></div>
            <input className="input" name="subject" placeholder="نوع المشروع أو الخدمة"/>
            <textarea name="message" placeholder="احكيلنا عن فكرتك أو المشكلة اللي محتاج تحلها..." required/>
            <button className="btn btn-primary" type="submit">إرسال الطلب <ArrowLeft size={17}/></button>
            {ok && <p className="muted">{ok}</p>}
          </form></div>
          <div className="home-contact-copy"><h3>خلينا نبدأ من المشكلة.</h3><p className="muted">ابعتلنا تفاصيل بسيطة، وهنرجعلك بالخطوة المناسبة.</p></div>
        </div>
      </div>
    </section>
    <section id="call-us" className="section home-contact-info">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">اتصل بينا</div><h2>بيانات التواصل.</h2></div><p className="muted">كل طرق التواصل ومواعيد العمل في مكان واحد.</p></div>
        <div className="contact-info-grid">
          <div className="contact-item"><Mail/><div><b>البريد الإلكتروني</b><span>{email}</span></div></div>
          <div className="contact-item"><Phone/><div><b>رقم الهاتف</b><span>{phone}</span></div></div>
          <div className="contact-item"><MessageCircle/><div><b>واتساب</b><span>{whatsapp}</span></div></div>
          <div className="contact-item"><MapPin/><div><b>العنوان</b><span>{address}</span></div></div>
          <div className="contact-item"><Clock/><div><b>مواعيد العمل</b><span>{hours}</span></div></div>
        </div>
      </div>
    </section>
  </>;
}
