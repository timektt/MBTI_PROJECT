import { useState, useEffect } from "react";
import Image from "next/image";
import { UserProfileProps } from "@/types/user";
import { signIn } from "next-auth/react";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";

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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setStatus("error");
      setMessage("Only JPG, PNG, or WebP images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setStatus("error");
      setMessage("File size must be less than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setStatus("saving");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setImage(data.url);
        setStatus("saved");
        setMessage("Profile image updated successfully.");

        await signIn("credentials", {
          redirect: false,
          email: user.email,
        });

        setTimeout(() => setStatus("idle"), 1500);
      } else {
        setStatus("error");
        setMessage(data?.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("error");
      setMessage("Unexpected upload error.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Update your profile information and preferences
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Image Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Profile Photo
          </label>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload profile image"
                />
                <div className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload new photo
                </div>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG or WebP. Max size 5MB.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Or use image URL
            </label>
            <input
              type="url"
              value={image}
              placeholder="https://your-image-url.jpg"
              onChange={(e) => {
                setImage(e.target.value);
                setImagePreview(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input
              type="text"
              value={username}
              placeholder="your-username"
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                !isUsernameValid && username.length > 0
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
            />
            {!isUsernameValid && username.length > 0 && (
              <p className="flex items-center text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Username must be at least 3 characters
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Bio
          </label>
          <textarea
            value={bio}
            placeholder="Tell us about yourself..."
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {bio.length}/500 characters
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`flex items-center p-4 rounded-lg ${
            status === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              : status === "saved"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
          }`}>
            {status === "error" && <AlertCircle className="w-5 h-5 mr-2" />}
            {status === "saved" && <Check className="w-5 h-5 mr-2" />}
            {status === "saving" && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleUpdate}
            disabled={status === "saving" || !isUsernameValid}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-500 dark:disabled:text-gray-400 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {status === "saving" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === "saved" && <Check className="w-4 h-4 mr-2" />}
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
