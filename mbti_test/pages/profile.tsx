// pages/profile.tsx

import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session) return <p>Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <p>Email: {session.user?.email}</p>
      <p>ID: {session.user?.id}</p>
    </div>
  )
}
