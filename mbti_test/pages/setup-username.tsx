// pages/setup-username.tsx

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { useState } from "react"
import { useRouter } from "next/router"
import type { GetServerSideProps, GetServerSidePropsContext } from "next"


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || !session.user?.email) {
    return { redirect: { destination: "/api/auth/signin", permanent: false } }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { username: true },
  })

  if (user?.username) {
    return { redirect: { destination: "/", permanent: false } }
  }

  return { props: {} }
}

export default function SetupUsernamePage() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/user/set-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push("/")
    } else {
      setError(data.message || "Failed to set username.")
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-4">Choose Your Username</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your unique username"
          className="w-full border px-4 py-2 rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Confirm
        </button>
      </form>
    </div>
  )
}
