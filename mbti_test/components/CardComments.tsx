// components/CardComments.tsx
import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export type CommentType = {
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

interface CardCommentsProps {
  cardId: string;
}

const CardComments: FC<CardCommentsProps> = ({ cardId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchComments() {
      try {
        const res = await fetch(`/api/comment/get?cardId=${cardId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CommentType[] = await res.json();
        data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        if (active) setComments(data);
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setError(`Failed to load comments: ${msg}`);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchComments();
    return () => {
      active = false;
    };
  }, [cardId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/comment/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, content: newComment }),
      });
      if (!res.ok) throw new Error(res.statusText || "Failed to post");
      const created: CommentType = await res.json();
      setComments(prev => [created, ...prev]);
      setNewComment("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to submit comment: ${msg}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <section aria-label="Comments" className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {session ? (
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleSubmit}
            disabled={isPosting || !newComment.trim()}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Please sign in to post a comment.</p>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {isLoading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 italic">No comments yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {comments.map(c => {
            const displayName = c.user?.name || "Anonymous";
            const profilePath = c.user?.username || c.user?.id;
            const avatar = c.user?.image ?? "/default-avatar.png";

            const content = (
              <div className="flex items-center gap-2">
                <Image
                  src={avatar}
                  alt={displayName}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {displayName}
                </span>
              </div>
            );

            return (
              <li key={c.id} className="border p-3 rounded dark:border-gray-600">
                {profilePath ? (
                  <Link href={`/profile/${profilePath}`}> 
                    <a className="hover:underline">{content}</a>
                  </Link>
                ) : (
                  content
                )}
                <p className="text-sm text-gray-800 dark:text-white mt-2">{c.content}</p>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                  <span>
                    {c.likeCount} {c.likeCount === 1 ? "like" : "likes"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default CardComments;
