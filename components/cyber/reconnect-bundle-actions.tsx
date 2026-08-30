"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileUp,
  PackageOpen,
  RotateCcw,
} from "lucide-react";

import {
  assessmentRuntime,
  type AssessmentReconnectImportResult,
  type GuestCloudReconnectBundle,
  type GuestLocale,
} from "@/lib/assessment-runtime";
import {
  getReconnectBundleFileName,
  serializeReconnectBundle,
} from "@/lib/reconnect-bundle";
import { mbtiZReconnectBundleCopy } from "@/lib/mbti-z-copy";

type ActionState = "idle" | "copied" | "downloaded";
type FeedbackTone = "neutral" | "success" | "error";
type FeedbackState = {
  tone: FeedbackTone;
  label: string;
} | null;

function getFeedbackClass(tone: FeedbackTone) {
  if (tone === "success") {
    return "text-[#b9ffda]";
  }

  if (tone === "error") {
    return "text-[#ffb5b5]";
  }

  return "text-white/52";
}

export function ReconnectBundleActions({
  bundle,
  locale,
  onImported,
}: {
  bundle: GuestCloudReconnectBundle | null;
  locale: GuestLocale;
  onImported?: (result: AssessmentReconnectImportResult) => void;
}) {
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [draftJson, setDraftJson] = useState("");
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const activeCopy = mbtiZReconnectBundleCopy[locale];
  const bundleJson = bundle ? serializeReconnectBundle(bundle) : null;
  const fileName = bundle ? getReconnectBundleFileName(bundle) : null;

  function queueReset() {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setActionState("idle");
      setFeedback(null);
    }, 2600);
  }

  function setTransientFeedback(label: string, tone: FeedbackTone) {
    setFeedback({
      tone,
      label,
    });
    queueReset();
  }

  async function handleCopy() {
    if (!bundleJson) {
      setTransientFeedback(activeCopy.failed, "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(bundleJson);
      setActionState("copied");
      setTransientFeedback(activeCopy.copied, "success");
    } catch {
      setActionState("idle");
      setTransientFeedback(activeCopy.failed, "error");
    }
  }

  function handleDownload() {
    if (!bundleJson || !fileName) {
      setTransientFeedback(activeCopy.failed, "error");
      return;
    }

    try {
      const blob = new Blob([bundleJson], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setActionState("downloaded");
      setTransientFeedback(activeCopy.downloaded, "success");
    } catch {
      setActionState("idle");
      setTransientFeedback(activeCopy.failed, "error");
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const nextJson = await file.text();
      setDraftJson(nextJson);
      setSourceLabel(file.name);
      setFeedback({
        tone: "neutral",
        label: `${activeCopy.sourceLoaded}: ${file.name}`,
      });
      setActionState("idle");
    } catch {
      setFeedback({
        tone: "error",
        label: activeCopy.failed,
      });
    } finally {
      event.target.value = "";
    }
  }

  function handleClearDraft() {
    setDraftJson("");
    setSourceLabel(null);
    setFeedback(null);
  }

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleImport() {
    const trimmed = draftJson.trim();

    if (!trimmed) {
      setFeedback({
        tone: "error",
        label: activeCopy.inputRequired,
      });
      return;
    }

    if (bundle && trimmed !== bundleJson && !window.confirm(activeCopy.overwriteConfirm)) {
      return;
    }

    const result = assessmentRuntime.importReconnectBundle(trimmed);

    if (!result.ok) {
      const nextLabel =
        result.code === "invalid_json"
          ? activeCopy.invalidJson
          : result.code === "invalid_bundle"
            ? activeCopy.invalidBundle
            : activeCopy.storageUnavailable;

      setFeedback({
        tone: "error",
        label: nextLabel,
      });
      return;
    }

    const importedBundle = result.bundle;

    if (importedBundle) {
      setDraftJson(serializeReconnectBundle(importedBundle));
      setSourceLabel(getReconnectBundleFileName(importedBundle));
    }

    setActionState("idle");
    setTransientFeedback(activeCopy.restored, "success");
    onImported?.(result);
  }

  return (
    <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#7cc8ff]/10 text-[#7cc8ff]">
            <PackageOpen className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="cyber-kicker text-[11px]">{activeCopy.eyebrow}</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/66">
              {bundle ? activeCopy.bodyReady : activeCopy.bodyEmpty}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {bundle ? (
                <>
                  <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/56">
                    {activeCopy.version} {bundle.version}
                  </span>
                  <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/56">
                    {activeCopy.locale} {bundle.locale}
                  </span>
                </>
              ) : (
                <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/46">
                  {activeCopy.emptyState}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRecoveryOpen((current) => !current)}
          aria-expanded={recoveryOpen}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[10px] uppercase tracking-[0.16em] text-white/64 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff]/35"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${recoveryOpen ? "rotate-180" : ""}`}
          />
          {recoveryOpen ? activeCopy.closeRecovery : activeCopy.openRecovery}
        </button>
      </div>

      {bundle ? (
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-4 py-2.5 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d]/40"
          >
            <Download className="h-3.5 w-3.5" />
            {activeCopy.download}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-code text-[11px] uppercase tracking-[0.16em] text-white/74 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff]/35"
          >
            {actionState === "copied" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {activeCopy.copy}
          </button>
        </div>
      ) : null}

      {recoveryOpen ? (
      <div className="mt-4 rounded-[1rem] border border-white/8 bg-[#050814]/32 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/66">
            <FileUp className="h-4 w-4" />
          </div>
          <div>
            <p className="cyber-kicker text-[11px]">{activeCopy.recoveryTitle}</p>
            <p className="mt-2 text-sm leading-7 text-white/62">
              {bundle ? activeCopy.recoveryBodyReady : activeCopy.recoveryBodyEmpty}
            </p>
          </div>
        </div>

        <textarea
          aria-label={activeCopy.recoveryTitle}
          value={draftJson}
          onChange={(event) => setDraftJson(event.target.value)}
          placeholder={activeCopy.placeholder}
          className="mt-4 min-h-[128px] w-full rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 font-code text-xs leading-6 text-white/78 outline-none transition placeholder:text-white/30 focus:border-[#7cc8ff]/40 focus:bg-white/[0.05]"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenFilePicker}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[10px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff]/35"
          >
            <FileUp className="h-3.5 w-3.5" />
            {activeCopy.upload}
          </button>
          <button
            type="button"
            onClick={handleClearDraft}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[10px] uppercase tracking-[0.16em] text-white/56 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff]/35"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {activeCopy.clear}
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7cc8ff,#b679ff)] px-4 py-2 font-code text-[10px] font-semibold uppercase tracking-[0.16em] text-[#050814] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b679ff]/35"
          >
            <PackageOpen className="h-3.5 w-3.5" />
            {activeCopy.import}
          </button>
        </div>

        <input
          aria-label={activeCopy.upload}
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/50">
            {activeCopy.importReady}
          </span>
          {sourceLabel ? (
            <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/50">
              {activeCopy.source} {sourceLabel}
            </span>
          ) : null}
        </div>
      </div>
      ) : null}

      {feedback ? (
        <p
          aria-live="polite"
          className={`mt-3 inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] ${getFeedbackClass(
            feedback.tone
          )}`}
        >
          {feedback.tone === "error" ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : feedback.tone === "success" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <PackageOpen className="h-3.5 w-3.5" />
          )}
          {feedback.label}
        </p>
      ) : null}
    </div>
  );
}
