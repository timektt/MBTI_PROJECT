import type { NextApiRequest, NextApiResponse } from "next";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const ipCache = new Map<string, { count: number; lastRequest: number }>();

function getRouteScope(req: NextApiRequest) {
  if (!req.url) return "unknown-route";

  try {
    const pathname = new URL(req.url, "http://local").pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  } catch {
    const pathname = req.url.split(/[?#]/, 1)[0];
    return pathname || "unknown-route";
  }
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: RateLimitOptions
) {
  const forwarded = req.headers["x-forwarded-for"];
  const fallbackIp = req.socket?.remoteAddress || "unknown";
  let ip = fallbackIp;

  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0]?.trim() || fallbackIp;
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0]?.trim() || fallbackIp;
  }

  const now = Date.now();
  const cacheKey = `${getRouteScope(req)}\u0000${ip}`;
  const entry = ipCache.get(cacheKey);

  if (entry && now - entry.lastRequest < options.windowMs) {
    if (entry.count >= options.max) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return false;
    }
    entry.count += 1;
    entry.lastRequest = now;
    ipCache.set(cacheKey, entry);
  } else {
    ipCache.set(cacheKey, { count: 1, lastRequest: now });
  }
  return true;
}
