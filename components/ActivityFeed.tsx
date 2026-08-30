import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// ✅ รองรับ Activity ประเภทต่าง ๆ
export type Activity = {
  id: string
  type: "LIKE_CARD" | "COMMENT_CARD" | "FOLLOW_USER" | string
  message?: string
  createdAt: string
  cardId?: string | null
  targetType?: string | null
  user: {
    name: string
    image?: string
    id?: string // ✅ ใช้ลิงก์ไปหน้าโปรไฟล์
  }
}

export default function ActivityFeed({ userId }: { userId?: string }) {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const url = userId
      ? `/api/activity/user?userId=${userId}`
      : `/api/activity/feed`
    fetch(url)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Failed to load activities", err))
  }, [userId])

  if (!activities.length) {
    return <p className="text-gray-500 text-sm">No activity yet.</p>
  }

  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded shadow-sm flex items-start gap-3"
        >
          {/* ✅ โปรไฟล์ผู้ใช้ */}
          <div className="flex-shrink-0">
            {activity.user?.image ? (
              <Image
                src={activity.user.image}
                alt={activity.user.name ?? "User"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="Default Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
          </div>

          {/* ✅ ข้อความ activity */}
          <div className="flex-1">
            <div className="text-sm text-gray-800 dark:text-gray-200">
              {renderActivityMessage(activity)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function renderActivityMessage(activity: Activity) {
  const name = activity.user?.name ?? "Someone"
  const message = activity.message ?? ""

  const userLink = activity.user?.id ? (
    <Link
      href={`/profile/${activity.user.id}`}
      className="font-semibold text-blue-600 hover:underline"
    >
      {name}
    </Link>
  ) : (
    <strong>{name}</strong>
  )

  switch (activity.type) {
    case "LIKE_CARD":
      return (
        <>
          {userLink} liked {renderCardLink(activity)}
        </>
      )
    case "COMMENT_CARD":
      return (
        <>
          {userLink} commented: {renderCommentMessage(activity)}{" "}
          {renderCardLink(activity)}
        </>
      )
    case "FOLLOW_USER":
      return <>{userLink} followed someone.</>
    default:
      return message
  }
}

function renderCardLink(activity: Activity) {
  if (!activity.cardId) return <>a card</>
  return (
    <Link
      href={`/card/${activity.cardId}`}
      className="text-blue-600 hover:underline"
    >
      this card
    </Link>
  )
}

function renderCommentMessage(activity: Activity) {
  if (!activity.message) return <>a comment</>

  const cleaned = extractQuotedText(activity.message) ?? activity.message

  return (
    <em className="text-gray-600 dark:text-gray-400">
      &ldquo;{cleaned}&rdquo;
    </em>
  )
}

function extractQuotedText(text: string): string | undefined {
  const match = text.match(/"([^"]*)"/)
  return match?.[1]
}
