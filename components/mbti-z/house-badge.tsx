import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function HouseBadge({
  label,
  accentFrom,
  accentTo,
  className,
}: {
  label: string;
  accentFrom: string;
  accentTo: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.18em]",
        className
      )}
      style={{
        borderColor: `${accentTo}38`,
        background: `linear-gradient(135deg, ${accentFrom}24, ${accentTo}14)`,
        color: accentTo,
      }}
    >
      <Sparkles className="h-3 w-3" />
      {label}
    </span>
  );
}
