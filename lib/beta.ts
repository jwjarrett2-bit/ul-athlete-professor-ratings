export function isBetaReviewModeEnabled() {
  return process.env.BETA_REVIEW_MODE === "true";
}
