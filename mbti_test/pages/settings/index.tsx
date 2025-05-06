import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import AccountSettings from "@/components/settings/AccountSettings";

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

  return {
    props: {
      user: {
        name: session.user.name || "",
        email: session.user.email,
        image: session.user.image || null,
      },
    },
  };
}

export default function SettingsPage({ user }: { user: any }) {
  return (
    <>
      <Head>
        <title>Settings | MBTI.AI</title>
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-white">Account Settings</h1>
        <AccountSettings user={user} />
      </div>
    </>
  );
}
