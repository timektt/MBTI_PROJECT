"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import {
  resolveMotionDistance,
  resolveMotionDuration,
  resolveMotionScale,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { GuestQuestion } from "@/lib/assessment-runtime";
import { cn } from "@/lib/utils";

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
  if (question.kind !== "mbti") return question.options;

  return [...question.options].sort(
    (left, right) =>
      CORE_OPTION_ORDER.indexOf(left.key) - CORE_OPTION_ORDER.indexOf(right.key)
  );
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

function CoreAnswerScale({
  question,
  activeOptionKey,
  disabled,
  onSelect,
  answerDeckCopy,
  scaleLabel,
}: {
  question: GuestQuestion;
  activeOptionKey: string | null;
  disabled?: boolean;
  onSelect: (optionKey: string) => void;
  answerDeckCopy: QuizAnswerDeckCopy;
  scaleLabel: string;
}) {
  const reducedMotion = useMbtiZReducedMotion();
  const options = sortQuestionOptions(question);

  return (
    <fieldset className="mx-auto w-full max-w-[760px]">
      <legend className="sr-only">{question.prompt}</legend>

      {question.poles ? (
        <div className="mb-5 grid grid-cols-2 gap-5 sm:mb-7 sm:gap-10">
          <div>
            <p className="text-xs font-bold text-[#8fd7d0]">
              {question.poles.left.traitCode}
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--signal-text-soft)] sm:text-base sm:leading-6">
              {question.poles.left.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-[var(--signal-accent-soft)]">
              {question.poles.right.traitCode}
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--signal-text-soft)] sm:text-base sm:leading-6">
              {question.poles.right.label}
            </p>
          </div>
        </div>
      ) : null}

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute left-[9%] right-[9%] top-6 h-px bg-[var(--signal-border-strong)] sm:top-8"
        />
        <RadioGroup
          aria-label={scaleLabel}
          className="relative grid grid-cols-5 gap-2 sm:gap-4"
          disabled={disabled}
          name={question.key}
          onValueChange={onSelect}
          value={activeOptionKey ?? ""}
        >
          {options.map((option, index) => {
            const selected = activeOptionKey === option.key;
            const optionLabel = optionBadgeText(
              question,
              option.key,
              index,
              answerDeckCopy
            );

            return (
              <motion.div
                key={option.id}
                animate={{
                  opacity: disabled ? 0.56 : 1,
                  scale: selected ? resolveMotionScale(reducedMotion, 1.04) : 1,
                  y: selected ? -resolveMotionDistance(reducedMotion, 3) : 0,
                }}
                className="flex min-w-0 flex-col items-center"
                transition={{
                  duration: resolveMotionDuration(reducedMotion, 0.18),
                }}
              >
                <RadioGroupItem
                  aria-label={option.label}
                  className={cn(
                    "relative z-10 aspect-square h-auto min-h-12 w-full max-w-[4rem] rounded-full border-2 bg-[var(--signal-canvas-soft)] text-[var(--signal-accent-ink)] shadow-none transition-colors",
                    "hover:border-[var(--signal-accent-soft)] focus-visible:ring-[var(--signal-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--signal-canvas)]",
                    selected
                      ? "border-[var(--signal-accent)] bg-[var(--signal-accent)]"
                      : "border-[var(--signal-border-strong)]",
                    disabled && "pointer-events-none"
                  )}
                  id={option.id}
                  indicatorClassName="hidden"
                  value={option.key}
                >
                  {selected ? <Check className="mx-auto h-5 w-5 sm:h-6 sm:w-6" /> : null}
                </RadioGroupItem>
                <span
                  className={cn(
                    "mt-2 block min-h-8 text-center text-[10px] font-semibold leading-4 text-[var(--signal-text-muted)] sm:mt-3 sm:text-xs",
                    selected && "text-[var(--signal-text)]"
                  )}
                >
                  {optionLabel}
                </span>
              </motion.div>
            );
          })}
        </RadioGroup>
      </div>
    </fieldset>
  );
}

function MovieAnswerList({
  question,
  activeOptionKey,
  disabled,
  onSelect,
  answerDeckCopy,
}: {
  question: GuestQuestion;
  activeOptionKey: string | null;
  disabled?: boolean;
  onSelect: (optionKey: string) => void;
  answerDeckCopy: QuizAnswerDeckCopy;
}) {
  return (
    <fieldset className="mx-auto w-full max-w-[900px]">
      <legend className="sr-only">{question.prompt}</legend>
      <RadioGroup
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        disabled={disabled}
        name={question.key}
        onValueChange={onSelect}
        value={activeOptionKey ?? ""}
      >
        {question.options.map((option, index) => {
          const selected = activeOptionKey === option.key;

          return (
            <RadioGroupItem
              key={option.id}
              className={cn(
                "flex aspect-auto min-h-16 h-auto w-full items-center gap-4 rounded-[var(--signal-radius-md)] border p-4 text-left shadow-none transition-colors",
                "hover:border-[var(--signal-border-strong)] hover:bg-white/[0.04] focus-visible:ring-[var(--signal-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--signal-canvas)]",
                selected
                  ? "border-[var(--signal-accent)] bg-[rgba(231,181,91,0.09)]"
                  : "border-[var(--signal-border)] bg-[var(--signal-canvas-soft)]",
                disabled && "pointer-events-none"
              )}
              id={option.id}
              indicatorClassName="hidden"
              value={option.key}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  selected
                    ? "border-[var(--signal-accent)] bg-[var(--signal-accent)] text-[var(--signal-accent-ink)]"
                    : "border-[var(--signal-border-strong)] text-[var(--signal-text-soft)]"
                )}
              >
                {selected ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + index)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-[var(--signal-text-muted)]">
                  {answerDeckCopy.optionPrefix} {String.fromCharCode(65 + index)}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--signal-text)] sm:text-[0.9375rem]">
                  {option.label}
                </span>
              </span>
            </RadioGroupItem>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}

export function QuizAnswerDeck({
  question,
  activeOptionKey,
  autoFocus = false,
  disabled,
  onSelect,
  answerDeckCopy,
  scaleLabel = "5-level scale",
}: {
  question: GuestQuestion;
  activeOptionKey: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  onSelect: (optionKey: string) => void;
  answerDeckCopy: QuizAnswerDeckCopy;
  scaleLabel?: string;
}) {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoFocus) return;

    const frame = window.requestAnimationFrame(() => {
      const selectedOption = deckRef.current?.querySelector<HTMLElement>(
        '[data-slot="radio-group-item"][data-state="checked"]'
      );
      const firstOption = deckRef.current?.querySelector<HTMLElement>(
        '[data-slot="radio-group-item"]'
      );

      (selectedOption ?? firstOption)?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [autoFocus, question.key]);

  if (question.kind === "mbti") {
    return (
      <div ref={deckRef} className="w-full">
        <CoreAnswerScale
          activeOptionKey={activeOptionKey}
          answerDeckCopy={answerDeckCopy}
          disabled={disabled}
          onSelect={onSelect}
          question={question}
          scaleLabel={scaleLabel}
        />
      </div>
    );
  }

  return (
    <div ref={deckRef} className="w-full">
      <MovieAnswerList
        activeOptionKey={activeOptionKey}
        answerDeckCopy={answerDeckCopy}
        disabled={disabled}
        onSelect={onSelect}
        question={question}
      />
    </div>
  );
}
