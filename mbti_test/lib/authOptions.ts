import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          name: user.name ?? user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ✅ เพิ่ม cookies config → ให้ Secure เป็น false บน Localhost → เพื่อให้ Cookie set ได้
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" ? true : false, // ✅ Localhost ต้อง false
      },
    },
  },

  callbacks: {
    async signIn({ user }) {
  const emailVerified = (user as { emailVerified?: Date | null }).emailVerified;
  if (!emailVerified) {
    throw new Error("Please verify your email first."); // ❌ ถ้า throw → No Set-Cookie
  }
  return true;
},


async jwt({ token, user }) {
  if (user) {
    const u = user as {
      id: string;
      email: string;
      role?: string;
      emailVerified?: Date | null;
      name?: string;
      image?: string | null;
      username?: string | null; // ✅ เพิ่มตรงนี้
    };

    token.id = u.id;
    token.email = u.email;
    token.role = u.role ?? "user";
    token.emailVerified = u.emailVerified;
    token.name = u.name;
    token.picture = u.image;
    token.username = u.username ?? ""; // ✅ เพิ่มตรงนี้
  }
  return token;
},


    async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;
    session.user.role = token.role as string;
    session.user.name = token.name as string;
    session.user.image = token.picture as string;
    session.user.username = token.username as string; // ✅ เพิ่มบรรทัดนี้
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
