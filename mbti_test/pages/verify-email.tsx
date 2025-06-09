// /pages/verify-email.tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("success");
          // ✅ Optional → redirect ไป login หลัง delay
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verify email error:", error);
        setStatus("error");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p className="text-green-600">
          Your email has been verified! Redirecting to login...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500">Invalid or expired verification link.</p>
      )}
    </div>
  );
}
