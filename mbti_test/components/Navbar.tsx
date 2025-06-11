import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "@/components/NotificationBell";
import Image from "next/image";
import { useState } from "react";

type SafeUser = {
  name?: string;
  email?: string;
  image?: string;
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // ✅ ถ้า session ยัง loading → ยังไม่ render Navbar
  if (status === "loading") return null;

  // ✅ ใช้ SafeUser → ป้องกัน undefined
  const user = (session?.user ?? {}) as SafeUser;

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md sticky top-0 z-50">
      {/* Left Section: Logo + Menu */}
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          MBTI.AI
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/quiz"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Quiz
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Explore
          </Link>
          <Link
            href="/activity"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Activity
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Right Section: Notification + Auth */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        {session && <NotificationBell />}

        {/* Auth Section */}
        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none"
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                {user.name ?? user.email ?? "Account"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-xl w-48 z-50 overflow-hidden ring-1 ring-black/5">
                <Link
                  href="/dashboard"
                  className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setDropdownOpen(false); // ✅ ปิด dropdown ทันทีหลัง logout
                  }}
                  className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
