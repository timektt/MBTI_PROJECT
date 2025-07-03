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
        const creds = credentials as { email: string; password: string };

        if (!creds?.email || !creds?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(creds.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          name: user.name ?? user.email,
          image: user.image ?? null,
          username: user.username ?? "",
          hasProfile: user.hasProfile ?? false,
          hasMbtiCard: user.hasMbtiCard ?? false,
          mbtiType: user.mbtiType ?? "",
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

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
        secure: process.env.NODE_ENV === "production" ? true : false,
      },
    },
  },

  callbacks: {
    async signIn({ user }) {
      const emailVerified = (user as { emailVerified?: Date | null }).emailVerified;
      if (!emailVerified) {
        throw new Error("Please verify your email first.");
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as {
          id: string;
          email: string;
          role?: string;
          emailVerified?: Date | null;
          name?: string;
          image?: string | null;
          username?: string | null;
          hasProfile?: boolean;
          hasMbtiCard?: boolean;
          mbtiType?: string;
        };

        token.id = u.id;
        token.email = u.email;
        token.role = u.role ?? "user";
        token.emailVerified = u.emailVerified;
        token.name = u.name;
        token.picture = u.image;
        token.username = u.username ?? "";
        token.hasProfile = u.hasProfile ?? false;
        token.hasMbtiCard = u.hasMbtiCard ?? false;
        token.mbtiType = u.mbtiType ?? "";
      }

      // ✅ เพิ่ม trigger update เพื่อ refresh token fields หลัง client update
      if (trigger === "update" && session?.user) {
        token.username = session.user.username;
        token.hasProfile = session.user.hasProfile;
        token.hasMbtiCard = session.user.hasMbtiCard;
        token.mbtiType = session.user.mbtiType;
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
        session.user.username = token.username as string;
        session.user.hasProfile = token.hasProfile as boolean;
        session.user.hasMbtiCard = token.hasMbtiCard as boolean;
        session.user.mbtiType = token.mbtiType as string;
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
