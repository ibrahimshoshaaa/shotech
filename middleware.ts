import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  // Login page is always accessible
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get('shotech_admin')?.value;
  const ok = await verifyToken(token);

  if (!ok) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
