// pages/card/[id].tsx

import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import Head from "next/head";
import Link from "next/link";
import { FaUser, FaBrain, FaCheckCircle, FaDownload, FaCopy } from "react-icons/fa";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import CardComments from "@/components/CardComments";
import CardLikers from "@/components/CardLikers";

type CardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  mbtiType: string;
  createdAt: string;
  user: {
    name: string;
    username: string;
    image?: string | null;
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      user: true,
      quizResult: true,
    },
  });

  if (!card) return { notFound: true };

  return {
    props: {
      card: {
        id: card.id,
        title: card.title,
        description: card.description,
        imageUrl: card.imageUrl,
        mbtiType: card.quizResult?.mbtiType || "",
        user: {
          name: card.user.name || "Anonymous",
          username: card.user.username || card.user.id,
          image: card.user.image,
        },
        createdAt: card.createdAt.toString(),
      },
    },
  };
};

export default function CardPage({ card }: { card: CardProps }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement("a");
      link.download = `mbti-${card.mbtiType}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <>
      <Head>
        <title>{card.title} | MBTI Card</title>
        <meta name="description" content={card.description} />
        <meta property="og:title" content={card.title} />
        <meta property="og:description" content={card.description} />
        <meta property="og:image" content={card.imageUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-black flex justify-center items-center px-4 py-10">
        <div
          ref={cardRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 text-center border border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-2xl font-bold text-blue-600 dark:text-white mb-3">
            MBTI Personality Card
          </h1>

          <div className="flex flex-col items-center gap-4 my-6">
            <FaUser className="text-gray-500 text-3xl" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {card.user.name}
            </p>

            <FaBrain className="text-purple-600 text-4xl" />
            <p className="text-4xl font-bold text-purple-700 dark:text-purple-400 tracking-wider">
              {card.mbtiType}
            </p>

            {/* ✅ แสดงรายชื่อผู้ที่ Like การ์ดนี้ */}
            <CardLikers cardId={card.id} />

            {/* ✅ คอมเมนต์ใต้การ์ด */}
            <CardComments cardId={card.id} />
          </div>

          <p className="text-gray-600 dark:text-gray-300 italic mb-2">{card.description}</p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Created on {new Date(card.createdAt).toLocaleDateString()} by{" "}
            <Link href={`/u/${card.user.username ?? card.user.name ?? "user"}`} className="underline">
              {card.user.name}
            </Link>
          </p>
        </div>

        <div className="absolute bottom-10 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            {copied ? <FaCheckCircle className="text-green-300" /> : <FaCopy />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>
        </div>
      </div>
    </>
  );
}
