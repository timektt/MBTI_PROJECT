// pages/admin/index.tsx

import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

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
    props: {
      user: session.user,
    },
  };
}

type AdminPageProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function AdminDashboard({ user }: AdminPageProps) {
  return (
    <>
      <Head>
        <title>Admin Panel | MBTI.AI</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Use the sidebar to manage Cards, Comments, Users, and Site Settings.
          </p>
        </div>
      </AdminLayout>
    </>
  );
}