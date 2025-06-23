"use client";

import Link from "next/link";

export default function SidebarLeft() {
  return (
    <nav className="space-y-4">
      <Link href="/explore" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
        Explore
      </Link>
      <Link href="/activity" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
        Activity
      </Link>
      <Link href="/leaderboard" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
        Leaderboard
      </Link>
    </nav>
  );
}
