import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import ActivityFeed from "@/components/ActivityFeed";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.email || !session.user?.id) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  if (!session.user.hasProfile) {
    return { redirect: { destination: "/setup-profile", permanent: false } };
  }

  if (!session.user.hasMbtiCard) {
    return { redirect: { destination: "/quiz", permanent: false } };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      _count: {
        select: { followers: true, following: true },
      },
    },
  });

  if (!user?.username || !user?.image) {
    return { redirect: { destination: "/setup-profile", permanent: false } };
  }

 const cards = await prisma.card.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: "desc" },
  take: 1,
  select: {
    id: true,
    title: true,
    imageUrl: true,
    createdAt: true,
    user: {
      select: {
        username: true,
        image: true,
      },
    },
    quizResult: {
      select: {
        mbtiType: true,
      },
    },
  },
});


  return {
    props: {
      userInfo: {
        id: user.id,
        name: user.name ?? "Anonymous",
        username: user.username,
        image: user.image ?? null,
        followers: user._count.followers,
        following: user._count.following,
      },
      cards,
    },
  };
}

export default function DashboardPage({
  userInfo,
  cards,
}: {
  userInfo: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    followers: number;
    following: number;
  };
cards: {
    id: string;
    title: string;
    imageUrl?: string;
    createdAt: string;
    user: {
      username: string;
      image: string | null;
    };
    quizResult?: {
      mbtiType: string;
    };
}[];

}) {
  return (
    <>
      <Head>
        <title>Your Dashboard | MBTI</title>
        <meta
          name="description"
          content="View your MBTI quiz history and your permanent personality card."
        />
      </Head>

      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info Section */}
          <section className="flex items-center space-x-4">
            <Image
              src={userInfo.image || "/default-avatar.png"}
              alt="avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {userInfo.name}
              </h2>
              <p className="text-gray-500">@{userInfo.username}</p>
              <div className="flex space-x-4 text-sm text-blue-600 mt-1">
                <Link href={`/profile/${userInfo.username}/followers`} className="hover:underline">
                  {userInfo.followers} Followers
                </Link>
                <Link href={`/profile/${userInfo.username}/following`} className="hover:underline">
                  {userInfo.following} Following
                </Link>
              </div>
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <ActivityFeed userId={userInfo.id} />
          </section>

          {/* Notice */}
          <section className="p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
            Your MBTI identity has been permanently assigned and cannot be changed.
          </section>

          {/* Card Section */}
          <section>
            {cards.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">
                {"You haven't created your card yet."}
              </p>
            ) : (
              <ul className="space-y-6">
                {cards.map((card) => (
                  <li
                    key={card.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                          {card.quizResult?.mbtiType?? "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created on {new Date(card.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/card/${card.id}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View Card
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DashboardLayout>
    </>
  );
}
