// pages/card/me.tsx
// ดึง card จาก quizResult ที่สร้างไว้ทันทีหลัง submit

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { GetServerSidePropsContext } from "next";
import { redirect } from "next/navigation";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.id) {
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    };
  }

  const latestResult = await prisma.quizResult.findFirst({
    where: { userId: session.user.id },
    include: {
      card: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latestResult || !latestResult.card) {
    return {
      redirect: { destination: "/quiz", permanent: false },
    };
  }

  return {
    redirect: { destination: `/card/${latestResult.card.id}`, permanent: false },
  };
}

export default function MeCardRedirect() {
  return null;
}
