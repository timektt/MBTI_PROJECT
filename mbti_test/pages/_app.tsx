import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css" // Tailwind support
import Navbar from "@/components/Navbar"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  )
}