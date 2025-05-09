// app/middleware.ts

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET! })
  const url = req.nextUrl;
  const pathname = url.pathname;


  if (!token) {
    console.error("Token not found");
    // return NextResponse.redirect(new URL("/", req.url));
    console.log("Token not found, redirecting to login page");
  }
  
  // console.log("Token found: ", token);
  const role = token?.role;


  if (role === "ALUMNI") {
    if (!pathname.startsWith("/alumni")) {
      return NextResponse.redirect(new URL("/alumni", req.url));
    }
  }


  if (role === "COMPANY") {
    if (!pathname.startsWith("/company")) {
      return NextResponse.redirect(new URL("/company", req.url));
    }
  }

  if (role === "ADMIN") {
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/alumni/:path*", "/company/:path*" , "/admin/:path*"],
};
