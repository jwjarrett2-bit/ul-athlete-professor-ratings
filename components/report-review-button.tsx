"use client";

import { useState } from "react";

type ReportReviewButtonProps = {
  reviewId: string;
  initialStatus?: string | null;
};

export function ReportReviewButton({ reviewId, initialStatus }: ReportReviewButtonProps) {
  const [status, setStatus] = useState(initialStatus ?? "visible");
  const [reason, setReason] = useState("inappropriate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isReported = status === "reported";

  async function reportReview() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch(`/api/reviews/${reviewId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });

    if (response.ok) {
      setStatus("reported");
    } else {
      setError("Could not report this review.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {!isReported ? (
        <select
          className="min-h-9 rounded border border-cypress/15 bg-white px-2 text-xs font-bold text-cypress"
          onChange={(event) => setReason(event.target.value)}
          value={reason}
        >
          <option value="inappropriate">Inappropriate</option>
          <option value="spam">Spam</option>
          <option value="false-info">False info</option>
          <option value="personal-attack">Personal attack</option>
          <option value="other">Other</option>
        </select>
      ) : null}
      <button
        className="rounded border border-cypress/15 px-3 py-1.5 text-xs font-black text-cypress transition hover:border-vermilion hover:text-vermilion disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting || isReported}
        onClick={reportReview}
        type="button"
      >
        {isReported ? "Reported" : isSubmitting ? "Reporting..." : "Report Review"}
      </button>
      {error ? <span className="text-xs font-bold text-vermilion">{error}</span> : null}
    </div>
  );
}
