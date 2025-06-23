import { DefaultSession } from "next-auth";

// ✅ ขยาย Session ให้มี id, email, role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      username?: string;
      hasProfile: boolean;
      hasMbtiCard: boolean;
      mbtiType: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    username?: string;
    hasProfile: boolean;
    hasMbtiCard: boolean;
    mbtiType: string;
  }
}

// ✅ ขยาย JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    username?: string;
    hasProfile: boolean;
    hasMbtiCard: boolean;
    mbtiType: string;
  }
}
