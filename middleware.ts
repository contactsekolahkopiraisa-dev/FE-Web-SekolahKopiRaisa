import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const allCookies = request.cookies.getAll();
  const pathname = request.nextUrl.pathname;
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isUmkmRoute = pathname.startsWith("/umkm");
  
  // Protected layanan routes that require authentication (riwayat dan detail-pelaksanaan)
  const isProtectedLayananRoute = 
    pathname.startsWith('/layanan/riwayat') ||
    pathname.startsWith('/layanan/detail-pelaksanaan');
  
  // Protected routes that always require auth
  const isProtectedRoute = 
    isAdminRoute || 
    isUmkmRoute || 
    isProtectedLayananRoute ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname === '/profile' ||
    (pathname.startsWith('/order') && pathname !== '/order'); // Allow /order but protect /order/[id]

  console.log('🔍 Middleware check:', {
    path: pathname,
    hasToken: !!token,
    tokenLength: token?.length,
    cookiesCount: allCookies.length,
    isProtectedRoute,
  });

  // If no token, block protected routes and redirect to login
  if (!token) {
    if (isProtectedRoute) {
      console.log("❌ No token found, redirecting to login for:", pathname);
      console.log("   All cookies:", allCookies);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Public routes accessible without token
    console.log("✅ Public route, no auth needed");
    return NextResponse.next();
  }

  console.log("✅ Token found, checking role...");

  console.log("✅ Token found, checking role...");

  try {
    // Decode JWT token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isAdmin = payload.admin;
    
    console.log("   User role:", isAdmin ? "Admin" : "Regular User");
    
    // Admin trying to access non-admin routes (except assets and public resources)
    if (isAdmin && !isAdminRoute && !request.nextUrl.pathname.startsWith('/assets') && !request.nextUrl.pathname.startsWith('/public')) {
      console.log('⚠️ Admin trying to access non-admin route, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Non-admin trying to access admin routes
    if (!isAdmin && isAdminRoute) {
      console.log('❌ Non-admin trying to access admin route, redirecting to unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Allow access for authenticated users
    console.log("✅ Access granted");
    return NextResponse.next();
    
  } catch (error) {
    console.log('Error decoding token:', error);
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|oauth-success|unauthorized|reset-password|assets|public).*)',
  ]
};

