import Head from "next/head"
import Link from "next/link"
// import ActivityFeed from "@/components/ActivityFeed" // ใส่ถ้าต้องการแสดง feed ทุกคน

export default function Home() {
  return (
    <>
      <Head>
        <title>MBTI.AI | Discover Yourself</title>
        <meta name="description" content="Take an AI-powered MBTI quiz and get your permanent personality card." />
      </Head>

      <section className="text-center mt-10 px-6">
        <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-white">
          Discover Your MBTI
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Analyze yourself with a smart personality quiz powered by AI logic.
        </p>
        <Link href="/quiz" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg">
          Start Quiz
        </Link>

        {/* 
        // Uncomment ถ้าอยากใส่ feed ทุกคน (optional)
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Live Community Activity</h2>
          <ActivityFeed global />
        </div>
        */}
      </section>
    </>
  )
}
