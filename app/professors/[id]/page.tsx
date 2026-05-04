import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportReviewButton } from "@/components/report-review-button";
import { ScoreBadge } from "@/components/score-badge";
import { getProfessorById } from "@/lib/professors";
import { athleteFitScore, averageFor, reviewAverage } from "@/lib/ratings";

type ProfessorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  const { id } = await params;
  const professor = await getProfessorById(id);

  if (!professor) notFound();

  const reviews = professor.reviews;
  const professorId = professor.id;
  const athleteRecommendation = athleteFitScore(reviews);
  const wouldTakeAgainPercentage = reviews.length
    ? Math.round((reviews.filter((review) => review.wouldTakeAgain).length / reviews.length) * 100)
    : 0;
  const categories = [
    ["Overall recommendation", "overallRecommendation" as const],
    ["Athlete friendliness", "athleteFriendliness" as const],
    ["Flexibility", "flexibility" as const],
    ["Workload", "workload" as const],
    ["Attendance strictness", "attendanceStrictness" as const],
    ["Communication", "communication" as const]
  ] as const;

  return (
    <main>
      <section className="border-b border-cypress/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
          <Link className="text-sm font-bold text-vermilion" href="/professors">
            Back to professor search
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase text-vermilion">{professor.department}</p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-cypress sm:text-5xl">{professor.fullName}</h1>
              <p className="mt-2 text-lg font-semibold text-cypress/70">
                {professor.title ?? "Professor"} · {professor.college}
              </p>
              <p className="mt-5 max-w-3xl leading-7 text-cypress/70">
                Athlete-focused professor profile with averages for flexibility, attendance,
                workload, communication, and overall recommendation.
              </p>
              <Link
                className="mt-6 inline-flex rounded bg-vermilion px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-vermilion/90"
                href={`/review/${professorId}`}
              >
                Leave Review
              </Link>
            </div>
            <ScoreBadge score={athleteRecommendation} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
            <span className="text-sm font-black uppercase text-vermilion">Athlete recommendation</span>
            <strong className="mt-2 block text-4xl text-cypress">
              {athleteRecommendation ? athleteRecommendation.toFixed(1) : "--"}
            </strong>
          </div>
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
            <span className="text-sm font-black uppercase text-vermilion">Would take again</span>
            <strong className="mt-2 block text-4xl text-cypress">
              {reviews.length ? `${wouldTakeAgainPercentage}%` : "--"}
            </strong>
          </div>
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
            <span className="text-sm font-black uppercase text-vermilion">Total reviews</span>
            <strong className="mt-2 block text-4xl text-cypress">{reviews.length}</strong>
          </div>
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
            <span className="text-sm font-black uppercase text-vermilion">Flexibility</span>
            <strong className="mt-2 block text-4xl text-cypress">
              {averageFor(reviews, "flexibility") ? averageFor(reviews, "flexibility").toFixed(1) : "--"}
            </strong>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 sm:px-5 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit rounded border border-cypress/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-cypress">Average Scores</h2>
          <div className="mt-5 space-y-4">
            {categories.map(([label, key]) => {
              const score = averageFor(reviews, key);
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm font-bold">
                    <span className="text-cypress/70">{label}</span>
                    <span className="text-cypress">{score ? score.toFixed(1) : "--"}</span>
                  </div>
                  <div className="h-2 rounded bg-cypress/10">
                    <div
                      className="h-2 rounded bg-vermilion"
                      style={{ width: `${Math.max((score / 5) * 100, score ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between border-b border-cypress/10 pb-3">
            <h2 className="text-2xl font-black text-cypress">Athlete Reviews</h2>
            <span className="text-sm font-bold text-cypress/60">
              {reviews.length} {reviews.length === 1 ? "rating" : "ratings"}
            </span>
          </div>

          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <article key={review.id ?? `${review.courseTaken}-${index}`} className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-cypress">{review.courseTaken}</p>
                      <p className="text-sm font-semibold text-cypress/60">
                        {review.semesterTaken} · {review.sport}
                      </p>
                    </div>
                    <span className="rounded bg-vermilion/10 px-3 py-1 text-sm font-black text-vermilion">
                      {reviewAverage(review).toFixed(1)} average
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs font-bold text-cypress/70 sm:grid-cols-3">
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Rec {review.overallRecommendation}/5
                    </span>
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Friendly {review.athleteFriendliness}/5
                    </span>
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Flex {review.flexibility}/5
                    </span>
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Workload {review.workload}/5
                    </span>
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Attendance {review.attendanceStrictness}/5
                    </span>
                    <span className="rounded bg-cypress/5 px-2.5 py-1">
                      Comm {review.communication}/5
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-cypress/60">
                    {review.wouldTakeAgain ? "Would take again" : "Would not take again"}
                  </p>
                  <p className="mt-4 leading-7 text-cypress/75">
                    {review.comment}
                  </p>
                  {review.id ? (
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-cypress/10 pt-4">
                      <p className="max-w-md text-xs font-bold leading-5 text-cypress/45">
                        {review.status === "reported" ? "This review has been reported and is waiting for admin review." : "Help keep reviews useful for athletes."}
                      </p>
                      <ReportReviewButton reviewId={review.id} initialStatus={review.status} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded border border-cypress/10 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black text-cypress">No athlete reviews yet</h3>
              <p className="mt-2 max-w-lg text-cypress/65">
                Be the first to share athlete-specific notes about travel, workload, and communication.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center rounded bg-vermilion px-5 font-black text-white"
                href={`/review/${professorId}`}
              >
                Leave Review
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
