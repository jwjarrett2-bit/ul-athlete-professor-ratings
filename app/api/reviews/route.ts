import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ReviewPayload = {
  professorId?: unknown;
  sport?: unknown;
  courseTaken?: unknown;
  semesterTaken?: unknown;
  overallRecommendation?: unknown;
  athleteFriendliness?: unknown;
  flexibility?: unknown;
  workload?: unknown;
  attendanceStrictness?: unknown;
  communication?: unknown;
  wouldTakeAgain?: unknown;
  comment?: unknown;
};

function parseScore(value: unknown) {
  const score = Number(value);
  if (!Number.isInteger(score) || score < 1 || score > 5) return null;
  return score;
}

function cleanOptional(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed.slice(0, 80) : null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Log in with Google before submitting a review." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as ReviewPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Rating details were not readable." }, { status: 400 });
  }

  const professorId = typeof payload.professorId === "string" ? payload.professorId : "";
  const sport = cleanOptional(payload.sport);
  const courseTaken = cleanOptional(payload.courseTaken);
  const semesterTaken = cleanOptional(payload.semesterTaken);
  const overallRecommendation = parseScore(payload.overallRecommendation);
  const athleteFriendliness = parseScore(payload.athleteFriendliness);
  const flexibility = parseScore(payload.flexibility);
  const workload = parseScore(payload.workload);
  const attendanceStrictness = parseScore(payload.attendanceStrictness);
  const communication = parseScore(payload.communication);
  const comment = typeof payload.comment === "string" ? payload.comment.trim() : "";

  if (!sport || !courseTaken || !semesterTaken) {
    return NextResponse.json({ error: "Sport, course, and semester are required." }, { status: 400 });
  }

  if (!overallRecommendation || !athleteFriendliness || !flexibility || !workload || !attendanceStrictness || !communication) {
    return NextResponse.json({ error: "All six rating scores must be between 1 and 5." }, { status: 400 });
  }

  if (comment.length < 20) {
    return NextResponse.json(
      { error: "Write at least 20 characters so other athletes get useful context." },
      { status: 400 }
    );
  }

  const duplicateReview = await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      professorId,
      courseTaken
    },
    select: { id: true }
  });

  if (duplicateReview) {
    return NextResponse.json(
      { error: "You already reviewed this professor for that course." },
      { status: 409 }
    );
  }

  const professor = await prisma.professor.findFirst({
    where: { id: professorId, status: "approved" }
  });

  if (!professor) {
    return NextResponse.json({ error: "Professor not found." }, { status: 404 });
  }

  await prisma.review.create({
    data: {
      professorId: professor.id,
      userId: session.user.id,
      sport,
      courseTaken,
      semesterTaken,
      overallRecommendation,
      athleteFriendliness,
      flexibility,
      workload,
      attendanceStrictness,
      communication,
      wouldTakeAgain: payload.wouldTakeAgain !== "false",
      comment: comment.slice(0, 1200),
      status: "visible"
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
