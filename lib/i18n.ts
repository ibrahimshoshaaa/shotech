import { cookies } from 'next/headers';

export type Locale = 'ar' | 'en';
export const LOCALE_COOKIE = 'shotech-locale';

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return value === 'en' ? 'en' : 'ar';
}

export function isEnglish(locale: Locale) { return locale === 'en'; }

export function localized(row: any, field: string, locale: Locale, fallback = '') {
  if (locale === 'en') return row?.[`${field}_en`] || row?.[field] || fallback;
  return row?.[field] || row?.[`${field}_en`] || fallback;
}

export function setting(settings: Record<string, any>, key: string, locale: Locale, fallback = '') {
  if (locale === 'en') return settings[`${key}_en`] || settings[key] || fallback;
  return settings[key] || settings[`${key}_en`] || fallback;
}

export const ui = {
  ar: {
    home:'الرئيسية', services:'خدماتنا', projects:'أعمالنا', about:'من نحن', contact:'تواصل معنا', start:'ابدأ مشروعك', switch:'EN',
    servicesHero:'خدماتنا مبنية حول شغلك.', servicesLead:'حلول رقمية مخصصة من الموقع والتطبيق إلى الأنظمة الداخلية وقواعد البيانات. كل خدمة لها هدف واضح، وكل جزء بيتبني عشان يكمل الصورة.',
    projectHero:'أعمالنا بتحكي طريقتنا.', projectLead:'مجموعة من الأنظمة والمنصات والتجارب الرقمية اللي بنيناها بهدف واضح: حل مشكلة حقيقية بشكل عملي.',
    aboutEyebrow:'عن ShoTech', aboutHero:'بنصمم التقنية عشان تخدم الشغل.',
    contactHero:'احكيلنا عن مشروعك.', contactLead:'مش لازم تكون مجهز كل التفاصيل. ابدأ بفكرة بسيطة، وإحنا نساعدك نحولها لخطة واضحة.',
    details:'تفاصيل الخدمة', learn:'اعرف أكتر', all:'كل الأعمال', view:'شوف المشروع', custom:'حلول مخصصة', contactIdea:'احكيلنا عن فكرتك', noServices:'الخدمات هتظهر هنا بعد إضافتها من لوحة التحكم.', noProjects:'لسه بنضيف أعمالنا هنا.',
    formName:'الاسم', formEmail:'البريد الإلكتروني', formPhone:'رقم الهاتف / واتساب', formCompany:'اسم الشركة (اختياري)', formSubject:'نوع المشروع أو الخدمة', formMessage:'احكيلنا عن فكرتك أو المشكلة اللي محتاج تحلها...', send:'إرسال الطلب', success:'تم استلام رسالتك، وهنرجعلك قريب.', error:'حصلت مشكلة، جرّب مرة تانية.',
    email:'البريد الإلكتروني', whatsapp:'واتساب', phone:'مكالمة', address:'العنوان', hours:'مواعيد العمل',
    footerExplore:'استكشف', footerContact:'تواصل', rights:'جميع الحقوق محفوظة.',
  },
  en: {
    home:'Home', services:'Services', projects:'Work', about:'About', contact:'Contact', start:'Start a project', switch:'عربي',
    servicesHero:'Services built around your business.', servicesLead:'Custom digital solutions, from websites and apps to internal systems and databases. Every service has a clear purpose and every part is built to fit the bigger picture.',
    projectHero:'Our work tells the story.', projectLead:'A selection of systems, platforms and digital experiences we built with one clear goal: solving real business problems in practical ways.',
    aboutEyebrow:'About ShoTech', aboutHero:'Technology designed to serve the work.',
    contactHero:'Tell us about your project.', contactLead:'You do not need every detail ready. Start with a simple idea and we will help shape it into a clear plan.',
    details:'Service details', learn:'Learn more', all:'All work', view:'View project', custom:'Custom solutions', contactIdea:'Tell us your idea', noServices:'Services will appear here after they are added from the dashboard.', noProjects:'Our work will appear here soon.',
    formName:'Name', formEmail:'Email', formPhone:'Phone / WhatsApp', formCompany:'Company (optional)', formSubject:'Project or service', formMessage:'Tell us about your idea or the problem you need to solve...', send:'Send request', success:'Your message has been received. We will get back to you soon.', error:'Something went wrong. Please try again.',
    email:'Email', whatsapp:'WhatsApp', phone:'Call', address:'Address', hours:'Working hours',
    footerExplore:'Explore', footerContact:'Contact', rights:'All rights reserved.',
  }
} as const;

export function t(locale: Locale, key: keyof typeof ui.ar) { return ui[locale][key] || ui.ar[key]; }
