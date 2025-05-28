import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import Image from "next/image";

type Following = {
  id: string;
  name: string | null;
  username: string | null; // ปรับให้ตรงกับ schema
  image: string | null;
  isFollowing: boolean;
};

type Props = {
  following: Following[];
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

  const followingData = await prisma.follow.findMany({
    where: { followerId: profileUser.id },
    include: {
      following: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
  });

  // สร้าง followingMap สำหรับ currentUserId
  let followingMap: Record<string, boolean> = {};
  if (currentUserId) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: followingData.map((f) => f.following.id) },
      },
      select: { followingId: true },
    });
    followingMap = Object.fromEntries(following.map((f) => [f.followingId, true]));
  }

  const following: Following[] = followingData.map((f) => ({
    id: f.following.id,
    name: f.following.name,
    username: f.following.username,
    image: f.following.image,
    isFollowing: !!followingMap[f.following.id],
  }));

  return {
    props: {
      following,
      currentUserId,
      profileUsername,
    },
  };
};

export default function FollowingPage({
  following,
  currentUserId,
  profileUsername,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Following of @{profileUsername}</h1>

      {following.length === 0 && (
        <p className="text-gray-500">Not following anyone yet.</p>
      )}

      <ul className="space-y-4">
        {following.map((user) => (
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
