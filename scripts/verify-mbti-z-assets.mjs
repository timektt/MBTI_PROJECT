#!/usr/bin/env node

import { createHash } from "node:crypto";
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
const ANIMAL_POSTER_MAX_BYTES = 550_000;
const ANIMAL_POSTER_TOTAL_MAX_BYTES = 7_000_000;
const HOUSE_MAX_BYTES = 450_000;
const HOUSE_TOTAL_MAX_BYTES = 1_700_000;
const HOME_HERO_PATH =
  "public/mbti-z/v4/fantasy-v2/home/living-archive-hero-v2.webp";
const HOME_HERO_SIZE = {
  width: 1672,
  height: 941,
};
const HOME_HERO_MAX_BYTES = 450_000;
const MANIFEST_PATH = "data/ui/fantasy-art-v2-assets.json";
const MANIFEST_SCHEMA_VERSION = "mbti-z-fantasy-art-v2";

function assetExists(relativePath) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function readWebpSize(relativePath) {
  const absolutePath = path.join(APP_ROOT, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  const isWebp =
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";

  if (!isWebp) {
    return { validWebp: false, width: null, height: null };
  }

  const chunkType = buffer.subarray(12, 16).toString("ascii");
  if (chunkType === "VP8 ") {
    const hasFrameHeader = buffer.subarray(23, 26).toString("hex") === "9d012a";
    return {
      validWebp: hasFrameHeader,
      width: hasFrameHeader ? buffer.readUInt16LE(26) & 0x3fff : null,
      height: hasFrameHeader ? buffer.readUInt16LE(28) & 0x3fff : null,
    };
  }

  if (chunkType === "VP8X") {
    return {
      validWebp: true,
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  return { validWebp: false, width: null, height: null };
}

function collectWebpAsset(relativePath, expectedSize, maxBytes, expectedHash) {
  if (!assetExists(relativePath)) {
    return {
      path: relativePath,
      ok: false,
      failure: "missing",
      width: null,
      height: null,
      bytes: null,
    };
  }

  const size = readWebpSize(relativePath);
  const absolutePath = path.join(APP_ROOT, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  const bytes = buffer.byteLength;
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const dimensionsMatch =
    size.validWebp &&
    size.width === expectedSize.width &&
    size.height === expectedSize.height;
  const withinBudget = bytes <= maxBytes;
  const hashMatches = typeof expectedHash === "string" && sha256 === expectedHash;
  const ok = dimensionsMatch && withinBudget && hashMatches;

  return {
    path: relativePath,
    ok,
    failure: ok
      ? null
      : !size.validWebp
        ? "invalid_webp"
        : !dimensionsMatch
          ? `unexpected_size:${size.width}x${size.height}`
          : !withinBudget
            ? `oversized:${bytes}:${maxBytes}`
            : `hash_mismatch:${sha256}:${expectedHash ?? "missing_manifest_hash"}`,
    width: size.width,
    height: size.height,
    bytes,
    sha256,
  };
}

function posterPathForProfile(profile) {
  return `public/mbti-z/v4/fantasy-v2/animals/${profile.code.toLowerCase()}-${profile.animalKey}.webp`;
}

function housePathForKey(houseKey) {
  return `public/mbti-z/v4/fantasy-v2/houses/${houseKey}.webp`;
}

function unique(values) {
  return [...new Set(values)];
}

export function collectMbtiZAssetStatus() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(APP_ROOT, MANIFEST_PATH), "utf8")
  );
  const manifestAnimals = new Map(
    manifest.animals?.map((asset) => [asset.code, asset]) ?? []
  );
  const manifestHouses = new Map(
    manifest.houses?.map((asset) => [asset.houseKey, asset]) ?? []
  );
  const houseKeys = Object.keys(mbtiZHouses).sort();
  const profileCodes = mbtiZProfiles.map((profile) => profile.code).sort();
  const duplicateProfileCodes = profileCodes.filter(
    (code, index) => profileCodes.indexOf(code) !== index
  );
  const animalKeys = mbtiZProfiles.map((profile) => profile.animalKey);
  const duplicateAnimalKeys = animalKeys.filter(
    (animalKey, index) => animalKeys.indexOf(animalKey) !== index
  );
  const houseAssets = houseKeys.map((houseKey) => {
    const manifestAsset = manifestHouses.get(houseKey);
    const expectedPath = housePathForKey(houseKey);
    const asset = collectWebpAsset(
      expectedPath,
      HOUSE_SIZE,
      HOUSE_MAX_BYTES,
      manifestAsset?.runtime?.sha256
    );

    return {
      houseKey,
      manifestPathMatches: manifestAsset?.runtime?.path === expectedPath,
      ...asset,
    };
  });
  const animalAssets = mbtiZProfiles
    .slice()
    .sort((left, right) => left.code.localeCompare(right.code))
    .map((profile) => {
      const manifestAsset = manifestAnimals.get(profile.code);
      const expectedPath = posterPathForProfile(profile);
      const asset = collectWebpAsset(
        expectedPath,
        ANIMAL_POSTER_SIZE,
        ANIMAL_POSTER_MAX_BYTES,
        manifestAsset?.runtime?.sha256
      );

      return {
        code: profile.code,
        animalKey: profile.animalKey,
        animalNameTh: profile.animalNameTh,
        animalNameEn: profile.animalNameEn,
        manifestPathMatches: manifestAsset?.runtime?.path === expectedPath,
        ...asset,
      };
    });
  const totalAnimalPosterBytes = animalAssets.reduce(
    (total, asset) => total + (asset.bytes ?? 0),
    0
  );
  const totalHouseBytes = houseAssets.reduce(
    (total, asset) => total + (asset.bytes ?? 0),
    0
  );
  const homeHeroAsset = collectWebpAsset(
    HOME_HERO_PATH,
    HOME_HERO_SIZE,
    HOME_HERO_MAX_BYTES,
    manifest.hero?.runtime?.sha256
  );
  const manifestFailures = [
    ...(manifest.schemaVersion === MANIFEST_SCHEMA_VERSION
      ? []
      : [`manifest_schema:${manifest.schemaVersion ?? "missing"}:${MANIFEST_SCHEMA_VERSION}`]),
    ...(manifest.systemPromptVersion === "FANTASY-ART-SYS-2.0"
      ? []
      : [`manifest_prompt_version:${manifest.systemPromptVersion ?? "missing"}`]),
    ...(manifest.animals?.length === 16
      ? []
      : [`manifest_animal_count:${manifest.animals?.length ?? 0}:16`]),
    ...(manifest.houses?.length === 4
      ? []
      : [`manifest_house_count:${manifest.houses?.length ?? 0}:4`]),
    ...(manifest.hero?.runtime?.path === HOME_HERO_PATH
      ? []
      : [`manifest_hero_path:${manifest.hero?.runtime?.path ?? "missing"}`]),
    ...((manifest.failures ?? []).map((failure) => `manifest_build:${failure}`)),
  ];
  const failures = [
    ...manifestFailures,
    ...(houseKeys.length === 4 ? [] : [`house_count:${houseKeys.length}:4`]),
    ...(profileCodes.length === 16 ? [] : [`profile_count:${profileCodes.length}:16`]),
    ...duplicateProfileCodes.map((code) => `duplicate_profile_code:${code}`),
    ...duplicateAnimalKeys.map((animalKey) => `duplicate_animal_key:${animalKey}`),
    ...houseAssets
      .filter((asset) => !asset.ok)
      .map((asset) => `house_asset:${asset.path}:${asset.failure}`),
    ...houseAssets
      .filter((asset) => !asset.manifestPathMatches)
      .map((asset) => `house_manifest_path:${asset.houseKey}:${asset.path}`),
    ...(totalHouseBytes <= HOUSE_TOTAL_MAX_BYTES
      ? []
      : [`house_asset_total_bytes:${totalHouseBytes}:${HOUSE_TOTAL_MAX_BYTES}`]),
    ...animalAssets
      .filter((asset) => !asset.ok)
      .map((asset) => `animal_asset:${asset.code}:${asset.path}:${asset.failure}`),
    ...animalAssets
      .filter((asset) => !asset.manifestPathMatches)
      .map((asset) => `animal_manifest_path:${asset.code}:${asset.path}`),
    ...(totalAnimalPosterBytes <= ANIMAL_POSTER_TOTAL_MAX_BYTES
      ? []
      : [
          `animal_asset_total_bytes:${totalAnimalPosterBytes}:${ANIMAL_POSTER_TOTAL_MAX_BYTES}`,
        ]),
    ...(homeHeroAsset.ok
      ? []
      : [`home_hero_asset:${homeHeroAsset.path}:${homeHeroAsset.failure}`]),
  ];

  return {
    ok: failures.length === 0,
    expected: {
      houseCount: 4,
      animalPosterCount: 16,
      houseSize: HOUSE_SIZE,
      animalPosterSize: ANIMAL_POSTER_SIZE,
      animalPosterMaxBytes: ANIMAL_POSTER_MAX_BYTES,
      animalPosterTotalMaxBytes: ANIMAL_POSTER_TOTAL_MAX_BYTES,
      houseMaxBytes: HOUSE_MAX_BYTES,
      houseTotalMaxBytes: HOUSE_TOTAL_MAX_BYTES,
      homeHeroSize: HOME_HERO_SIZE,
      homeHeroMaxBytes: HOME_HERO_MAX_BYTES,
    },
    summary: {
      houseCount: houseAssets.length,
      animalPosterCount: animalAssets.length,
      profileCount: profileCodes.length,
      uniqueProfileCount: unique(profileCodes).length,
      uniqueAnimalKeyCount: unique(animalKeys).length,
      totalAnimalPosterBytes,
      totalHouseBytes,
      homeHeroBytes: homeHeroAsset.bytes,
      manifestSchemaVersion: manifest.schemaVersion,
      failureCount: failures.length,
    },
    houseAssets,
    animalAssets,
    homeHeroAsset,
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
