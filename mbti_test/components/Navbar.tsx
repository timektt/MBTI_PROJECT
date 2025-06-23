import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Bell } from "lucide-react";
import AvatarWithLightbox from "@/components/AvatarWithLightbox";



type SafeUser = {
  name?: string;
  email?: string;
  image?: string;
  hasProfile?: boolean;
  hasMbtiCard?: boolean;
};

export default function Navbar() {
  const { data: session, status  } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  if (status === "loading") return null;

  const user = (session?.user ?? {}) as SafeUser;

  const isLoggedIn = !!session?.user?.email;
  const hasProfile = !!user.hasProfile;
  const hasMbtiCard = !!user.hasMbtiCard;

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
          {isLoggedIn && !hasProfile && (
            <Link
              href="/setup-profile"
              className="text-sm font-bold text-red-500"
            >
              Setup Profile
            </Link>
          )}

          {isLoggedIn && hasProfile && !hasMbtiCard && (
            <Link
              href="/quiz"
              className="text-sm font-bold text-blue-600 animate-pulse"
            >
              Start Quiz
            </Link>
          )}

          {isLoggedIn && hasProfile && hasMbtiCard && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Right Section: Notification + Profile */}
      <div className="flex items-center gap-6 relative">
        {isLoggedIn && (
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <AvatarWithLightbox imageUrl={user.image || "/default-avatar.png"} />
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {user.name ?? user.email ?? "Account"}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-xl w-48 z-50 overflow-hidden ring-1 ring-black/5">
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
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
