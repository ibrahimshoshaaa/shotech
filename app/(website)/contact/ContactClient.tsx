'use client';

import { useState } from 'react';
import { Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

const copy = {
  ar: {
    eyebrow:  'تواصل معنا',
    title:    'احكيلنا عن مشروعك.',
    lead:     'مش لازم تكون مجهز كل التفاصيل. ابدأ بفكرة بسيطة، وإحنا نساعدك نحولها لخطة واضحة.',
    info:     'بيانات التواصل',
    heading:  'خلينا نبدأ من المشكلة.',
    desc:     'ابعتلنا تفاصيل بسيطة عن مشروعك أو المشكلة اللي بتحاول تحلها، وهنرد عليك بالخطوة المناسبة.',
    email:    'البريد الإلكتروني',
    wa:       'واتساب',
    call:     'مكالمة',
    send:     'إرسال الرسالة',
    name:     'الاسم',
    mail:     'البريد الإلكتروني',
    phone:    'رقم الهاتف / واتساب',
    company:  'اسم الشركة (اختياري)',
    subject:  'نوع المشروع أو الخدمة',
    message:  'احكيلنا عن فكرتك أو المشكلة اللي محتاج تحلها...',
    success:  'تم استلام رسالتك، وهنرجعلك قريب.',
    error:    'حصلت مشكلة، جرّب مرة تانية.',
    required: 'الاسم والبريد والرسالة مطلوبين.',
  },
  en: {
    eyebrow:  'Contact',
    title:    'Tell us about your project.',
    lead:     'You do not need every detail ready. Start with a simple idea and we will help shape it into a clear plan.',
    info:     'Contact details',
    heading:  'Let\'s start from the problem.',
    desc:     'Share a few details about your project or the problem you are trying to solve.',
    email:    'Email',
    wa:       'WhatsApp',
    call:     'Call',
    send:     'Send message',
    name:     'Name',
    mail:     'Email',
    phone:    'Phone / WhatsApp',
    company:  'Company (optional)',
    subject:  'Project or service',
    message:  'Tell us about your idea or the problem you need to solve...',
    success:  'Your message has been received. We will get back to you soon.',
    error:    'Something went wrong. Please try again.',
    required: 'Name, email and message are required.',
  },
} as const;

export default function ContactClient({ locale }: { locale: Locale }) {
  const x = copy[locale];
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Client-side validation
    if (!data.name || !data.email || !data.message) {
      setStatus('error');
      setMsg(x.required);
      return;
    }

    setStatus('loading');
    try {
      const r = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      if (r.ok) {
        setStatus('success');
        setMsg(x.success);
        form.reset();
      } else {
        setStatus('error');
        setMsg(x.error);
      }
    } catch {
      setStatus('error');
      setMsg(x.error);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{x.eyebrow}</div>
          <h1>{x.title}</h1>
          <p>{x.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          {/* Contact info */}
          <div>
            <div className="eyebrow">{x.info}</div>
            <h2 style={{ fontSize: '42px', margin: '15px 0' }}>{x.heading}</h2>
            <p className="muted">{x.desc}</p>
            <div className="contact-info">
              <div className="contact-item">
                <Mail />
                <div><b>{x.email}</b><span>hello@shotech.dev</span></div>
              </div>
              <div className="contact-item">
                <MessageCircle />
                <div>
                  <b>{x.wa}</b>
                  <span>{locale === 'ar' ? 'متاح للرد والاستفسارات' : 'Available for questions'}</span>
                </div>
              </div>
              <div className="contact-item">
                <Phone />
                <div>
                  <b>{x.call}</b>
                  <span>{locale === 'ar' ? 'نرتب معاك وقت مناسب' : 'We can arrange a suitable time'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-card">
            <form className="form" onSubmit={submit} noValidate>
              <div className="form-row">
                <input className="input" name="name"  placeholder={x.name}  required />
                <input className="input" name="email" placeholder={x.mail}  required type="email" />
              </div>
              <div className="form-row">
                <input className="input" name="phone"   placeholder={x.phone} />
                <input className="input" name="company" placeholder={x.company} />
              </div>
              <input    className="input" name="subject" placeholder={x.subject} />
              <textarea name="message" placeholder={x.message} required />

              <button
                className="btn btn-primary"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                  : <>{x.send} <ArrowLeft size={17} /></>
                }
              </button>

              {msg && (
                <p
                  className="muted"
                  style={{ color: status === 'error' ? '#c0392b' : undefined }}
                >
                  {msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
