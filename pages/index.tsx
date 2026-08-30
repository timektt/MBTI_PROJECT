import Head from "next/head";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { PremiumHome } from "@/components/marketing/premium-home";
import { mbtiZHomeCopy } from "@/lib/mbti-z-copy";

export default function HomePage() {
  const { locale } = useMbtiZLocale();
  const copy = mbtiZHomeCopy[locale];

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <meta name="description" content={copy.metaDescription} />
      </Head>
      <PremiumHome />
    </>
  );
}
