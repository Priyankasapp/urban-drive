// src/proxy.ts  (Next.js 16+, was middleware.ts)
import { proxy } from "next/server";
import { NextResponse } from "next/server";

export default proxy((req) => {
  const token = req.cookies.get("token");
  if (!token && req.nextUrl.pathname.startsWith("/admin") 
      && req.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
});