import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
