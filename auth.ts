import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials.email === "string" ? credentials.email : null;
        const password =
          typeof credentials.password === "string" ? credentials.password : null;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password || !(await bcrypt.compare(password, user.password))) {
          return null;
        }

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
          preferredLocale: user.preferredLocale ?? "th",
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      return Boolean((user as { emailVerified?: Date | null }).emailVerified);
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const accountUser = user as typeof user & {
          emailVerified?: Date | null;
          role?: string;
          username?: string | null;
          hasProfile?: boolean;
          hasMbtiCard?: boolean;
          mbtiType?: string;
          preferredLocale?: string;
        };

        token.id = user.id;
        token.email = user.email;
        token.role = accountUser.role ?? "user";
        token.emailVerified = accountUser.emailVerified;
        token.name = user.name;
        token.picture = user.image;
        token.username = accountUser.username ?? "";
        token.hasProfile = accountUser.hasProfile ?? false;
        token.hasMbtiCard = accountUser.hasMbtiCard ?? false;
        token.mbtiType = accountUser.mbtiType ?? "";
        token.preferredLocale = accountUser.preferredLocale ?? "th";
      }

      if (trigger === "update" && session?.user) {
        token.username = session.user.username;
        token.hasProfile = session.user.hasProfile;
        token.hasMbtiCard = session.user.hasMbtiCard;
        token.mbtiType = session.user.mbtiType;
        token.picture = session.user.image;
        token.preferredLocale = session.user.preferredLocale;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.role = typeof token.role === "string" ? token.role : "user";
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.image =
          typeof token.picture === "string" ? token.picture : null;
        session.user.username =
          typeof token.username === "string" ? token.username : "";
        session.user.hasProfile = token.hasProfile === true;
        session.user.hasMbtiCard = token.hasMbtiCard === true;
        session.user.mbtiType =
          typeof token.mbtiType === "string" ? token.mbtiType : "";
        session.user.preferredLocale =
          typeof token.preferredLocale === "string"
            ? token.preferredLocale
            : "th";
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
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
