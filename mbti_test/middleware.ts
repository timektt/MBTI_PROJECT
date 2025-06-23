import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    const url = req.nextUrl;

    // ✅ Redirect ตาม state
    if (url.pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

      if (!token?.hasProfile) {
      return NextResponse.redirect(new URL("/setup-profile", req.url));
    }

    if (token?.hasProfile && !token?.hasMbtiCard) {
      return NextResponse.redirect(new URL("/quiz", req.url));
    }


    // ✅ Allow ผ่าน
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.email, // ✅ ต้องแก้ตรงนี้!
    },
    pages: {
      signIn: "/login",
    },
  }
);


// ✅ ระบุเฉพาะ path ที่ต้องการตรวจสอบ (เพิ่ม "/" root page ด้วย!)
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/explore",
    "/activity",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
