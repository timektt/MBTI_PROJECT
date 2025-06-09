import { useState, useEffect } from "react";
import Image from "next/image";
import { UserProfileProps } from "@/types/user"; // ✅ ใช้ type จากกลาง

export default function AccountSettings({ user }: { user: UserProfileProps }) {
  const [name, setName] = useState(user.name ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [imagePreview, setImagePreview] = useState(user.image ?? "");

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const isUsernameValid = username.trim().length >= 3;

  useEffect(() => {
    setImagePreview(image);
  }, [image]);

  const handleUpdate = async () => {
    if (!isUsernameValid) {
      setStatus("error");
      setMessage("Username must be at least 3 characters.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, image }),
      });

      const data = await res.json();

      // 🟢 Safe parse message (แก้จุด error)
      let errorMsg = "Failed to update profile.";
      if (typeof data.error === "string") {
        errorMsg = data.error;
      } else if (data.fieldErrors?.username?.length > 0) {
        errorMsg = data.fieldErrors.username[0];
      } else if (data.fieldErrors) {
        const firstField = Object.keys(data.fieldErrors)[0];
        if (firstField && data.fieldErrors[firstField]?.length > 0) {
          errorMsg = data.fieldErrors[firstField][0];
        }
      }

      if (!res.ok) {
        setStatus("error");
        setMessage(errorMsg);
      } else {
        setStatus("saved");
        setMessage("Profile updated successfully.");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Update profile failed:", error);
      setStatus("error");
      setMessage("Unexpected error occurred.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await res.json();
        if (res.ok) {
          setImage(data.url);
          setImagePreview(data.url);
        } else {
          console.error("Upload failed:", data.error);
        }
      } catch (error) {
        console.error("Unexpected upload error:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Info</h2>

      {imagePreview && (
        <Image
          src={imagePreview}
          alt="Profile Preview"
          width={72}
          height={72}
          className="rounded-full mb-4 border"
        />
      )}

      <label className="block text-sm font-medium mb-1">Upload Profile Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Upload profile image"
        className="w-full mb-4"
      />

      <label className="block text-sm font-medium mb-1">Or use an Image URL</label>
      <input
        type="url"
        value={image}
        placeholder="https://your-image-url.jpg"
        onChange={(e) => {
          setImage(e.target.value);
          setImagePreview(e.target.value);
        }}
        aria-label="Profile image URL"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <label className="block text-sm font-medium mb-1">Name</label>
      <input
        type="text"
        value={name}
        placeholder="Your name"
        onChange={(e) => setName(e.target.value)}
        aria-label="Name"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <label className="block text-sm font-medium mb-1">Username</label>
      <input
        type="text"
        value={username}
        placeholder="your-username"
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
        className="w-full mb-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      {!isUsernameValid && (
        <p className="text-red-500 text-sm mb-4">Username must be at least 3 characters</p>
      )}

      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea
        value={bio}
        placeholder="Tell us about yourself"
        onChange={(e) => setBio(e.target.value)}
        rows={3}
        aria-label="Bio"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <button
        onClick={handleUpdate}
        disabled={status === "saving" || !isUsernameValid}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        {status === "saving" ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
