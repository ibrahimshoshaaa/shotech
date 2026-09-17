import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// ── In-memory rate limiter ─────────────────────────────────────────────────
// Tracks failed attempts per IP. Resets automatically after WINDOW_MS.
// (Sufficient for a single-admin site; replace with Redis/Upstash for multi-instance.)

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

const attempts = new Map<string, { count: number; resetAt: number }>();

function getIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now  = Date.now();
  const entry = attempts.get(ip);

  // First attempt or window expired — reset
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

function resetAttempts(ip: string) {
  attempts.delete(ip);
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const ip = getIP(req);
  const { allowed, retryAfterSec } = checkRateLimit(ip);

  if (!allowed) {
    return Response.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      },
    );
  }

  const { email, password } = await req.json();

  if (
    email    !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Successful login — clear the failure counter
  resetAttempts(ip);

  const token = await createToken();
  const c = await cookies();
  c.set('shotech_admin', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    path:     '/',
    maxAge:   604800, // 7 days
  });

  return Response.json({ ok: true });
}
