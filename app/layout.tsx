import './globals.css';import './website.css';import './section-headings.css';import './admin/admin.css';import type {Metadata} from 'next';import {getLocale} from '@/lib/i18n';
export const metadata:Metadata={title:'ShoTech Solutions | حلول رقمية تبني فرقًا',description:'ShoTech تبني مواقع وأنظمة وحلولًا رقمية عملية تساعد الشركات على النمو.'};
export default async function Root({children}:{children:React.ReactNode}){const locale=await getLocale();return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body>{children}</body></html>}
