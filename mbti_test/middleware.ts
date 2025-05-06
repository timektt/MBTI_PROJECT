// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token

    // 🔐 ถ้าเข้าหน้า /admin แต่ไม่ใช่ admin → redirect
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // อนุญาตเฉพาะคนที่ login เท่านั้น
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard",
    "/profile/:path*",
    "/admin/:path*", // ✅ ป้องกันหน้า admin
  ],
}
