import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

import {
  getMbtiZTypeProfile,
  getMbtiZTypeStaticPaths,
} from "@/data/mbti/mbti-z-type-details.mjs";
import {
  TypeDetailPage,
  type RelatedTypeSummary,
  type TypeProfile,
} from "@/components/types/type-detail/type-detail-page";

type TypeDetailPageProps = {
  canonicalUrl: string;
  profile: TypeProfile;
  relatedProfiles: RelatedTypeSummary[];
};

const readTypeProfile = getMbtiZTypeProfile as (value: string) => TypeProfile | null;
const readStaticPaths = getMbtiZTypeStaticPaths as () => Array<{
  params: { code: string };
}>;

function createCanonicalUrl(routeSlug: string) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = configuredBaseUrl || "http://localhost:3000";

  try {
    return new URL(`/types/${routeSlug}`, baseUrl).toString();
  } catch {
    return `http://localhost:3000/types/${routeSlug}`;
  }
}

function toRelatedSummary(profile: TypeProfile): RelatedTypeSummary {
  return {
    code: profile.code,
    routeSlug: profile.routeSlug,
    houseKey: profile.houseKey,
    accentFrom: profile.accentFrom,
    accentTo: profile.accentTo,
    animalImagePath: profile.animalImagePath,
    archetypeNameTh: profile.archetypeNameTh,
    archetypeNameEn: profile.archetypeNameEn,
    houseTitleTh: profile.houseTitleTh,
    houseTitleEn: profile.houseTitleEn,
    animalNameTh: profile.animalNameTh,
    animalNameEn: profile.animalNameEn,
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: readStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<TypeDetailPageProps> = async ({ params }) => {
  const code = params?.code;

  if (typeof code !== "string" || code !== code.toLowerCase()) {
    return { notFound: true };
  }

  const profile = readTypeProfile(code);

  if (!profile || profile.routeSlug !== code) {
    return { notFound: true };
  }

  const relatedProfiles = profile.relatedCodes
    .map((relatedCode) => readTypeProfile(relatedCode))
    .filter((relatedProfile): relatedProfile is TypeProfile => relatedProfile !== null)
    .map(toRelatedSummary);

  return {
    props: {
      canonicalUrl: createCanonicalUrl(profile.routeSlug),
      profile,
      relatedProfiles,
    },
  };
};

export default function TypeDetailRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return <TypeDetailPage {...props} />;
}
