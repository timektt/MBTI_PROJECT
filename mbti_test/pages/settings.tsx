import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import Head from "next/head"
import AccountSettings from "@/components/setttings/AccountSettings"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      createdAt: true,
    },
  })

  if (!user) return { notFound: true }

  return {
    props: {
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email,
        image: user.image || null,
        username: user.username || "",
        bio: user.bio || "",
        joinedAt: user.createdAt.toISOString(),
      },
    },
  }
}

type SettingsPageProps = {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    username: string
    bio: string
    joinedAt: string
  }
}

export default function SettingsPage({ user }: SettingsPageProps) {
  return (
    <>
      <Head>
        <title>Account Settings | MBTI</title>
      </Head>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-white">
          Account Settings
        </h1>
        <AccountSettings user={user} />
      </div>
    </>
  )
}
