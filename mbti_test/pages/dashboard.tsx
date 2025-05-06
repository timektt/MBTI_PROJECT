import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import ActivityFeed from "@/components/ActivityFeed"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || !session.user?.email || !session.user?.id) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  const results = await prisma.quizResult.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      card: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return {
    props: {
      userId: session.user.id, // ✅ เพิ่มตรงนี้
      results: results.map((r) => ({
        id: r.id,
        mbtiType: r.mbtiType,
        createdAt: r.createdAt.toISOString(),
        cardId: r.card?.id ?? null,
      })),
    },
  }
}

export default function DashboardPage({
  userId,
  results,
}: {
  userId: string
  results: {
    id: string
    mbtiType: string
    createdAt: string
    cardId?: string | null
  }[]
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

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-white">
          Your MBTI Results
        </h1>

        {/* ✅ ส่ง userId เข้าไปใน ActivityFeed */}
        <div className="mb-8">
          <ActivityFeed userId={userId} />
        </div>

        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
          🎴 Your MBTI identity has been permanently assigned and cannot be changed.
        </div>

        {results.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            {"You haven't taken any quizzes yet."}
          </p>
        ) : (
          <ul className="space-y-6">
            {results.map((r) => (
              <li
                key={r.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                      {r.mbtiType}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Taken on {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/result/${r.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      View Result
                    </Link>

                    {r.cardId ? (
                      <Link
                        href={`/card/${r.cardId}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        View Card
                      </Link>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        Card not found.
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
