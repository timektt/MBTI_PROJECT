import { AnimalPortrait } from "@/components/mbti-z/animal-portrait";
import { HouseBadge } from "@/components/mbti-z/house-badge";

export function TypeCard({
  code,
  archetypeName,
  houseTitle,
  animalName,
  summary,
  fit,
  accentFrom,
  accentTo,
  imagePath,
  priority = false,
  fitLabel,
  animalLabel,
  summaryLabel,
}: {
  code: string;
  archetypeName: string;
  houseTitle: string;
  animalName: string;
  summary: string;
  fit: string;
  accentFrom: string;
  accentTo: string;
  imagePath: string;
  priority?: boolean;
  fitLabel: string;
  animalLabel: string;
  summaryLabel: string;
}) {
  return (
    <article className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
        <AnimalPortrait
          accentFrom={accentFrom}
          accentTo={accentTo}
          alt={`${code} ${animalName}`}
          imagePath={imagePath}
          priority={priority}
          ratio="square"
          className="h-28 w-28 rounded-[1.15rem] sm:h-32 sm:w-32"
        />

        <div className="min-w-0">
          <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/42">
            {summaryLabel}
          </p>
          <h3 className="mt-2 font-editorial text-[1.55rem] leading-none text-white sm:text-[1.9rem]">
            {code}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#f5c76d] sm:text-[15px]">
            {archetypeName}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <HouseBadge accentFrom={accentFrom} accentTo={accentTo} label={houseTitle} />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.16em] text-white/60">
              {animalLabel} · {animalName}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-white/68 line-clamp-2">{summary}</p>

          <div className="mt-3 border-t border-white/8 pt-3">
            <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/40">
              {fitLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/62 line-clamp-2">{fit}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
