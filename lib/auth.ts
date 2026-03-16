import { NextRequest, NextResponse } from 'next/server';

// API authentication utilities
// Uses environment variables for secure configuration

/**
 * Check if request is from same origin (internal dashboard)
 */
function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  // If no origin header, check referer (same-origin requests often don't have origin)
  if (!origin) {
    // Check referer matches the app
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (appUrl) {
          const appUrlObj = new URL(appUrl);
          return refererUrl.host === appUrlObj.host;
        }
        // In development, allow localhost
        if (host && refererUrl.host === host) {
          return true;
        }
      } catch {
        return false;
      }
    }
    // No origin or referer - could be server-side or direct API call
    // For security, we don't allow these without API key
    return false;
  }

  // Check if origin matches app URL
  if (appUrl) {
    try {
      const appUrlObj = new URL(appUrl);
      const originUrl = new URL(origin);
      return originUrl.host === appUrlObj.host;
    } catch {
      return false;
    }
  }

  // In development, allow localhost origins
  if (process.env.NODE_ENV === 'development') {
    return origin.includes('localhost') || origin.includes('127.0.0.1');
  }

  return false;
}

/**
 * Validate API key from request headers
 * Use for dashboard/admin API routes
 * Allows same-origin requests (from dashboard) without API key
 */
export function validateApiKey(request: NextRequest): { valid: boolean; error?: string } {
  // Allow same-origin requests (internal dashboard)
  if (isSameOriginRequest(request)) {
    return { valid: true };
  }

  const apiKey = process.env.API_SECRET_KEY;

  // If no API key is configured, allow in development only
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      return { valid: true };
    }
    return { valid: false, error: 'API key not configured' };
  }

  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key');

  // Check Bearer token or x-api-key header
  const providedKey = authHeader?.replace('Bearer ', '') || apiKeyHeader;

  if (!providedKey) {
    return { valid: false, error: 'Missing API key' };
  }

  if (providedKey !== apiKey) {
    return { valid: false, error: 'Invalid API key' };
  }

  return { valid: true };
}

/**
 * Validate cron secret for scheduled jobs
 * Use for /api/cron/* routes
 */
export function validateCronSecret(request: NextRequest): { valid: boolean; error?: string } {
  const cronSecret = process.env.CRON_SECRET;

  // If no cron secret configured, deny in production
  if (!cronSecret) {
    if (process.env.NODE_ENV === 'development') {
      return { valid: true };
    }
    return { valid: false, error: 'Cron secret not configured' };
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return { valid: false, error: 'Missing authorization header' };
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return { valid: false, error: 'Invalid cron secret' };
  }

  return { valid: true };
}

/**
 * Get allowed CORS origins from environment
 */
export function getAllowedOrigins(): string[] {
  const origins = process.env.ALLOWED_ORIGINS;

  if (!origins) {
    // Default to app URL if configured
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      return [appUrl];
    }
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
      return ['http://localhost:3000'];
    }
    return [];
  }

  return origins.split(',').map(origin => origin.trim());
}

/**
 * Check if origin is allowed for CORS
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  const allowedOrigins = getAllowedOrigins();

  // If no origins configured, deny all in production
  if (allowedOrigins.length === 0) {
    return process.env.NODE_ENV === 'development';
  }

  return allowedOrigins.includes(origin);
}

/**
 * Create CORS headers for allowed origins
 */
export function getCorsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();

  // Check if origin is allowed
  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400',
    };
  }

  // Default restrictive headers
  return {
    'Access-Control-Allow-Origin': allowedOrigins[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  };
}

/**
 * Return unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Middleware helper for protected routes
 */
export function withApiAuth(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: { requireAuth?: boolean } = { requireAuth: true }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    if (options.requireAuth) {
      const auth = validateApiKey(request);
      if (!auth.valid) {
        return unauthorizedResponse(auth.error);
      }
    }
    return handler(request);
  };
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or a dedicated rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new window
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP for rate limiting
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
