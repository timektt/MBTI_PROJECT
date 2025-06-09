// pages/admin/index.tsx

import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

// Server-side guard → allow only admin access
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // No need to send user; session can be accessed client-side if needed
  };
}

// Admin Dashboard Page
export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Admin Panel | MBTI.AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout>
        <section className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">Welcome, Admin</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Use the sidebar to manage Cards, Comments, Users, and Site Settings.
          </p>

          {/* Future improvement: Add site metrics / summary cards here */}
          {/* Example: <AdminMetrics /> */}
        </section>
      </AdminLayout>
    </>
  );
}
