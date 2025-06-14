// pages/setup-profile.tsx

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SetupProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ถ้าไม่มี session → redirect ไป login
  useEffect(() => {
    if (status === "loading") return; // ✅ wait session ready

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !image) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1 → Upload Image
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload image.");
      }

      const imageUrl = uploadData.url; // ✅ URL ของรูปที่ upload สำเร็จ

      // Step 2 → Save username + image ลง user
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, image: imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Profile updated! Refreshing...");

        // ✅ Force refresh session → ให้ Navbar update image ทันที
        if (session?.user?.email) {
          await signIn("credentials", {
            redirect: false,
            email: session.user.email,
          });
        } else {
          console.error("Session has no email → cannot refresh session.");
        }

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        throw new Error(data.error || "Failed to update profile.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error(err);
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false); // ✅ ต้องใส่ finally → เพื่อให้ loading reset เสมอ
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-1">Setup Your Profile</h1>
        <p className="text-gray-300 mb-5">Please complete your profile to continue</p>

        {success && (
          <p className="mb-3 text-green-400 text-sm font-semibold">{success}</p>
        )}

        {error && (
          <p className="mb-3 text-red-400 text-sm font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
            required
          />

          <label className="block text-left text-sm font-medium text-gray-300 mb-1">
            Profile Image
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                }
                }}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-600 text-white focus:outline-none"
                required
            />
            </label>


          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 hover:bg-purple-700 transition rounded-full py-2 font-bold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
