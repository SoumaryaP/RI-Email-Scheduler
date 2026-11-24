import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isRootPage = request.nextUrl.pathname === "/";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Landing page (/) is always public
  if (isRootPage) {
    return NextResponse.next();
  }

  // Protect dashboard — redirect unauthenticated users to login
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users on login page → dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
