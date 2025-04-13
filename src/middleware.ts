import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyJWT(token: string) {
  try {
    if (!token) return null;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_replace_this');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('refresh_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?from=admin', request.url));
    }
    
    try {
      const payload = await verifyJWT(token);
      
      if (!payload || payload.role !== 'admin') {
        if (!payload) {
          return NextResponse.redirect(new URL('/auth/login?from=admin', request.url));
        }
        
        return NextResponse.redirect(new URL('/?access=denied', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/auth/login?from=admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 