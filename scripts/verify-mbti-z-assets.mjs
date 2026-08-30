#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { mbtiZHouses, mbtiZProfiles } from "../data/mbti/mbti-z-data.mjs";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const HOUSE_SIZE = {
  width: 1600,
  height: 960,
};
const ANIMAL_POSTER_SIZE = {
  width: 1080,
  height: 1350,
};
const PNG_SIGNATURE = "89504e470d0a1a0a";

function readPngSize(relativePath) {
  const absolutePath = path.join(APP_ROOT, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  const signature = buffer.subarray(0, 8).toString("hex");

  if (signature !== PNG_SIGNATURE) {
    return {
      validPng: false,
      width: null,
      height: null,
    };
  }

  return {
    validPng: true,
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function assetExists(relativePath) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function collectAsset(relativePath, expectedSize) {
  if (!assetExists(relativePath)) {
    return {
      path: relativePath,
      ok: false,
      failure: "missing",
      width: null,
      height: null,
    };
  }

  const size = readPngSize(relativePath);
  const ok =
    size.validPng &&
    size.width === expectedSize.width &&
    size.height === expectedSize.height;

  return {
    path: relativePath,
    ok,
    failure: ok
      ? null
      : !size.validPng
        ? "invalid_png"
        : `unexpected_size:${size.width}x${size.height}`,
    width: size.width,
    height: size.height,
  };
}

function posterPathForProfile(profile) {
  return `public/mbti-z/animals/${profile.code.toLowerCase()}-${profile.animalKey}.png`;
}

function housePathForKey(houseKey) {
  return `public/mbti-z/houses/${houseKey}.png`;
}

function unique(values) {
  return [...new Set(values)];
}

export function collectMbtiZAssetStatus() {
  const houseKeys = Object.keys(mbtiZHouses).sort();
  const profileCodes = mbtiZProfiles.map((profile) => profile.code).sort();
  const duplicateProfileCodes = profileCodes.filter(
    (code, index) => profileCodes.indexOf(code) !== index
  );
  const animalKeys = mbtiZProfiles.map((profile) => profile.animalKey);
  const duplicateAnimalKeys = animalKeys.filter(
    (animalKey, index) => animalKeys.indexOf(animalKey) !== index
  );
  const houseAssets = houseKeys.map((houseKey) =>
    collectAsset(housePathForKey(houseKey), HOUSE_SIZE)
  );
  const animalAssets = mbtiZProfiles
    .slice()
    .sort((left, right) => left.code.localeCompare(right.code))
    .map((profile) => ({
      code: profile.code,
      animalKey: profile.animalKey,
      animalNameTh: profile.animalNameTh,
      animalNameEn: profile.animalNameEn,
      ...collectAsset(posterPathForProfile(profile), ANIMAL_POSTER_SIZE),
    }));
  const failures = [
    ...(houseKeys.length === 4 ? [] : [`house_count:${houseKeys.length}:4`]),
    ...(profileCodes.length === 16 ? [] : [`profile_count:${profileCodes.length}:16`]),
    ...duplicateProfileCodes.map((code) => `duplicate_profile_code:${code}`),
    ...duplicateAnimalKeys.map((animalKey) => `duplicate_animal_key:${animalKey}`),
    ...houseAssets
      .filter((asset) => !asset.ok)
      .map((asset) => `house_asset:${asset.path}:${asset.failure}`),
    ...animalAssets
      .filter((asset) => !asset.ok)
      .map((asset) => `animal_asset:${asset.code}:${asset.path}:${asset.failure}`),
  ];

  return {
    ok: failures.length === 0,
    expected: {
      houseCount: 4,
      animalPosterCount: 16,
      houseSize: HOUSE_SIZE,
      animalPosterSize: ANIMAL_POSTER_SIZE,
    },
    summary: {
      houseCount: houseAssets.length,
      animalPosterCount: animalAssets.length,
      profileCount: profileCodes.length,
      uniqueProfileCount: unique(profileCodes).length,
      uniqueAnimalKeyCount: unique(animalKeys).length,
      failureCount: failures.length,
    },
    houseAssets,
    animalAssets,
    failures,
  };
}

function main() {
  const result = collectMbtiZAssetStatus();
  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
