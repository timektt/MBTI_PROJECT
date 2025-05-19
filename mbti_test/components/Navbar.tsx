// ✅ components/Navbar.tsx

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "@/components/NotificationBell";
import Image from "next/image";
import { useState } from "react";

// ✅ กำหนด type แบบปลอดภัย
type SafeUser = {
  name?: string;
  email?: string;
  image?: string;
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  if (status === "loading") return null;

  const user = (session?.user ?? {}) as SafeUser;

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-900 text-white relative">
      <Link href="/" className="font-bold text-xl">MBTI.AI</Link>

      <div className="flex items-center gap-4">
        <Link href="/quiz" className="hover:underline">Quiz</Link>
        <Link href="/explore" className="hover:underline">Explore</Link>
        <Link href="/activity" className="hover:underline">Activity</Link>
        <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>

        {session && <NotificationBell />}

        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt="profile"
                  width={32}
                  height={32}
                  className="rounded-full border"
                />
              )}
              <span className="text-sm hidden sm:inline">
                {user.name ?? user.email ?? "Account"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow w-40 z-50">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Dashboard
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="hover:underline text-sm">
              Login
            </Link>
            <Link href="/register" className="hover:underline text-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
