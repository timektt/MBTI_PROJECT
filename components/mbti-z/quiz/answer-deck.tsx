"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Orbit,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  resolveMotionDistance,
  resolveMotionDuration,
  resolveMotionScale,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { GuestQuestion } from "@/lib/assessment-runtime";
import { cn } from "@/lib/utils";

type OptionVisual = {
  pillClassName: string;
  toneClassName: string;
  iconClassName: string;
  Icon: LucideIcon;
};

export type QuizAnswerDeckCopy = {
  optionPrefix: string;
  strong: string;
  lean: string;
  balancedMid: string;
  tapToSelect: string;
  selected: string;
  ready: string;
};

const CORE_OPTION_ORDER = ["A", "A-lean", "mid", "B-lean", "B"];

function sortQuestionOptions(question: GuestQuestion) {
  if (question.kind !== "mbti") {
    return question.options;
  }

  return [...question.options].sort(
    (left, right) =>
      CORE_OPTION_ORDER.indexOf(left.key) - CORE_OPTION_ORDER.indexOf(right.key)
  );
}

function optionGridClass(question: GuestQuestion, optionKey: string) {
  if (question.kind !== "mbti") return "";

  return optionKey === "mid" ? "md:col-span-2 xl:col-span-1" : "";
}

function optionVisual(optionKey: string, index: number): OptionVisual {
  switch (optionKey) {
    case "A":
      return {
        pillClassName: "border-[#6fd4ff]/20 bg-[#6fd4ff]/10 text-[#9fe7ff]",
        toneClassName: "text-[#6fd4ff]",
        iconClassName: "text-[#8de2ff]",
        Icon: ArrowLeft,
      };
    case "A-lean":
      return {
        pillClassName: "border-[#82cfff]/18 bg-[#82cfff]/10 text-[#b5ebff]",
        toneClassName: "text-[#82cfff]",
        iconClassName: "text-[#b5ebff]",
        Icon: Orbit,
      };
    case "mid":
      return {
        pillClassName: "border-[#d5b8ff]/18 bg-[#d5b8ff]/10 text-[#f2ddff]",
        toneClassName: "text-[#d7b8ff]",
        iconClassName: "text-[#f2ddff]",
        Icon: Minus,
      };
    case "B-lean":
      return {
        pillClassName: "border-[#f2b8ff]/18 bg-[#f2b8ff]/10 text-[#f8dfff]",
        toneClassName: "text-[#efc0ff]",
        iconClassName: "text-[#f8dfff]",
        Icon: Sparkles,
      };
    case "B":
      return {
        pillClassName: "border-[#ffb69a]/20 bg-[#ffb69a]/10 text-[#ffd7c9]",
        toneClassName: "text-[#ffb69a]",
        iconClassName: "text-[#ffd7c9]",
        Icon: ArrowRight,
      };
    default: {
      const movieIcons: LucideIcon[] = [Orbit, Sparkles, ArrowLeft, ArrowRight];
      return {
        pillClassName: "border-white/12 bg-white/[0.06] text-white/72",
        toneClassName: "text-white/64",
        iconClassName: "text-white/76",
        Icon: movieIcons[index % movieIcons.length],
      };
    }
  }
}

function optionBadgeText(
  question: GuestQuestion,
  optionKey: string,
  index: number,
  copy: QuizAnswerDeckCopy
) {
  if (question.kind !== "mbti") {
    return `${copy.optionPrefix} ${String.fromCharCode(65 + index)}`;
  }

  const leftTrait = question.poles?.left.traitCode ?? "A";
  const rightTrait = question.poles?.right.traitCode ?? "B";

  switch (optionKey) {
    case "A":
      return `${leftTrait} · ${copy.strong}`;
    case "A-lean":
      return `${leftTrait} · ${copy.lean}`;
    case "mid":
      return copy.balancedMid;
    case "B-lean":
      return `${rightTrait} · ${copy.lean}`;
    case "B":
      return `${rightTrait} · ${copy.strong}`;
    default:
      return optionKey;
  }
}

