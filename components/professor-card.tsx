import Link from "next/link";
import { athleteFitScore, averageFor, ratingTone, type RatingReview } from "@/lib/ratings";
import { ScoreBadge } from "@/components/score-badge";

type ProfessorCardProps = {
  professor: {
    id: string;
    fullName: string;
    title?: string | null;
    department: string;
    college: string;
    reviews: RatingReview[];
  };
};

export function ProfessorCard({ professor }: ProfessorCardProps) {
  const athleteRecommendation = athleteFitScore(professor.reviews);
  const flexibility = averageFor(professor.reviews, "flexibility");

  return (
    <Link
      href={`/professors/${professor.id}`}
      className="group grid gap-5 rounded border border-cypress/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-vermilion/50 hover:shadow-soft sm:grid-cols-[1fr_auto]"
    >
      <div className="min-w-0">
        <p className="inline-flex rounded bg-vermilion/10 px-2.5 py-1 text-xs font-black uppercase text-vermilion">
          {professor.department}
        </p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-cypress">{professor.fullName}</h2>
        <p className="mt-1 text-sm font-medium text-cypress/70">{professor.title ?? "Professor"}</p>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-cypress/70">
          {professor.college}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-cypress/75">
          <span className="rounded bg-vermilion/10 px-2.5 py-1 text-vermilion">
            Athlete rec {athleteRecommendation || "--"}
          </span>
          <span className="rounded bg-cypress/5 px-2.5 py-1">
            Flex {flexibility || "--"}
          </span>
          <span className="rounded bg-cypress/5 px-2.5 py-1">
            {professor.reviews.length} reviews
          </span>
        </div>
        <p className="mt-4 text-sm font-bold text-cypress/55">{ratingTone(athleteRecommendation)}</p>
      </div>
      <ScoreBadge score={athleteRecommendation} />
    </Link>
  );
}
