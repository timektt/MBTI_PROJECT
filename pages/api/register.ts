import type { NextApiRequest, NextApiResponse } from "next";

import { sendAccountRuntimeHeld } from "@/lib/account-runtime";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;
  return sendAccountRuntimeHeld(res);
}
