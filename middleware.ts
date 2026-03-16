import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for request-level security
// Runs on all requests matching the config below

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // For API routes, add additional security
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Remove server info from responses
    response.headers.delete('X-Powered-By');

    // Log API access (in production, use proper logging service)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    console.log(`[API] ${request.method} ${request.nextUrl.pathname} from ${clientIp}`);
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match dashboard pages (for future auth)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
