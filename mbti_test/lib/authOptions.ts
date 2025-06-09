import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ เพิ่ม emailVerified ให้ด้วย → เพื่อให้ callbacks.signIn ใช้ได้
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
 async signIn({ user }) {
  const emailVerified = (user as { emailVerified?: Date | null }).emailVerified;

  if (!emailVerified) {
    throw new Error("Please verify your email first.");
  }
  return true;
},



    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: {
        id: string;
        email: string;
        role?: string;
        emailVerified?: Date | null;
      };
    }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role ?? "user";
        token.emailVerified = user.emailVerified;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        // Optional → ถ้าอยากใช้ใน front → เอามาใช้ต่อได้
        // session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=OAuthError",
  },

  theme: {
    colorScheme: "auto",
    logo: "/logo.svg",
  },
};
