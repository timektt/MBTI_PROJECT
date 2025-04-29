// pages/result/[id].tsx

import { GetServerSideProps } from "next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"


export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string
  const result = await prisma.quizResult.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!result) return { notFound: true }

  return {
    props: {
      result: {
        id: result.id,
        mbtiType: result.mbtiType,
        scoreDetail: result.scoreDetail,
        userName: result.user.name || "Anonymous",
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
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Your MBTI Result</h1>
      <div className="bg-gray-100 p-6 rounded shadow">
        <p className="text-xl font-semibold">👤 Name: {result.userName}</p>
        <p className="text-2xl font-bold text-blue-700 my-4">🧠 Type: {result.mbtiType}</p>
        <p className="text-sm text-gray-600">Created: {new Date(result.createdAt).toLocaleString()}</p>
        <div className="mt-4">
          <h2 className="font-medium mb-2">Answer Summary:</h2>
          <ul className="list-disc pl-6 text-sm">
            {Object.entries(result.scoreDetail).map(([q, a]) => (
              <li key={q}>{q}: {a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">🎴 Create Card</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">🔗 Share</button>
        <Link href="/" className="ml-auto underline text-gray-600">
  Back to Home
</Link>
      </div>
    </div>
  )
}
