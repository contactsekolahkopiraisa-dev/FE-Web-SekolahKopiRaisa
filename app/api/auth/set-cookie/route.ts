// app/api/auth/set-cookie/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({ success: true });
    
    // Set cookie on server-side (this will be properly sent to middleware)
    const maxAge = 30 * 24 * 60 * 60; // 30 days
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: false, // Allow JavaScript access for client-side use
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });
    
    console.log('✅ Cookie set server-side for token');
    
    return response;
  } catch (error) {
    console.error('❌ Error setting cookie:', error);
    return NextResponse.json(
      { error: 'Failed to set cookie' },
      { status: 500 }
    );
  }
}
