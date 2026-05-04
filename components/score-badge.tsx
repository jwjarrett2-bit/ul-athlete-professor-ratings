import { ratingLabel } from "@/lib/ratings";

export function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded border border-cypress/10 bg-white shadow-sm ring-4 ring-field-gold/60">
      <span className="text-3xl font-black text-cypress">{score ? score.toFixed(1) : "--"}</span>
      <span className="mt-1 max-w-20 text-center text-[10px] font-black uppercase leading-tight text-vermilion">
        {ratingLabel(score)}
      </span>
    </div>
  );
}
