import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import {
  Bai_Jamjuree,
  Chakra_Petch,
  Noto_Serif_Thai,
  Playfair_Display,
  Space_Mono,
} from "next/font/google";

import Navbar from "@/components/Navbar";
import { MbtiZLocaleProvider } from "@/components/cyber/mbti-z-locale-provider";
import { ReducedMotionProvider } from "@/components/cyber/motion";
import "@/styles/globals.css";

type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const bodyFont = Bai_Jamjuree({
  subsets: ["latin", "thai"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const headingFont = Chakra_Petch({
  subsets: ["latin", "thai"],
  variable: "--font-heading-interface",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const thaiDisplayFont = Noto_Serif_Thai({
  subsets: ["thai"],
  variable: "--font-heading-thai-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const luxuryFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading-display",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  weight: ["400", "700"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => (
      <>
        <Navbar key={session?.user?.image || "guest"} />
        {page}
      </>
    ));

  return (
    <div
      className={`${bodyFont.variable} ${headingFont.variable} ${thaiDisplayFont.variable} ${luxuryFont.variable} ${monoFont.variable} theme font-interface`}
    >
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <MbtiZLocaleProvider>
        <ReducedMotionProvider>{getLayout(<Component {...pageProps} />)}</ReducedMotionProvider>
      </MbtiZLocaleProvider>
    </div>
  );
}
