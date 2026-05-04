export type RatingReview = {
  id?: string;
  overallRecommendation: number;
  athleteFriendliness: number;
  flexibility: number;
  workload: number;
  attendanceStrictness: number;
  communication: number;
  wouldTakeAgain: boolean;
  courseTaken: string;
  semesterTaken: string;
  sport?: string | null;
  comment: string;
  status?: "visible" | "reported" | "hidden" | string;
};

export type RatingScoreKey =
  | "overallRecommendation"
  | "athleteFriendliness"
  | "flexibility"
  | "workload"
  | "attendanceStrictness"
  | "communication";

export type ProfessorWithReviews = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title?: string | null;
  department: string;
  college: string;
  email?: string | null;
  sourceUrl?: string | null;
  status?: string;
  reviews: RatingReview[];
};

export function reviewAverage(review: RatingReview) {
  return roundScore(
    (review.flexibility +
      review.workload +
      review.attendanceStrictness +
      review.communication +
      review.overallRecommendation +
      review.athleteFriendliness) /
      6
  );
}

export function averageFor(reviews: RatingReview[], key: RatingScoreKey) {
  if (!reviews.length) return 0;
  return roundScore(reviews.reduce((sum, review) => sum + review[key], 0) / reviews.length);
}

export function athleteFitScore(reviews: RatingReview[]) {
  if (!reviews.length) return 0;
  return averageFor(reviews, "overallRecommendation");
}

export function roundScore(value: number) {
  return Math.round(value * 10) / 10;
}

export function ratingLabel(score: number) {
  if (score >= 4.5) return "Top pick";
  if (score >= 4) return "Athlete-friendly";
  if (score >= 3) return "Plan ahead";
  if (score > 0) return "High caution";
  return "Needs reviews";
}

export function ratingTone(score: number) {
  if (score >= 4.5) return "Great fit for season";
  if (score >= 4) return "Strong athlete fit";
  if (score >= 3) return "Ask teammates first";
  if (score > 0) return "Use caution";
  return "No athlete intel yet";
}
