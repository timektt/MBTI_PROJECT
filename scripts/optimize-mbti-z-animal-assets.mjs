#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const animalDirectory = path.join(appRoot, "public/mbti-z/animals");
const pngOptions = {
  palette: true,
  quality: 90,
  colours: 256,
  effort: 10,
  dither: 0.85,
};

function formatReduction(beforeBytes, afterBytes) {
  return Number(((1 - afterBytes / beforeBytes) * 100).toFixed(1));
}

async function optimizeAsset(filename) {
  const inputPath = path.join(animalDirectory, filename);
  const temporaryPath = `${inputPath}.optimized.png`;
  const inputStat = await fs.stat(inputPath);
  const metadata = await sharp(inputPath).metadata();

  if (metadata.isPalette) {
    return {
      filename,
      status: "skipped_palette",
      beforeBytes: inputStat.size,
      afterBytes: inputStat.size,
      reductionPercent: 0,
    };
  }

  try {
    await sharp(inputPath).png(pngOptions).toFile(temporaryPath);
    const outputStat = await fs.stat(temporaryPath);

    if (outputStat.size >= inputStat.size) {
      await fs.unlink(temporaryPath);
      return {
        filename,
        status: "skipped_no_reduction",
        beforeBytes: inputStat.size,
        afterBytes: inputStat.size,
        reductionPercent: 0,
      };
    }

    await fs.rename(temporaryPath, inputPath);
    return {
      filename,
      status: "optimized",
      beforeBytes: inputStat.size,
      afterBytes: outputStat.size,
      reductionPercent: formatReduction(inputStat.size, outputStat.size),
    };
  } catch (error) {
    await fs.rm(temporaryPath, { force: true });
    throw error;
  }
}

async function main() {
  const filenames = (await fs.readdir(animalDirectory))
    .filter((filename) => filename.endsWith(".png"))
    .sort();
  const assets = [];

  for (const filename of filenames) {
    assets.push(await optimizeAsset(filename));
  }

  const beforeBytes = assets.reduce((sum, asset) => sum + asset.beforeBytes, 0);
  const afterBytes = assets.reduce((sum, asset) => sum + asset.afterBytes, 0);

  console.log(
    JSON.stringify(
      {
        ok: true,
        options: pngOptions,
        summary: {
          assetCount: assets.length,
          optimizedCount: assets.filter((asset) => asset.status === "optimized").length,
          skippedCount: assets.filter((asset) => asset.status !== "optimized").length,
          beforeBytes,
          afterBytes,
          reductionPercent: formatReduction(beforeBytes, afterBytes),
        },
        assets,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
