import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ReportReviewRouteProps = {
  params: Promise<{ reviewId: string }>;
};

const reportReasons = new Set(["inappropriate", "spam", "false-info", "personal-attack", "other"]);

export async function POST(request: Request, { params }: ReportReviewRouteProps) {
  const { reviewId } = await params;
  const payload = (await request.json().catch(() => null)) as { reason?: unknown } | null;
  const reason = typeof payload?.reason === "string" && reportReasons.has(payload.reason)
    ? payload.reason
    : "other";

  if (!reviewId) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status: "reported", reportReason: reason },
    select: {
      professorId: true
    }
  }).catch(() => null);

  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  revalidatePath(`/professors/${review.professorId}`);
  revalidatePath("/admin/reviews");

  return NextResponse.json({ ok: true }, { status: 200 });
}
