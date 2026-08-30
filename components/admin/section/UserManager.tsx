import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  username: string | null;
  role: string;
  createdAt: string;
};

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users/list")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch(`/api/admin/users/update-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } else {
      alert("Failed to update role.");
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700"
        >
          <div className="flex justify-between items-center">
            <div>
              {user.username ? (
                <Link
                  href={`/profile/${user.username}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  @{user.username}
                </Link>
              ) : (
                <p className="font-semibold">No username</p>
              )}
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-yellow-400">Role: {user.role}</p>
            </div>
            <button
              onClick={() => handleToggleRole(user.id, user.role)}
              className="text-blue-500 hover:underline text-sm"
            >
              {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
