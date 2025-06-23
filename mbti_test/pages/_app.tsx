// pages/_app.tsx
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

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
      <Navbar key={session?.user?.image || "guest"} />
      <main className="max-w-4xl mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
