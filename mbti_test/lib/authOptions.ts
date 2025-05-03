// lib/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // ใช้ JWT แทน session DB
    maxAge: 30 * 24 * 60 * 60, // (optional) อายุ session 30 วัน
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // เพิ่ม id ลง token
        token.email = user.email
      }
      return token
    },
    async session({
      session,
      token,
    }: {
      session: Session
      token: JWT
    }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login", // ✅ redirect ไปหน้า Login ของเราเอง
    error: "/login?error=OAuthError", // ✅ error page custom
  },

  theme: {
    colorScheme: "auto",
    logo: "/logo.svg", // ✅ โลโก้ถ้ามี
  },

  // (optional) เพิ่ม security headers ได้ใน middleware หรือ next.config.js
}
