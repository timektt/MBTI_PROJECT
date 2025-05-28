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
      // ไม่จำเป็นต้องส่ง user ถ้าไม่ได้ใช้ใน component
    },
  };
}

// ไม่ต้องรับ prop user ถ้าไม่ได้ใช้
export default function AdminDashboard() {
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