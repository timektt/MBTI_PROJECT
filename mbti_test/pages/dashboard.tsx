import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const results = await prisma.quizResult.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      card: true, // ✅ เชื่อมกับ Card
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      results: results.map((r) => ({
        id: r.id,
        mbtiType: r.mbtiType,
        createdAt: r.createdAt.toISOString(),
        cardId: r.card?.id ?? null, // ✅ เพิ่ม cardId
      })),
    },
  };
}

export default function DashboardPage({
  results,
}: {
  results: {
    id: string;
    mbtiType: string;
    createdAt: string;
    cardId?: string | null;
  }[];
}) {
  return (
    <>
      <Head>
        <title>Your Dashboard | MBTI</title>
        <meta
          name="description"
          content="View your MBTI quiz history and manage your personality cards."
        />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-white">
          Your MBTI Results
        </h1>

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
                      <>
                        <Link
                          href={`/card/${r.cardId}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View Card
                        </Link>
                    
                        <button
                          onClick={async () => {
                            const confirmed = confirm("Are you sure you want to delete this card?");
                            if (confirmed) {
                              const res = await fetch("/api/card/delete", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ cardId: r.cardId }),
                              });
                    
                              if (res.ok) {
                                window.location.reload();
                              } else {
                                alert("Failed to delete card.");
                              }
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <Link
                        href={`/card/create`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Create Card
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
