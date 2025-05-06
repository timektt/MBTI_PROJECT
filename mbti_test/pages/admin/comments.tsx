// pages/admin/comments.tsx
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminCommentsPage() {
  return (
    <>
      <Head>
        <title>Manage Comments | MBTI.AI</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Comment Moderation</h1>
          <p>Review, approve, or delete comments from the community.</p>
        </div>
      </AdminLayout>
    </>
  );
}
