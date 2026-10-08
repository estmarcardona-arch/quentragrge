import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Check if we have a session (in a real app, verify the Supabase cookie)
  // For the MVP frontend, we check for a custom token or rely on Supabase client in layouts.
  // Actually, standard Supabase Next.js middleware is better.
  
  const token = request.cookies.get('sb-qgpkvpothudjoizluxkn-auth-token') || request.cookies.get('supabase-auth-token');
  const isAuthRoute = request.nextUrl.pathname === '/login';
  const isPublicRoute = request.nextUrl.pathname.startsWith('/verificar') || isAuthRoute;
  
  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/inicio', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (!token && !isPublicRoute && !request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/_next/') && !request.nextUrl.pathname.startsWith('/design')) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
