// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
