import { scryptSync, timingSafeEqual } from 'node:crypto';
import { createToken } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { cookies } from 'next/headers';

function getIP(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;

  // Use a valid scrypt hash when one is configured.
  if (stored?.startsWith('scrypt$')) {
    const [algorithm, saltHex, hashHex] = stored.split('$');
    if (algorithm !== 'scrypt' || !saltHex || !hashHex) return false;
    try {
      const hash = scryptSync(password, Buffer.from(saltHex, 'hex'), 64, { N: 16384, r: 8, p: 1 });
      return safeEqual(hash, Buffer.from(hashHex, 'hex'));
    } catch {
      return false;
    }
  }

  // Backward-compatible Vercel setup: ADMIN_PASSWORD may be used in production.
  const plainPassword = process.env.ADMIN_PASSWORD || '';
  return plainPassword.length > 0 && safeEqual(Buffer.from(password), Buffer.from(plainPassword));
}

export async function POST(req: Request) {
  const ip = getIP(req);
  const limit = await checkRateLimit('login', ip);

  if (!limit.allowed) {
    return Response.json(
      { error: 'Too many failed attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (
      !safeEqual(Buffer.from(email), Buffer.from(process.env.ADMIN_EMAIL || '')) ||
      !verifyPassword(password)
    ) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await resetRateLimit('login', ip);
    const token = await createToken();
    const cookieStore = await cookies();
    cookieStore.set('shotech_admin', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 604800,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
