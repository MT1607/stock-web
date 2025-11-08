import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function handleAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value;

  if (!token && !pathname.startsWith('/auth')) {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname); // quay lại sau khi login
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Đã login → nếu truy cập /auth thì quay về dashboard
  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/stocks', req.url));
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ['/', '/stocks', '/dashboard/:path*', '/auth/:path*'],
};
