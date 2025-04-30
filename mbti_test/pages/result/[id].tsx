// pages/result/[id].tsx

import { GetServerSideProps } from "next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FaUser, FaBrain, FaShareAlt, FaRegAddressCard, FaHome } from "react-icons/fa"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string
  const result = await prisma.quizResult.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!result) return { notFound: true }

  return {
    props: {
      result: {
        id: result.id,
        mbtiType: result.mbtiType,
        scoreDetail: result.scoreDetail,
        userName: result.user?.name || "Anonymous",
        createdAt: result.createdAt.toString(),
      },
    },
  }
}

export default function ResultPage({
  result,
}: {
  result: {
    id: string
    mbtiType: string
    scoreDetail: Record<string, string>
    userName: string
    createdAt: string
  }
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center items-start px-4 py-10">
      <div className="bg-white dark:bg-gray-900 max-w-2xl w-full p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-white">
          Your MBTI Result
        </h1>

        <div className="space-y-4 text-gray-700 dark:text-gray-200">
          <p className="flex items-center gap-2 text-lg">
            <FaUser className="text-gray-500" /> Name: <span className="font-semibold">{result.userName}</span>
          </p>

          <p className="flex items-center gap-2 text-xl font-bold text-purple-600 dark:text-purple-400">
            <FaBrain /> Type: {result.mbtiType}
          </p>

          <p className="text-sm text-gray-500">
            Created on: {new Date(result.createdAt).toLocaleString()}
          </p>

          <div className="mt-4">
            <h2 className="font-medium mb-2">Answer Summary:</h2>
            <ul className="list-disc pl-6 text-sm">
              {Object.entries(result.scoreDetail).map(([q, a]) => (
                <li key={q}>
                  <strong>{q}</strong>: {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 w-full">
            <FaRegAddressCard /> Create Card
          </button>

          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 w-full">
            <FaShareAlt /> Share
          </button>

          <Link
            href="/"
            className="text-center text-gray-500 underline flex items-center justify-center gap-2 w-full pt-2 sm:pt-0"
          >
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
