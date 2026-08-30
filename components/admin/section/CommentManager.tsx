import { useEffect, useState } from "react";
import Link from "next/link";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string | null;
  };
  card: {
    id: string;
    title: string;
  };
};

export default function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/comments/list")
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load comments");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const res = await fetch(`/api/admin/comments/delete?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete comment.");
    }
  };

  if (loading)
    return <p className="text-sm text-gray-400">Loading comments...</p>;
  if (error)
    return <p className="text-sm text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-200 mb-1">{comment.content}</p>
              <p className="text-xs text-gray-400">
                by {" "}
                {comment.user.username ? (
                  <Link
                    href={`/profile/${comment.user.username}`}
                    className="font-medium text-blue-400 hover:underline"
                  >
                    @{comment.user.username}
                  </Link>
                ) : (
                  <span className="font-medium text-white">Unknown</span>
                )} {" "}
                on card {" "}
                <span className="italic text-blue-400">
                  <span>{`"${comment.card.title}"`}</span>
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-red-500 text-sm hover:underline ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
