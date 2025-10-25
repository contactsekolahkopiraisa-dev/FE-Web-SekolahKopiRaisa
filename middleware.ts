import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('All cookies:', request.cookies.getAll());
  const token = request.cookies.get('token')?.value;
  console.log('Token found:', !!token);
  console.log('Token value (first 50 chars):', token?.substring(0, 50));
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLayananRoute = request.nextUrl.pathname.startsWith('/layanan');

  // If no token, block protected routes (/admin and /layanan) and redirect to login
  if (!token) {
    if (isAdminRoute || isLayananRoute) {
      console.log('No token found, redirecting to login for protected route');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('No token found, allowing public access');
    return NextResponse.next();
  }

  try {
    // Decode JWT token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded payload:', payload);
    
    const isAdmin = payload.admin;
    
    // If user is admin
    if (isAdmin) {
      console.log('User is admin');
      
      // Admin can access /admin routes and /assets routes
      if (!isAdminRoute && !request.nextUrl.pathname.startsWith('/assets')) {
        console.log('Admin trying to access non-admin route, redirecting to admin dashboard');
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      console.log('Admin accessing admin route or assets, allowing access');
      return NextResponse.next();
    }
    
    // If user is not admin
    if (!isAdmin) {
      console.log('User is not admin');
      
      // Non-admin cannot access /admin routes
      if (isAdminRoute) {
        console.log('Non-admin trying to access admin route, redirecting to unauthorized');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      console.log('Non-admin accessing public route or /layanan, allowing access');
      return NextResponse.next();
    }
    
  } catch (error) {
    console.log('Error decoding token:', error);
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|unauthorized).*)',
  ]
};

