// pages/forgot-password.tsx

import { useState } from "react";
import { useRouter } from "next/router";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ If this email is registered, a reset link has been sent!");

        // ✅ UX ดี → redirect ไป /login หลัง 3 วิ
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setMessage(err.message);
      } else {
        console.error(err);
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
        <p className="text-gray-300 mb-5">Enter your email to reset your password</p>

        {message && (
          <p
            className={`mb-3 text-sm font-semibold ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 hover:bg-purple-700 transition rounded-full py-2 font-bold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
