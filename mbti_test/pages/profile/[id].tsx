import FollowButton from "@/components/FollowButton";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type UserProfile = {
  name: string | null;
  image: string | null;
  username: string | null; // ปรับให้ตรงกับ schema (string | null)
  bio: string | null;
  _count: {
    followers: number;
    following: number;
  };
};

type ProfilePageProps = {
  userProfile: UserProfile;
  profileUserId: string;
  currentUserId: string | null;
  isFollowing: boolean;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ProfilePageProps>> => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const profileUserId = context.params?.id as string;
  const currentUserId = session?.user?.id ?? null;

  if (!profileUserId) return { notFound: true };

  const userProfile = await prisma.user.findUnique({
    where: { id: profileUserId },
    select: {
      name: true,
      image: true,
      username: true,
      bio: true,
      _count: {
        select: { followers: true, following: true },
      },
    },
  });

  if (!userProfile) return { notFound: true };

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
      : false;

  return {
    props: {
      userProfile: userProfile as UserProfile, // ป้องกัน TS เตือน null
      profileUserId,
      currentUserId,
      isFollowing,
    },
  };
};

export default function ProfilePage({
  userProfile,
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfilePageProps) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src={userProfile.image || "/default-avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{userProfile.name ?? "Anonymous"}</h1>
          <p className="text-gray-500">@{userProfile.username ?? "unknown"}</p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {userProfile.bio ?? "No bio provided."}
          </p>
        </div>
      </div>

      {currentUserId && currentUserId !== profileUserId && (
        <div>
          <FollowButton userId={profileUserId} isFollowing={isFollowing} />
        </div>
      )}

      <div className="flex space-x-6 text-sm text-gray-600">
        <span>{userProfile._count.followers} Followers</span>
        <span>{userProfile._count.following} Following</span>
      </div>
    </div>
  );
}
