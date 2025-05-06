// pages/admin/settings.tsx
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  return (
    <>
      <Head>
        <title>Admin Settings | MBTI.AI</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Global Admin Settings</h1>
          <p>Configure global options for login methods, quiz availability, and system preferences.</p>
        </div>
      </AdminLayout>
    </>
  );
}
