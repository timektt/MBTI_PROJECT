import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async () => {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
    });
  };

  const handleClick = async () => {
    setOpen(!open);
    if (!open) {
      await fetchNotifications();
      await markAsRead();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={handleClick} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link}
                className={`block px-2 py-1 text-sm rounded ${
                  n.read
                    ? "text-gray-500"
                    : "font-semibold text-blue-700 dark:text-blue-300"
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                {n.message}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
