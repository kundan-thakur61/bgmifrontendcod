import { NextResponse } from 'next/server';

/**
 * SEO + Canonical Middleware (Next.js App Router)
 *
 * NOTE: Next.js 16+ deprecates the generic "middleware" name for some proxy use cases
 * in favor of explicit proxy files in certain scenarios.
 * This file is **intentionally** used for:
 *   - Trailing slash removal
 *   - Lowercase enforcement
 *   - Private route noindex headers
 *
 * API routes (/api/*) and static assets are explicitly skipped so they are not affected.
 * For backend API proxying we rely on `rewrites()` in next.config.js + the centralized
 * `@/lib/api` client.
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next();

  // ── Skip static files and Next.js internals ──
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files (images, fonts, etc.)
  ) {
    return response;
  }

  // ── Trailing Slash Removal ──
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  // ── Force Lowercase URLs ──
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // ── X-Robots-Tag for private routes ──
  const noIndexRoutes = ['/admin', '/wallet', '/kyc', '/profile/settings', '/room'];
  const isPrivate = noIndexRoutes.some(route => pathname.startsWith(route));
  if (isPrivate) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
};
