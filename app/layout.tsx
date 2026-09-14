import './globals.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'ShoTech Solutions',
  description: 'Smart Solutions. Powerful Systems.',
};

export default function Root({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
