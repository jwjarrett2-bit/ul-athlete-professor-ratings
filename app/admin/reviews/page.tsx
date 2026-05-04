import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ReviewStatus } from "@prisma/client";
import { AdminRequiredMessage } from "@/components/admin-required-message";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { reviewAverage } from "@/lib/ratings";

type AdminReviewsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

const statusOptions = ["reported", "visible", "hidden", "all"] as const;

function statusLabel(status: string) {
  if (status === "reported") return "Reported";
  if (status === "hidden") return "Hidden";
  return "Visible";
}

function reportReasonLabel(reason?: string | null) {
  if (reason === "spam") return "Spam";
  if (reason === "false-info") return "False info";
  if (reason === "personal-attack") return "Personal attack";
  if (reason === "other") return "Other";
  return "Inappropriate";
}

async function updateReviewModeration(formData: FormData) {
  "use server";

  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return;

  const reviewIdValue = formData.get("reviewId");
  const statusValue = formData.get("status");
  const reviewId = typeof reviewIdValue === "string" ? reviewIdValue : "";
  const status = typeof statusValue === "string" ? statusValue : "";

  if (!reviewId || (status !== "visible" && status !== "hidden")) return;

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status: status as ReviewStatus },
    select: {
      professorId: true
    }
  }).catch(() => null);

  if (!review) return;

  revalidatePath("/admin/reviews");
  revalidatePath(`/professors/${review.professorId}`);
  revalidatePath("/professors");
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return <AdminRequiredMessage />;

  const { status = "reported" } = await searchParams;
  const selectedStatus: (typeof statusOptions)[number] = statusOptions.includes(status as (typeof statusOptions)[number])
    ? (status as (typeof statusOptions)[number])
    : "reported";
  const reviews = await prisma.review.findMany({
    where: selectedStatus === "all" ? undefined : { status: selectedStatus as ReviewStatus },
    include: {
      professor: {
        select: {
          id: true,
          fullName: true,
          department: true
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-vermilion">Admin</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-cypress sm:text-4xl">Review moderation</h1>
        <p className="mt-3 max-w-2xl leading-7 text-cypress/70">
          Reported reviews stay public until an admin hides them. Hidden reviews do not count in
          public professor ratings.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Link
            className={`rounded border px-4 py-2 text-sm font-black ${
              selectedStatus === option
                ? "border-vermilion bg-vermilion text-white"
                : "border-cypress/15 bg-white text-cypress"
            }`}
            href={`/admin/reviews?status=${option}`}
            key={option}
          >
            {option === "all" ? "All" : statusLabel(option)}
          </Link>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 border-b border-cypress/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-cypress">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
        <Link className="text-sm font-black text-vermilion" href="/professors">
          Back to professor search
        </Link>
      </div>

      {reviews.length ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article className="rounded border border-cypress/10 bg-white p-5 shadow-sm" key={review.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-field-gold/30 px-2.5 py-1 text-xs font-black text-cypress">
                      {statusLabel(review.status)}
                    </span>
                    {review.status === "reported" ? (
                      <span className="rounded bg-vermilion/10 px-2.5 py-1 text-xs font-black text-vermilion">
                        {reportReasonLabel(review.reportReason)}
                      </span>
                    ) : null}
                    <span className="text-xs font-bold text-cypress/55">
                      {review.createdAt.toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-cypress">{review.professor.fullName}</h2>
                  <p className="mt-1 text-sm font-semibold text-cypress/60">
                    {review.professor.department} · {review.courseTaken} · {review.semesterTaken} · {review.sport}
                  </p>
                  <p className="mt-1 text-xs font-bold text-cypress/45">
                    Submitted by {review.user?.name ?? review.user?.email ?? "Legacy anonymous review"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.status !== "hidden" ? (
                    <form action={updateReviewModeration}>
                      <input name="reviewId" type="hidden" value={review.id} />
                      <input name="status" type="hidden" value="hidden" />
                      <button className="min-h-10 rounded bg-cypress px-4 text-sm font-black text-white" type="submit">
                        Hide
                      </button>
                    </form>
                  ) : null}

                  {review.status !== "visible" ? (
                    <form action={updateReviewModeration}>
                      <input name="reviewId" type="hidden" value={review.id} />
                      <input name="status" type="hidden" value="visible" />
                      <button className="min-h-10 rounded border border-cypress/15 px-4 text-sm font-black text-cypress" type="submit">
                        Restore
                      </button>
                    </form>
                  ) : null}

                  <Link
                    className="inline-flex min-h-10 items-center rounded border border-cypress/15 px-4 text-sm font-black text-cypress"
                    href={`/professors/${review.professor.id}`}
                  >
                    View Professor
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-xs font-bold text-cypress/70 sm:grid-cols-3 lg:grid-cols-6">
                <span className="rounded bg-cypress/5 px-2.5 py-1">Avg {reviewAverage(review).toFixed(1)}</span>
                <span className="rounded bg-cypress/5 px-2.5 py-1">Rec {review.overallRecommendation}/5</span>
                <span className="rounded bg-cypress/5 px-2.5 py-1">Friendly {review.athleteFriendliness}/5</span>
                <span className="rounded bg-cypress/5 px-2.5 py-1">Flex {review.flexibility}/5</span>
                <span className="rounded bg-cypress/5 px-2.5 py-1">Work {review.workload}/5</span>
                <span className="rounded bg-cypress/5 px-2.5 py-1">Comm {review.communication}/5</span>
              </div>

              <p className="mt-4 leading-7 text-cypress/75">{review.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded border border-cypress/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-cypress">No reviews here</h2>
          <p className="mx-auto mt-2 max-w-md text-cypress/65">
            Try another moderation status, or check back after athletes submit more course intel.
          </p>
        </div>
      )}
    </main>
  );
}
