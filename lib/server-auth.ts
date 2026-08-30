import type { NextApiRequest, NextApiResponse } from "next";

export function isAuthRuntimeConfigured() {
  return Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
}

export async function getServerAuthSession(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!isAuthRuntimeConfigured()) return null;

  const { auth } = await import("@/auth");
  return auth(request, response);
}
