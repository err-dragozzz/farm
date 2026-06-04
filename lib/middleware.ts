import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

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

  const isProtected = protectedRoutes.some(
    (route) =>
      req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
});

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