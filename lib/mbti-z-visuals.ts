export const mbtiZHouseScenePaths = {
  purple: "/mbti-z/v4/fantasy-v2/houses/purple.webp",
  green: "/mbti-z/v4/fantasy-v2/houses/green.webp",
  yellow: "/mbti-z/v4/fantasy-v2/houses/yellow.webp",
  blue: "/mbti-z/v4/fantasy-v2/houses/blue.webp",
} as const;

const mbtiZAnimalFocalPositions: Record<string, string> = {
  INTJ: "50% 42%",
  INTP: "50% 42%",
  ENTJ: "50% 40%",
  ENTP: "50% 43%",
  INFJ: "50% 38%",
  INFP: "52% 45%",
  ENFJ: "50% 42%",
  ENFP: "50% 42%",
  ISTJ: "50% 40%",
  ISFJ: "50% 42%",
  ESTJ: "50% 40%",
  ESFJ: "50% 36%",
  ISTP: "50% 46%",
  ISFP: "50% 40%",
  ESTP: "50% 44%",
  ESFP: "44% 40%",
};

export type MbtiZHouseKey = keyof typeof mbtiZHouseScenePaths;

export function getMbtiZHouseScenePath(houseKey: string) {
  return mbtiZHouseScenePaths[houseKey as MbtiZHouseKey] ?? mbtiZHouseScenePaths.purple;
}

export function getMbtiZTypePosterPath(code: string, animalKey: string) {
  return `/mbti-z/v4/fantasy-v2/animals/${code.toLowerCase()}-${animalKey}.webp`;
}

export function getMbtiZAnimalFocalPosition(code: string) {
  return mbtiZAnimalFocalPositions[code.toUpperCase()] ?? "50% 42%";
}
