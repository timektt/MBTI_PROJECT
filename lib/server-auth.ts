import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "@/auth";

export function isAuthRuntimeConfigured() {
  return Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
}

export async function getServerAuthSession(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!isAuthRuntimeConfigured()) return null;
  return auth(request, response);
}
