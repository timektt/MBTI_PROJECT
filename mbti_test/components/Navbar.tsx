import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-900 text-white">
      <Link href="/" className="font-bold text-xl">MBTI.AI</Link>
      <div className="space-x-4">
        <Link href="/quiz">Quiz</Link>
        <Link href="/dashboard">Dashboard</Link>
        {session ? (
          <button onClick={() => signOut()} className="underline">Logout</button>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </div>
    </nav>
  )
}