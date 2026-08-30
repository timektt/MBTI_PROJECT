export const mbtiZHouseScenePaths = {
  purple: "/mbti-z/houses/purple.png",
  green: "/mbti-z/houses/green.png",
  yellow: "/mbti-z/houses/yellow.png",
  blue: "/mbti-z/houses/blue.png",
} as const;

export type MbtiZHouseKey = keyof typeof mbtiZHouseScenePaths;

export function getMbtiZHouseScenePath(houseKey: string) {
  return mbtiZHouseScenePaths[houseKey as MbtiZHouseKey] ?? mbtiZHouseScenePaths.purple;
}

export function getMbtiZTypePosterPath(code: string, animalKey: string) {
  return `/mbti-z/animals/${code.toLowerCase()}-${animalKey}.png`;
}
