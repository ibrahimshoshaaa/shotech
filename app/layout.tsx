import './globals.css';
import './website.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShoTech Solutions | حلول رقمية تبني فرقًا',
  description: 'ShoTech تبني مواقع وأنظمة وحلولًا رقمية عملية تساعد الشركات على النمو.',
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
