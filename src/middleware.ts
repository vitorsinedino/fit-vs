import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the current path
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/dashboard'];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );

  // Get token from cookies or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access login/register, redirect to dashboard
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};