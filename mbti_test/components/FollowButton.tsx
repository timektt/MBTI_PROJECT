import { useState } from "react";

export default function FollowButton({ userId, isFollowing }: { userId: string; isFollowing: boolean }) {
  const [following, setFollowing] = useState(isFollowing);

  const toggleFollow = async () => {
    const res = await fetch("/api/follow/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followingId: userId }),
    });

    const data = await res.json();
    setFollowing(data.followed);
  };

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-2 rounded ${
        following
          ? "bg-gray-300 text-black"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