export function QuizAnswerDeck({
  question,
  activeOptionKey,
  disabled,
  onSelect,
  answerDeckCopy,
  scaleLabel = "5-level scale",
}: {
  question: GuestQuestion;
  activeOptionKey: string | null;
  disabled?: boolean;
  onSelect: (optionKey: string) => void;
  answerDeckCopy: QuizAnswerDeckCopy;
  scaleLabel?: string;
}) {
  const reducedMotion = useMbtiZReducedMotion();
  const isCoreQuestion = question.kind === "mbti";
  const options = sortQuestionOptions(question);

  return (
    <fieldset className="mx-auto max-w-[1280px]">
      <legend className="sr-only">{question.prompt}</legend>

      {isCoreQuestion && question.poles ? (
        <div className="mb-5 flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="rounded-full border border-[#6fd4ff]/16 bg-[#6fd4ff]/8 px-4 py-2 font-code text-[10px] uppercase tracking-[0.22em] text-[#a8e9ff]">
            {question.poles.left.traitCode} · {question.poles.left.label}
          </div>
          <div className="font-code text-[10px] uppercase tracking-[0.28em] text-white/36">
            {scaleLabel}
          </div>
          <div className="rounded-full border border-[#ffb69a]/16 bg-[#ffb69a]/8 px-4 py-2 font-code text-[10px] uppercase tracking-[0.22em] text-[#ffd9ce]">
            {question.poles.right.traitCode} · {question.poles.right.label}
          </div>
        </div>
      ) : null}

      <RadioGroup
        className={cn(
          "grid gap-4 md:gap-6",
          isCoreQuestion
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-5 xl:items-stretch"
            : "grid-cols-1 md:grid-cols-2"
        )}
        disabled={disabled}
        name={question.key}
        onValueChange={onSelect}
        value={activeOptionKey ?? ""}
      >
        {options.map((option, index) => {
          const selected = activeOptionKey === option.key;
          const visual = optionVisual(option.key, index);

          return (
            <motion.div
              key={option.id}
              layout
              animate={{
                opacity: disabled ? 0.72 : 1,
                scale: selected ? resolveMotionScale(reducedMotion, 1.01) : 1,
                y: selected ? -resolveMotionDistance(reducedMotion, 6) : 0,
              }}
              className={cn("relative", optionGridClass(question, option.key))}
              transition={
                reducedMotion
                  ? { duration: resolveMotionDuration(reducedMotion, 0.2) }
                  : { type: "spring", stiffness: 240, damping: 22 }
              }
              whileHover={disabled || reducedMotion ? undefined : { y: -3 }}
              whileTap={disabled || reducedMotion ? undefined : { scale: 0.992 }}
            >
              <RadioGroupItem
                className={cn(
                  "group relative z-10 flex h-full w-full flex-col overflow-hidden rounded-[1.7rem] border bg-[linear-gradient(180deg,rgba(20,23,36,0.95),rgba(11,13,23,0.94))] p-6 text-left shadow-[0_24px_80px_rgba(2,4,12,0.34)] transition duration-200 md:p-7",
                  isCoreQuestion
                    ? option.key === "mid"
                      ? "min-h-[132px] md:min-h-[144px] xl:min-h-[240px]"
                      : "min-h-[168px] md:min-h-[182px] xl:min-h-[240px]"
                    : "min-h-[176px] md:min-h-[188px]",
                  selected
                    ? "border-[#d8b9ff]/36 bg-[linear-gradient(180deg,rgba(28,30,46,0.98),rgba(14,16,28,0.96))] shadow-[0_30px_100px_rgba(6,8,18,0.42),0_0_0_1px_rgba(216,185,255,0.12)_inset]"
                    : "border-white/10 hover:border-white/18 hover:bg-[linear-gradient(180deg,rgba(24,27,42,0.98),rgba(14,16,28,0.95))]",
                  disabled && "pointer-events-none"
                )}
                id={option.id}
                indicatorClassName="hidden"
                value={option.key}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_38%)] opacity-70" />
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-60",
                    selected && "via-[#d8b9ff]/44"
                  )}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-code text-[10px] uppercase tracking-[0.22em] xl:px-3 xl:py-1.5 xl:text-[9px]",
                    visual.pillClassName
                  )}
                >
                  {optionBadgeText(question, option.key, index, answerDeckCopy)}
                </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition",
                      selected ? "border-[#d8b9ff]/26 bg-[#d8b9ff]/10" : "",
                      visual.iconClassName
                    )}
                  >
                    {selected ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <visual.Icon className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex flex-1 flex-col justify-between xl:mt-7">
                  <div>
                    <p className={cn("font-code text-[10px] uppercase tracking-[0.24em]", visual.toneClassName)}>
                      {option.metaLabel ?? option.traitCode ?? question.dimension}
                    </p>
                    <p className="mt-3 max-w-[28rem] text-[1rem] leading-7 text-white/92 sm:text-[1.05rem] xl:text-[0.95rem] xl:leading-6">
                      {option.label}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="h-px w-full bg-white/10" />
                    <div className="mt-4 flex items-center justify-between gap-3 font-code text-[10px] uppercase tracking-[0.22em] text-white/34">
                      <span>{answerDeckCopy.tapToSelect}</span>
                      <span className={selected ? "text-[#f6e0ff]" : ""}>
                        {selected ? answerDeckCopy.selected : answerDeckCopy.ready}
                      </span>
                    </div>
                  </div>
                </div>
              </RadioGroupItem>
            </motion.div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
