import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { readJsonBody } from "@/lib/api-request";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { parseReconnectBundlePayload } from "@/lib/reconnect-bundle";
import {
  buildReconnectImportSummary,
  dedupeReconnectImportResults,
  getReconnectSummaryMismatches,
  importReconnectBundleForUser,
} from "@/lib/reconnect-bundle-cloud-import";
import { ReconnectBundleImportSchema } from "@/lib/schema";

function serializeBundleCandidate(candidate: string | Record<string, unknown>) {
  return typeof candidate === "string" ? candidate : JSON.stringify(candidate);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 20 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = readJsonBody(req);
  if (!body.ok) {
    return res.status(400).json({ error: body.error });
  }

  const parsed = ReconnectBundleImportSchema.safeParse(body.data);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const parsedBundle = parseReconnectBundlePayload(
    serializeBundleCandidate(parsed.data.bundle)
  );

  if (!parsedBundle.ok) {
    return res.status(400).json({
      error: "Invalid reconnect bundle",
      code: parsedBundle.code,
    });
  }

  const summaryMismatches = getReconnectSummaryMismatches(parsedBundle.bundle);
  if (summaryMismatches.length > 0) {
    return res.status(400).json({
      error: "Reconnect bundle summary does not match payload",
      code: "bundle_summary_mismatch",
      fields: summaryMismatches,
    });
  }

  const [user, existingResultCount] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    }),
    prisma.quizResult.count({
      where: { userId: session.user.id },
    }),
  ]);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const summary = buildReconnectImportSummary(parsedBundle.bundle);
  const dryRun = parsed.data.dryRun !== false;
  const overwrite = parsed.data.overwrite === true;
  const importableResultCount = dedupeReconnectImportResults(
    parsedBundle.bundle
  ).length;
  const requiresConflictResolution =
    existingResultCount > 0 && importableResultCount > 0;

  if (dryRun) {
    return res.status(200).json({
      ok: true,
      status: "validated",
      dryRun: true,
      summary,
      account: {
        existingResultCount,
        requiresConflictResolution,
      },
    });
  }

  if (requiresConflictResolution && !overwrite) {
    return res.status(409).json({
      ok: false,
      status: "conflict",
      dryRun: false,
      summary,
      account: {
        existingResultCount,
        requiresConflictResolution,
      },
      error: "Reconnect bundle import requires explicit overwrite confirmation.",
    });
  }

  const imported = await importReconnectBundleForUser({
    db: prisma,
    bundle: parsedBundle.bundle,
    userId: session.user.id,
  });

  return res.status(200).json({
    ok: true,
    status: "imported",
    dryRun: false,
    summary,
    account: {
      existingResultCount,
      requiresConflictResolution,
    },
    imported,
  });
}
