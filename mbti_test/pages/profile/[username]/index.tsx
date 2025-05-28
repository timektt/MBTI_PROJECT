import Link from "next/link"
import FollowButton from "@/components/FollowButton"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Image from "next/image"

type Card = {
  id: string
  title: string
  imageUrl: string
  createdAt: string
}

type UserProfile = {
  id: string
  name: string | null
  image: string | null
  username: string | null
  bio: string | null
  _count: {
    followers: number
    following: number
  }
  cards: Card[]
}

type ProfilePageProps = {
  userProfile: UserProfile
  profileUserId: string
  currentUserId: string | null
  isFollowing: boolean
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ProfilePageProps>> => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const username = context.params?.username as string
  const currentUserId = session?.user?.id ?? null

  if (!username) return { notFound: true }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
      bio: true,
      _count: {
        select: { followers: true, following: true },
      },
      cards: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) return { notFound: true }

  const profileUserId = user.id

  const isFollowing =
    currentUserId && currentUserId !== profileUserId
      ? !!(await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: profileUserId,
            },
          },
        }))
      : false

  return {
    props: {
      userProfile: {
        ...user,
        cards: user.cards.map((card) => ({
          ...card,
          createdAt: card.createdAt.toISOString(),
        })),
      },
      profileUserId,
      currentUserId,
      isFollowing,
    },
  }
}

export default function ProfilePage({
  userProfile,
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfilePageProps) {
  const username = userProfile.username ?? "unknown"

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* ✅ Basic Profile Info */}
      <div className="flex items-center space-x-4">
        <Image
          src={userProfile.image || "/default-avatar.png"}
          alt="avatar"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{userProfile.name ?? "Anonymous"}</h1>
          <p className="text-gray-500">@{username}</p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {userProfile.bio ?? "No bio provided."}
          </p>
        </div>
      </div>

      {/* ✅ Follow Button */}
      {currentUserId && currentUserId !== profileUserId && (
        <div>
          <FollowButton userId={profileUserId} isFollowing={isFollowing} />
        </div>
      )}

      {/* ✅ Follower/Following Links */}
      <div className="flex space-x-6 text-sm text-blue-600">
        <Link href={`/profile/${username}/followers`} className="hover:underline">
          {userProfile._count.followers} Followers
        </Link>
        <Link href={`/profile/${username}/following`} className="hover:underline">
          {userProfile._count.following} Following
        </Link>
      </div>

      {/* ✅ Recent Cards Section */}
      {userProfile.cards.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-700 dark:text-white mb-4">
            Recent Cards
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {userProfile.cards.map((card) => (
              <li key={card.id} className="border rounded p-4 bg-white dark:bg-gray-800 shadow">
                <Link href={`/card/${card.id}`}>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      width={400}
                      height={160}
                      className="mt-2 rounded w-full object-cover h-40"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}