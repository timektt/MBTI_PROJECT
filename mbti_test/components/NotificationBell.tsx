import { useEffect, useState } from "react"
import Link from "next/link"

type Notification = {
  id: string
  message: string
  link: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <span className="cursor-pointer">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 text-xs bg-red-600 text-white px-1 rounded-full">
          {unreadCount}
        </span>
      )}
      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications</p>
        ) : (
          notifications.map((n) => (
            <Link
              href={n.link}
              key={n.id}
              className={`block px-2 py-1 text-sm ${
                n.read ? "text-gray-500" : "font-semibold text-blue-700"
              }`}
            >
              {n.message}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
