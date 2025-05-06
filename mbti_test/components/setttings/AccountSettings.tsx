import { useState } from "react"
import Image from "next/image"

export default function AccountSettings({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "")
  const [username, setUsername] = useState(user.username || "")
  const [bio, setBio] = useState(user.bio || "")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleUpdate = async () => {
    setStatus("saving")
    setMessage("")

    const res = await fetch("/api/settings/updateProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio }),
    })

    const data = await res.json()
    if (!res.ok) {
      setStatus("error")
      setMessage(data.error || "Failed to update profile.")
    } else {
      setStatus("saved")
      setMessage("Profile updated successfully.")
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Info</h2>

      {user.image && (
        <Image
          src={user.image}
          alt={user.name}
          width={64}
          height={64}
          className="rounded-full mb-4 border"
        />
      )}

      <label className="block text-sm font-medium mb-1">Name</label>
      <input
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block text-sm font-medium mb-1">Username</label>
      <input
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={3}
      />

      <button
        onClick={handleUpdate}
        disabled={status === "saving"}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        {status === "saving" ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>{message}</p>
      )}
    </div>
  )
}
