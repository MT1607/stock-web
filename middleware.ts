import { handleAuthMiddleware } from './auth-middleware';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  return handleAuthMiddleware(req);
}

export const config = {
  matcher: ['/', '/auth', '/stocks'],
};
