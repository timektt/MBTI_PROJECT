import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import NotificationBell from "@/components/NotificationBell"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-900 text-white">
      <Link href="/" className="font-bold text-xl">MBTI.AI</Link>

      <div className="flex items-center gap-4">
        <Link href="/quiz" className="hover:underline">Quiz</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>

        {session && (
          <NotificationBell />
        )}

        {session ? (
          <button
            onClick={() => signOut()}
            className="hover:underline text-sm"
          >
            Logout
          </button>
        ) : (
          <Link href="/api/auth/signin" className="hover:underline text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
