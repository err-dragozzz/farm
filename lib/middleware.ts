import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {
  const token = request.cookies.get(
    "authjs.session-token"
  );

  const protectedRoutes = [
    "/dashboard",
    "/farms",
    "/crops",
    "/expenses",
    "/income",
    "/reports",
    "/notifications",
    "/profile",
    "/admin"
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(
        route
      )
    );

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/farms/:path*",
    "/crops/:path*",
    "/expenses/:path*",
    "/income/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/admin/:path*"
  ]
};