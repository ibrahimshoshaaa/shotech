'use client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    if (res.ok) router.push('/admin'); else alert('Invalid credentials');
  }
  return <main className="admin-login"><div className="admin-login-card"><div className="admin-login-brand">Sho<span>Tech</span><small>ADMIN PANEL</small></div><h1>Welcome back</h1><p>Sign in to manage your website.</p><form className="form" onSubmit={submit}><input className="input" name="email" type="email" placeholder="Email" required/><input className="input" name="password" type="password" placeholder="Password" required/><button className="btn">Login</button></form></div></main>;
}
