import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = async () => {
    setStatus("loading");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    const res = await fetch("/api/settings/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage("Password changed successfully.");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Change Password</h1>

      <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
        Current Password
      </label>
      <input
        id="currentPassword"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        placeholder="Enter current password"
        autoComplete="current-password"
      />

      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
        New Password
      </label>
      <input
        id="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        placeholder="Enter new password"
        autoComplete="new-password"
      />

      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
        Confirm New Password
      </label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        placeholder="Confirm new password"
        autoComplete="new-password"
      />

      <button
        onClick={handleChange}
        disabled={status === "loading"}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        {status === "loading" ? "Saving..." : "Change Password"}
      </button>

      {message && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
