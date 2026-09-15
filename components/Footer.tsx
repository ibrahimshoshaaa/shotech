import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getSettings } from '@/lib/site';

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Image src="/shotech-mark.png" alt="ShoTech" width={190} height={64} />
            <p>نبني حلولًا رقمية عملية تساعد الشركات على النمو، التنظيم، والتحرك بثقة.</p>
          </div>
          <div className="footer-col">
            <h4>استكشف</h4>
            <Link href="/services">خدماتنا</Link><Link href="/projects">أعمالنا</Link><Link href="/about">من نحن</Link><Link href="/contact">تواصل معنا</Link>
          </div>
          <div className="footer-col footer-contact">
            <h4>تواصل</h4>
            <a href={`mailto:${settings.email || ''}`}><Mail size={16}/>{settings.email || 'hello@shotech.dev'}</a>
            <a href={`tel:${settings.whatsapp || ''}`}><Phone size={16}/>{settings.whatsapp || 'واتساب'}</a>
            <span><MapPin size={16}/>مصر · نخدم عملاءنا أينما كانوا</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ShoTech. جميع الحقوق محفوظة.</span>
          <span>Smart solutions. Powerful systems.</span>
        </div>
      </div>
    </footer>
  );
}
