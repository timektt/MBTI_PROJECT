// components/CardComments.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // ✅ เพิ่มเข้ามา

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  user?: {
    id?: string;
    username?: string;
    name?: string;
    image?: string | null;
  };
};

export default function CardComments({ cardId }: { cardId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/get?cardId=${cardId}`);
      const data: CommentType[] = await res.json();
      setComments(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch {
      setError("Failed to load comments.");
    } finally {
      setFetching(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comment/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, content: newComment }),
      });
      if (!res.ok) throw new Error("Failed to post");
      const data: CommentType = await res.json();
      setComments([data, ...comments]);
      setNewComment("");
    } catch {
      setError("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [cardId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {session ? (
        <>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Write a comment..."
          />
          <button
            onClick={submitComment}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Please sign in to post a comment.
        </p>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {fetching ? (
        <p className="text-gray-500 mt-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 mt-4 italic">No comments yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="border p-3 rounded dark:border-gray-600"
            >
              <div className="flex items-center gap-3 mb-1">
                {c.user?.username || c.user?.id ? (
                  <Link
                    href={`/profile/${c.user.username || c.user.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {c.user?.image && (
                      <img
                        src={c.user.image}
                        alt={c.user.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {c.user?.name || "Anonymous"}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {c.user?.name || "Anonymous"}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-800 dark:text-white">
                {c.content}
              </p>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{new Date(c.createdAt).toLocaleString()}</span>
                <span>
                  {c.likeCount} {c.likeCount === 1 ? "like" : "likes"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
