// pages/admin/cards.tsx
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import CardManager from "@/components/admin/section/CardManager";
export default function AdminCardsPage() {
  return (
    <>
      <Head>
        <title>Manage Cards | MBTI.AI</title>
      </Head>s
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Card Management</h1>
          <p>Display and delete cards from users, filter by MBTI types.</p>
        </div>
        <CardManager />
      </AdminLayout>
    </>
  );
}