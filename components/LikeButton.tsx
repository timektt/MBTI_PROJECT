// components/LikeButton.tsx

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

type LikeStatusResponse = {
  liked: boolean
  total: number
}

export default function LikeButton({ cardId }: { cardId: string }) {
  const { data: session, status } = useSession()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/card/like-status?cardId=${cardId}`)
        const data: LikeStatusResponse = await res.json()
        setLiked(data.liked)
        setLikeCount(data.total)
      } catch (err) {
        console.error("Failed to fetch like status", err)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") fetchLikeStatus()
  }, [cardId, status])

  const toggleLike = async () => {
    if (!session) {
      alert("Please log in to like.")
      router.push("/api/auth/signin")
      return
    }

    try {
      const res = await fetch("/api/card/toggle-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      })
      const data: LikeStatusResponse = await res.json()
      setLiked(data.liked)
      setLikeCount(data.total)
    } catch (err) {
      console.error("Failed to toggle like", err)
    }
  }

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
        liked ? "text-red-600 font-semibold" : "text-gray-500"
      }`}
      disabled={loading}
      aria-label="Like this card"
    >
      {liked ? "❤️" : "🤍"} {likeCount}
    </button>
  )
}
