// pages/u/[username].tsx

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { prisma } from "@/lib/prisma";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// 🔧 เพิ่ม type ให้ props
type PublicProfileProps = {
  profile: {
    name: string;
    username: string;
    image: string | null;
    mbtiType: string;
    bio: string;
    createdAt: string;
    latestCardId: string | null;
  };
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const username = context.params?.username as string;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username.toLowerCase() },
        { id: username },
      ],
    },
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
      profile: {
        name: user.name ?? "Anonymous",
        username: user.username ?? user.id,
        image: user.image ?? null,
        mbtiType: user.quizResults?.[0]?.mbtiType ?? "Not available",
        bio: user.bio ?? "",
        createdAt: user.createdAt.toISOString(),
        latestCardId: user.quizResults?.[0]?.id ?? null,
      },
    },
  };
};

export default function PublicProfile({ profile }: PublicProfileProps) {
  return (
    <>
      <Head>
        <title>{profile.name}{"'s MBTI Profile"}</title>
        <meta name="description" content={`MBTI Type: ${profile.mbtiType}`} />
        <meta property="og:title" content={`${profile.name}'s MBTI`} />
        <meta
          property="og:description"
          content={profile.bio || "MBTI result from our platform"}
        />
        {profile.image && <meta property="og:image" content={profile.image} />}
      </Head>

      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl">
          {profile.image && (
            <Image
              src={profile.image}
              alt={profile.name}
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 border"
            />
          )}

          <h1 className="text-2xl font-bold text-blue-700 dark:text-white">
            {profile.name}
          </h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
            {profile.bio}
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">MBTI Type:</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {profile.mbtiType}
            </p>
          </div>

          {profile.latestCardId && (
            <Link
              href={`/card/${profile.latestCardId}`}
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              View Card
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
