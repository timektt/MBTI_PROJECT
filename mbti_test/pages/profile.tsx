import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      quizResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) return { notFound: true };

  return {
    props: {
      user: {
        name: user.name || "Anonymous",
        email: user.email,
        image: user.image || null,
        username: user.username || "",
        bio: user.bio || "",
        mbtiType: user.quizResults[0]?.mbtiType || "Not taken yet",
        joinedAt: user.createdAt.toString(),
        id: user.id, // ✅ ส่ง id ไปให้ ActivityFeed ใช้
      },
    },
  };
}

export default function ProfilePage({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    username: string;
    bio: string;
    mbtiType: string;
    joinedAt: string;
  };
}) {
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const saveProfile = async () => {
    setStatus("saving");
    setMessage("");

    const res = await fetch("/api/profile/updateBio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, username }),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(result.error || "Failed to update.");
    } else {
      setStatus("saved");
      setMessage("Profile updated!");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-white">Your Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full border"
          />
        )}

        <div className="flex-1 space-y-2 w-full">
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            MBTI: <span className="font-semibold">{user.mbtiType}</span>
          </p>
          <p className="text-sm text-gray-500">
            Joined: {new Date(user.joinedAt).toLocaleDateString()}
          </p>

          <div className="mt-4">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username (for public profile):
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white mb-4"
              placeholder="your-unique-name"
            />

            <label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Bio:
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
              rows={3}
            />

            <button
              onClick={saveProfile}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              disabled={status === "saving"}
            >
              {status === "saving"
                ? "Saving..."
                : status === "saved"
                ? "Saved ✓"
                : "Save Changes"}
            </button>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  status === "error" ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Section: Activity Feed */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-white">
          Recent Activity
        </h2>
        <ActivityFeed userId={user.id} />
      </div>
    </div>
  );
}
