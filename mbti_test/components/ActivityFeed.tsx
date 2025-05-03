import { useEffect, useState } from "react"
import Link from "next/link"

type Activity = {
  id: string
  type: string
  message: string
  createdAt: string
  cardId?: string | null
}

export default function ActivityFeed({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetch(`/api/activity/user?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Failed to fetch activity feed", err))
  }, [userId])

  if (activities.length === 0) {
    return <p className="text-gray-500 text-sm">No recent activity.</p>
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm text-gray-700 dark:text-gray-200">
            {activity.message}
            {activity.cardId && (
              <>
                {" "}
                –{" "}
                <Link
                  href={`/card/${activity.cardId}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(activity.createdAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  )
}
