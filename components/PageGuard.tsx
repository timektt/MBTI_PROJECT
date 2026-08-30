"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PageGuardProps = {
  children: React.ReactNode;
};

export default function PageGuard({ children }: PageGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else if (!session.user.hasProfile) {
      router.push("/setup-profile");
    } else if (!session.user.hasMbtiCard) {
      router.push("/quiz");
    }
  }, [session, status, router]);

  if (status === "loading" || !session?.user?.hasMbtiCard) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
