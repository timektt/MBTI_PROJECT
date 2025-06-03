// pages/profile/[username]/cards.tsx

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type CardSummary = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  mbtiType: string;
  createdAt: string;
};

type CardsPageProps = {
  username: string;
  cards: CardSummary[];
};

export const getServerSideProps: GetServerSideProps<CardsPageProps> = async (context) => {
  const username = context.params?.username as string;
  if (!username) {
    return { notFound: true };
  }

  // หา user พร้อมการ์ดเรียงตามวันที่ล่าสุด
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      cards: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          createdAt: true,
          quizResult: { select: { mbtiType: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return { notFound: true };
  }

  const cards: CardSummary[] = user.cards.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    imageUrl: c.imageUrl,
    mbtiType: c.quizResult?.mbtiType || "",
    createdAt: c.createdAt.toISOString(),
  }));

  return {
    props: {
      username,
      cards,
    },
  };
};

const CardsPage: NextPage<CardsPageProps> = ({ username, cards }) => {
  return (
    <>
      <Head>
        <title>{username}&apos;s Cards | MBTI</title>
        <meta
          name="description"
          content={`ดูการ์ดทั้งหมดของ ${username} – MBTI Personality Cards`}
        />
      </Head>

      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {username}&apos;s MBTI Cards
        </h1>

        {cards.length === 0 ? (
          <p className="text-center text-gray-500">
            ยังไม่มีการ์ดที่แชร์โดย {username}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/card/${card.id}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Type: <span className="font-medium">{card.mbtiType}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {card.description.length > 100
                      ? `${card.description.slice(0, 100)}…`
                      : card.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    สร้างเมื่อ{" "}
                    {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CardsPage;
