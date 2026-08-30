import type { NextApiRequest } from "next";

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

export function readJsonBody(req: NextApiRequest): JsonBodyResult {
  if (typeof req.body !== "string") {
    return { ok: true, data: req.body ?? {} };
  }

  if (req.body.trim() === "") {
    return { ok: true, data: {} };
  }

  try {
    return { ok: true, data: JSON.parse(req.body) as unknown };
  } catch {
    return { ok: false, error: "Invalid JSON body" };
  }
}
