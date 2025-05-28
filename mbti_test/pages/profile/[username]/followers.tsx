import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import Image from "next/image";

type Follower = {
  id: string;
  name: string | null;
  username: string | null; // ปรับให้ตรงกับ schema (string | null)
  image: string | null;
  isFollowing: boolean;
};

type Props = {
  followers: Follower[];
  currentUserId: string | null;
  profileUsername: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const currentUserId = session?.user?.id ?? null;
  const profileUsername = context.params?.username as string;

  const profileUser = await prisma.user.findUnique({
    where: { username: profileUsername },
    select: { id: true },
  });

  if (!profileUser) return { notFound: true };

  const followersData = await prisma.follow.findMany({
    where: { followingId: profileUser.id },
    include: {
      follower: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
  });

  let followingMap: Record<string, boolean> = {};
  if (currentUserId) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: followersData.map((f) => f.follower.id) },
      },
      select: { followingId: true },
    });
    followingMap = Object.fromEntries(following.map((f) => [f.followingId, true]));
  }

  const followers: Follower[] = followersData.map((f) => ({
    id: f.follower.id,
    name: f.follower.name,
    username: f.follower.username,
    image: f.follower.image,
    isFollowing: !!followingMap[f.follower.id],
  }));

  return {
    props: {
      followers,
      currentUserId,
      profileUsername,
    },
  };
};

export default function FollowersPage({
  followers,
  currentUserId,
  profileUsername,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Followers of @{profileUsername}</h1>

      {followers.length === 0 && (
        <p className="text-gray-500">No followers yet.</p>
      )}

      <ul className="space-y-4">
        {followers.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <Link href={`/profile/${user.username ?? ""}`}>
              <div className="flex items-center space-x-4">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{user.name ?? "Unknown"}</span>
              </div>
            </Link>

            {currentUserId && currentUserId !== user.id && (
              <FollowButton userId={user.id} isFollowing={user.isFollowing} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
