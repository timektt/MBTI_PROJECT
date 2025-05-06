// pages/admin/users.tsx
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminUsersPage() {
  return (
    <>
      <Head>
        <title>Manage Users | MBTI.AI</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">User Management</h1>
          <p>View all users, block users, reset passwords, and assign admin roles.</p>
        </div>
      </AdminLayout>
    </>
  );
}
