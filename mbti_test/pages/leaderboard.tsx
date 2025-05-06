// pages/leaderboard.tsx
import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

type LeaderboardUser = {
  id: string;
  name: string;
  username: string;
  image: string | null;
  totalLikes: number;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      cards: {
        select: {
          likes: true,
        },
      },
    },
  });

  const leaderboard = users
    .map((u) => ({
      ...u,
      totalLikes: u.cards.reduce((sum, c) => sum + c.likes.length, 0),
    }))
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 20);

  return {
    props: { leaderboard },
  };
};

export default function LeaderboardPage({
  leaderboard,
}: {
  leaderboard: LeaderboardUser[];
}) {
  return (
    <>
      <Head>
        <title>Top MBTI Creators</title>
      </Head>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Top Creators</h1>
        <ul className="space-y-4">
          {leaderboard.map((user, index) => (
            <li
              key={user.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700"
            >
              <span className="text-xl font-bold w-6">{index + 1}</span>
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <Link
                  href={`/u/${user.username}`}
                  className="text-lg font-semibold hover:underline text-blue-600 dark:text-blue-400"
                >
                  {user.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username} — {user.totalLikes} likes
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
