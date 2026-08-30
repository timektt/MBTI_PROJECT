"use client";

import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { resultShareCardSize } from "@/components/mbti-z/result-share-card";
import type { ResultShareImagePayload } from "@/lib/result-share-image";
import { cn } from "@/lib/utils";

export function DownloadResultButton({
  targetId,
  fileName,
  label,
  className,
  payload,
  processingLabel = "Preparing PNG",
  errorLabel = "PNG export unavailable",
  successLabel = "PNG downloaded",
}: {
  targetId: string;
  fileName: string;
  label: string;
  className?: string;
  payload?: ResultShareImagePayload;
  processingLabel?: string;
  errorLabel?: string;
  successLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function downloadBlob(blob: Blob) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  async function attemptServerExport() {
    if (!payload) return false;

    const response = await fetch("/api/result-share-image", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return false;
    }

    const blob = await response.blob();

    if (!blob.size) {
      return false;
    }

    await downloadBlob(blob);
    return true;
  }

  async function handleDownload() {
    const target = document.getElementById(targetId);

    if (status === "loading") {
      return;
    }

    setStatus("loading");

    try {
      const exportedByServer = await attemptServerExport();

      if (exportedByServer) {
        setStatus("success");
        return;
      }

      if (!target) {
        throw new Error("export-target-unavailable");
      }

      if (typeof document !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }

      const html2canvasModule = await import("html2canvas");
      const renderScale = Math.max(2, Math.min(3, window.devicePixelRatio || 1));
      const sourceCanvas = await html2canvasModule.default(target, {
        backgroundColor: "#05070f",
        scale: renderScale,
        useCORS: true,
        width: resultShareCardSize.width,
        height: resultShareCardSize.height,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: resultShareCardSize.width,
        windowHeight: resultShareCardSize.height,
        onclone: (documentClone) => {
          const exportSafeStyle = documentClone.createElement("style");
          exportSafeStyle.textContent = `
            html,
            body {
              background: #05070f !important;
              color: #ffffff !important;
            }

            *,
            *::before,
            *::after {
              border-color: rgba(255, 255, 255, 0.1) !important;
              outline-color: rgba(245, 199, 109, 0.4) !important;
            }
          `;
          documentClone.head.appendChild(exportSafeStyle);

          const clonedTarget = documentClone.getElementById(targetId);

          if (!clonedTarget) {
            return;
          }

          Object.assign(clonedTarget.style, {
            left: "0px",
            top: "0px",
            position: "fixed",
            transform: "none",
            opacity: "1",
            margin: "0",
            pointerEvents: "none",
          })
        },
      });
      const canvas = document.createElement("canvas");
      canvas.width = resultShareCardSize.width;
      canvas.height = resultShareCardSize.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("canvas-context-unavailable");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (blob) {
        await downloadBlob(blob);
        setStatus("success");
        return;
      }

      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setStatus("success");
    } catch (downloadError) {
      console.error("result-png-export-failed", downloadError);
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleDownload()}
        className={cn(
          "inline-flex h-11 min-w-[10.5rem] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d]/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-70",
          className
        )}
        disabled={status === "loading"}
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === "success" ? <CheckCircle2 className="h-4 w-4" /> : null}
        {status === "idle" || status === "error" ? <Download className="h-4 w-4" /> : null}
        {status === "loading" ? processingLabel : status === "success" ? successLabel : label}
      </button>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-xs leading-5",
          status === "error" ? "text-[#ffb4a8]" : "text-[var(--signal-text-soft)]"
        )}
      >
        {status === "success" ? successLabel : status === "error" ? errorLabel : ""}
      </p>
    </div>
  );
}
