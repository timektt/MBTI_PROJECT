// components/CardLikers.tsx
import { useEffect, useState } from "react"
import Link from "next/link"

type UserLite = {
  id: string
  name: string | null
  image: string | null
  username: string | null
}

export default function CardLikers({ cardId }: { cardId: string }) {
  const [likers, setLikers] = useState<UserLite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLikers = async () => {
      try {
        const res = await fetch(`/api/card/likers?cardId=${cardId}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setLikers(data)
      } catch (err) {
        setError("Failed to load likers.")
      } finally {
        setLoading(false)
      }
    }

    fetchLikers()
  }, [cardId])

  if (loading) return <p className="text-xs text-gray-400">Loading likes...</p>
  if (error) return <p className="text-xs text-red-500">{error}</p>
  if (likers.length === 0) return null

  return (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
      <p className="mb-1">❤️ Liked by:</p>
      <div className="flex items-center gap-3 flex-wrap">
        {likers.map((user) => (
          <Link
            key={user.id}
            href={`/u/${user.username || user.id}`}
            className="flex items-center gap-2 hover:underline"
          >
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-6 h-6 rounded-full object-cover border"
              />
            )}
            <span>{user.name || "Anonymous"}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
