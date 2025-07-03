import { useEffect, useState } from "react";
import { useSession , signIn} from "next-auth/react";
import { useRouter } from "next/router";


export default function SetupProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Control only first load — don't run after profile setup complete
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    if (!success) {  // ✅ ถ้าเพิ่ง setup เสร็จ → ยังไม่ต้อง redirect
      if (session.user?.hasProfile && session.user?.hasMbtiCard) {
        router.replace("/dashboard");
      } else if (session.user?.hasProfile) {
        router.replace("/quiz");
      }
    }
  }, [session, status, router, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !image) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Upload image
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      

      const uploadData = await uploadRes.json();
      console.log("Upload result:", uploadData);

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(
          typeof uploadData.error === "string"
            ? uploadData.error
            : "Failed to upload image."
        );
      }

      const imageUrl = uploadData.url;
      console.log("Image URL to update:", imageUrl);

      // ✅ Update profile
        const res = await fetch("/api/profile/updateBio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio: "",
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          data.fieldErrors?.username?.[0] ||
          data.fieldErrors?.bio?.[0] ||
          data.fieldErrors?.image?.[0] ||
          "Failed to update profile."
        );
      }


      setSuccess("✅ Profile updated successfully!");

     if (!session || !session.user?.email) {
        setError("Session expired or invalid. Please login again.");
        router.replace("/login");
        return;
      }

      await signIn("credentials", { redirect: false, email: session.user.email });


      // ✅ Redirect to quiz after delay — ให้ user เห็น success ก่อน
      setTimeout(() => {
        router.replace("/quiz");
      }, 800);

    } catch (err: unknown) {
      console.error("Setup profile error:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-1">Setup Your Profile</h1>
        <p className="text-gray-300 mb-5">Please complete your profile to continue</p>

        {previewUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-400"
            />
          </div>
        )}

        {success && <p className="mb-3 text-green-400 text-sm font-semibold">{success}</p>}
        {error && <p className="mb-3 text-red-400 text-sm font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block">
            <span className="text-sm text-gray-300">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">Profile Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-600 text-white focus:outline-none"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading || !!success}
            className={`w-full bg-purple-600 hover:bg-purple-700 transition rounded-full py-2 font-bold ${
              loading || success ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : success ? "Completed" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
