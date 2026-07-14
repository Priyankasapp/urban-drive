import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 expects the function to be named 'proxy'
export function proxy(request: NextRequest) {
  // 1. Grab the token from cookies
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Protect specific paths (e.g., /dashboard, /portal)
  // If no token exists and they try to visit a protected area, send them to login
  if (
    !token &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/portal"))
  ) {
    const loginUrl = new URL("/login", request.url);
    // Optional: Pass the original path so they can be redirected back after logging in
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 3. Allow authenticated or public requests to continue normally
  return NextResponse.next();
}

// 4. Configure the matcher to prevent the proxy from executing on static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled separately by Next.js API Routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
