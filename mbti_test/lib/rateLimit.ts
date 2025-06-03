import type { NextApiRequest, NextApiResponse } from "next";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const ipCache = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: RateLimitOptions
) {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = "";

  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0];
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0];
  } else {
    ip = req.socket?.remoteAddress || "unknown";
  }

  const now = Date.now();
  const entry = ipCache.get(ip);

  if (entry && now - entry.lastRequest < options.windowMs) {
    if (entry.count >= options.max) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return false;
    }
    entry.count += 1;
    entry.lastRequest = now;
    ipCache.set(ip, entry);
  } else {
    ipCache.set(ip, { count: 1, lastRequest: now });
  }
  return true;
}