import type { NextApiResponse } from "next";

export const ACCOUNT_RUNTIME_STATUS = "held" as const;

export function sendAccountRuntimeHeld(response: NextApiResponse) {
  return response.status(503).json({
    code: "account_runtime_held",
    error: "Account services are not available while MBTI Z runs guest-first.",
  });
}
