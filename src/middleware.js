import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'purelume-secret-key-change-in-production-32-chars'
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const adminToken = req.cookies.get('admin_token')?.value;

  const isLoginPage = pathname === '/admin/login';
  const isSeedPage = pathname === '/admin/seed';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute && !isLoginPage && !isSeedPage) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    try {
      await jwtVerify(adminToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  if (isLoginPage && adminToken) {
    try {
      await jwtVerify(adminToken, JWT_SECRET);
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } catch (err) {
      // Invalid token, allow access to login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};