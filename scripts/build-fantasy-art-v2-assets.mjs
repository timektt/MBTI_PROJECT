#!/usr/bin/env node

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(
  appRoot,
  "output/ui-redesign-v4/2026-08-30/fantasy-v2/production",
);
const publicRoot = path.join(appRoot, "public/mbti-z/v4/fantasy-v2");
const manifestPath = path.join(appRoot, "data/ui/fantasy-art-v2-assets.json");

const animals = [
  ["INTJ", "obsidian-raven", "intj-obsidian-raven-v2.png", "50% 42%"],
  ["INTP", "arcane-owl", "intp-arcane-owl-v2.png", "50% 42%"],
  ["ENTJ", "crowned-lion", "entj-crowned-lion-v2.png", "50% 40%"],
  ["ENTP", "storm-fox", "entp-storm-fox-v2.png", "50% 43%"],
  ["INFJ", "moon-deer", "infj-moon-deer-v2.png", "50% 38%"],
  ["INFP", "dream-swan", "infp-dream-swan-v2.png", "52% 45%"],
  ["ENFJ", "solar-phoenix", "enfj-solar-phoenix-v2.png", "50% 42%"],
  ["ENFP", "aurora-rabbit", "enfp-aurora-rabbit-v2.png", "50% 42%"],
  ["ISTJ", "iron-wolf", "istj-iron-wolf-v2.png", "50% 40%"],
  ["ISFJ", "guardian-bear", "isfj-guardian-bear-v2.png", "50% 42%"],
  ["ESTJ", "golden-eagle", "estj-golden-eagle-v2.png", "50% 40%"],
  ["ESFJ", "hearth-stag", "esfj-hearth-stag-v2.png", "50% 36%"],
  ["ISTP", "steel-panther", "istp-steel-panther-v2.png", "50% 46%"],
  ["ISFP", "crystal-lynx", "isfp-crystal-lynx-v2.png", "50% 40%"],
  ["ESTP", "thunder-tiger", "estp-thunder-tiger-v2.png", "50% 44%"],
  ["ESFP", "neon-peacock", "esfp-neon-peacock-v2.png", "44% 40%"],
];
const houses = ["purple", "green", "yellow", "blue"];
const budgets = {
  animal: 550_000,
  animalTotal: 7_000_000,
  hero: 450_000,
  house: 450_000,
  houseTotal: 1_700_000,
};

async function sha256(filePath) {
  return createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}

function relativePath(filePath) {
  return path.relative(appRoot, filePath).replaceAll(path.sep, "/");
}

async function describe(filePath) {
  const [metadata, stat, hash] = await Promise.all([
    sharp(filePath).metadata(),
    fs.stat(filePath),
    sha256(filePath),
  ]);

  return {
    path: relativePath(filePath),
    width: metadata.width,
    height: metadata.height,
    bytes: stat.size,
    sha256: hash,
  };
}

async function buildWebp({ inputPath, outputPath, width, height, quality }) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .resize(width, height, { fit: "cover", position: "centre" })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  return {
    source: await describe(inputPath),
    runtime: await describe(outputPath),
  };
}

async function main() {
  const animalAssets = [];

  for (const [code, animalKey, sourceFilename, objectPosition] of animals) {
    const inputPath = path.join(sourceRoot, "animals", sourceFilename);
    const outputPath = path.join(
      publicRoot,
      "animals",
      `${code.toLowerCase()}-${animalKey}.webp`,
    );
    const files = await buildWebp({
      inputPath,
      outputPath,
      width: 1080,
      height: 1350,
      quality: 82,
    });
    animalAssets.push({
      id: `FAM-V2-${code}`,
      kind: "animal",
      code,
      animalKey,
      objectPosition,
      ...files,
    });
  }

  const houseAssets = [];
  for (const houseKey of houses) {
    const inputPath = path.join(sourceRoot, "houses", `${houseKey}-v2.png`);
    const outputPath = path.join(publicRoot, "houses", `${houseKey}.webp`);
    const files = await buildWebp({
      inputPath,
      outputPath,
      width: 1600,
      height: 960,
      quality: 80,
    });
    houseAssets.push({
      id: `FAM-V2-HOUSE-${houseKey.toUpperCase()}`,
      kind: "house",
      houseKey,
      objectPosition: "50% 50%",
      ...files,
    });
  }

  const heroFiles = await buildWebp({
    inputPath: path.join(sourceRoot, "home-hero-v2.png"),
    outputPath: path.join(publicRoot, "home", "living-archive-hero-v2.webp"),
    width: 1672,
    height: 941,
    quality: 82,
  });
  const heroAsset = {
    id: "FAM-V2-HOME-HERO",
    kind: "hero",
    objectPosition: {
      mobile: "68% 50%",
      tablet: "62% 50%",
      desktop: "50% 50%",
    },
    ...heroFiles,
  };

  const animalBytes = animalAssets.reduce(
    (total, asset) => total + asset.runtime.bytes,
    0,
  );
  const houseBytes = houseAssets.reduce(
    (total, asset) => total + asset.runtime.bytes,
    0,
  );
  const failures = [
    ...animalAssets
      .filter((asset) => asset.runtime.bytes > budgets.animal)
      .map((asset) => `${asset.id}:oversized:${asset.runtime.bytes}:${budgets.animal}`),
    ...houseAssets
      .filter((asset) => asset.runtime.bytes > budgets.house)
      .map((asset) => `${asset.id}:oversized:${asset.runtime.bytes}:${budgets.house}`),
    ...(animalBytes > budgets.animalTotal
      ? [`animals:oversized:${animalBytes}:${budgets.animalTotal}`]
      : []),
    ...(houseBytes > budgets.houseTotal
      ? [`houses:oversized:${houseBytes}:${budgets.houseTotal}`]
      : []),
    ...(heroAsset.runtime.bytes > budgets.hero
      ? [`hero:oversized:${heroAsset.runtime.bytes}:${budgets.hero}`]
      : []),
  ];
  const manifest = {
    schemaVersion: "mbti-z-fantasy-art-v2",
    systemPromptVersion: "FANTASY-ART-SYS-2.0",
    decisionDate: "2026-08-30",
    generationMode: "built-in image_gen",
    rightsReview:
      "Original project prompts with no third-party image references; deployment use remains subject to the account and platform terms.",
    budgets,
    summary: {
      animalCount: animalAssets.length,
      houseCount: houseAssets.length,
      heroCount: 1,
      animalBytes,
      houseBytes,
      heroBytes: heroAsset.runtime.bytes,
      totalBytes: animalBytes + houseBytes + heroAsset.runtime.bytes,
    },
    hero: heroAsset,
    houses: houseAssets,
    animals: animalAssets,
    failures,
  };

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify(manifest, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
