import { handlers } from "@/auth";
import { isAuthRuntimeConfigured } from "@/lib/server-auth";

const unavailable = () =>
  Response.json(
    {
      code: "account_runtime_held",
      error: "Account services are not available while MBTI Z runs guest-first.",
    },
    { status: 503 }
  );

export const GET = isAuthRuntimeConfigured() ? handlers.GET : unavailable;
export const POST = isAuthRuntimeConfigured() ? handlers.POST : unavailable;
export const runtime = "nodejs";
