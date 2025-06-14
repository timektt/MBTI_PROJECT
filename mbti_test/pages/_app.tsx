import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useEffect } from "react";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5}
      refetchOnWindowFocus={true}
    >
      <Navbar key={session?.user?.email || "guest"} />
      <ProfileGuard>
        <main className="max-w-4xl mx-auto p-4">
          <Component {...pageProps} />
        </main>
      </ProfileGuard>
    </SessionProvider>
  );
}

// ✅ ProfileGuard component → check profile ก่อน render main component
function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ หน้า "ที่ไม่ต้องบังคับ check" → เช่น login, register, forgot-password, setup-profile
  const excludedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/setup-profile",
  ];

  useEffect(() => {
    if (status === "loading") return; // ยังโหลด session อยู่ → รอ

    // ✅ ถ้า session มี แต่ไม่มี username หรือ image → redirect ไป setup-profile
    if (
      session?.user &&
      (!session.user.username || !session.user.image) &&
      !excludedPaths.includes(router.pathname)
    ) {
      router.push("/setup-profile");
    }
  }, [session, status, router]);

  return <>{children}</>;
}
