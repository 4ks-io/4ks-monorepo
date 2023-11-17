import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // this is essentially a hack because next-url isn't working upon initial page load
  // https://github.com/vercel/next.js/issues/57762
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url-pathname', req.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// prevent middleware running on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    '/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)',
  ],
};
