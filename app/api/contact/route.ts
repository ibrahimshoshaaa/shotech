import { query } from '@/lib/db';
import { z } from 'zod';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(5).max(5000),
});

function getIP(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  if (!checkRateLimit(getIP(req))) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid contact data.' }, { status: 400 });
    }

    const { name, email, phone, message } = parsed.data;
    await query(
      'INSERT INTO messages(name,email,phone,message) VALUES(?,?,?,?)',
      [name, email, phone || '', message],
    );

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Unable to submit your message.' }, { status: 500 });
  }
}
