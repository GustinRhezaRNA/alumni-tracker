// app/middleware.ts

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req , secret: process.env.AUTH_SECRET! });

  const url = req.nextUrl;
  const pathname = url.pathname;

  // ⛔ Jika belum login, redirect ke sign-in
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = token.role;

  // 🔐 ROLE: ALUMNI
  if (role === "ALUMNI") {
    if (!pathname.startsWith("/alumni")) {
      return NextResponse.redirect(new URL("/alumni", req.url));
    }
  }

  // 🔐 ROLE: COMPANY
  if (role === "COMPANY") {
    if (!pathname.startsWith("/company")) {
      return NextResponse.redirect(new URL("/company", req.url));
    }
  }

  // ✅ Jika semua cocok, lanjut
  return NextResponse.next();
}

// 🎯 Middleware hanya aktif di route ini
export const config = {
  matcher: ["/alumni/:path*", "/company/:path*"],
};
