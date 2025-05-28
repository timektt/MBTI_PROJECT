import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type UserLite = {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
};

interface CardLikersProps {
  cardId: string;
}

const CardLikers: FC<CardLikersProps> = ({ cardId }) => {
  const [likers, setLikers] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLikers = async () => {
      try {
        const res = await fetch(`/api/card/likers?cardId=${cardId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: UserLite[] = await res.json();
        if (isMounted) setLikers(data);
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(`Failed to load likers: ${message}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLikers();

    return () => {
      isMounted = false;
    };
  }, [cardId]);

  if (loading) {
    return <p className="text-xs text-gray-400 dark:text-gray-500">Loading likes...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
  }

  if (likers.length === 0) {
    return null;
  }

  return (
    <section aria-label="Card Likers" className="mt-4 text-sm text-gray-600 dark:text-gray-300">
      <p className="mb-1 font-semibold">❤️ Liked by:</p>
      <ul className="flex flex-wrap items-center gap-2">
        {likers.map((user) => {
          const displayName = user.name ?? user.username ?? "Anonymous";
          const profileUrl = user.username ? `/profile/${user.username}` : undefined;
          const content = (
            <div className="flex items-center gap-2">
              {user.image && (
                <Image
                  src={user.image}
                  alt={displayName}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover border"
                />
              )}
              <span>{displayName}</span>
            </div>
          );
          return (
            <li key={user.id}>
              {profileUrl ? (
                <Link href={profileUrl}>
                  <a className="hover:underline">{content}</a>
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CardLikers;
