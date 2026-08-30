import ActivityFeed from "@/components/ActivityFeed";
import Head from "next/head";

export default function CommunityActivityPage() {
  return (
    <>
      <Head>
        <title>Community Activity | MBTI.AI</title>
      </Head>
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-white">
          Community Activity
        </h1>
        <ActivityFeed /> {/* ไม่ส่ง userId -> global feed */}
      </main>
    </>
  );
}
