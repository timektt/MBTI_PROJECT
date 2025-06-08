// components/NotificationBell.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { pusherClient } from "@/lib/pusherClient";
import { useSession } from "next-auth/react";

interface Notification {
  id?: string;
  message: string;
  link: string;
  read?: boolean;
  createdAt?: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const toggleNotificationPanel = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      await Promise.all([fetchNotifications(), markNotificationsAsRead()]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`private-user-${session.user.id}`);
    const handleNewNotification = (data: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === data.id)) return prev;
        return [data, ...prev];
      });
    };

    channel.bind("new-notification", handleNewNotification);

    return () => {
      channel.unbind("new-notification", handleNewNotification);
      channel.unsubscribe();
    };
  }, [session?.user?.id]);

  return (
    <div className="relative">
      <button onClick={toggleNotificationPanel} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50">
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id ?? n.message}
                href={n.link}
                className={`block px-2 py-1 text-sm rounded ${
                  n.read
                    ? "text-gray-500"
                    : "font-semibold text-blue-700 dark:text-blue-300"
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                {n.message.includes("followed") && n.link.includes("profile") ? (
                  <>
                    <span className="text-sm">
                      <span className="text-blue-600">{n.message.split(" followed")[0]}</span>{" "}
                      <span className="italic">followed you</span>
                    </span>
                  </>
                ) : (
                  n.message
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
