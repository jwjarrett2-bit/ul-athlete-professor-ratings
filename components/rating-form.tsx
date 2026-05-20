"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const ratingFields = [
  ["overallRecommendation", "Recommend to teammates"],
  ["athleteFriendliness", "Understands athlete schedule"],
  ["flexibility", "Makeup work flexibility"],
  ["workload", "Manageable workload"],
  ["attendanceStrictness", "Attendance strictness"],
  ["communication", "Clear communication"]
] as const;

type RatingFormProps = {
  professorId: string;
  betaReviewMode?: boolean;
};

export function RatingForm({ professorId, betaReviewMode = false }: RatingFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, professorId })
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(body?.error ?? "Something went wrong while saving this rating.");
      return;
    }

    form.reset();
    setStatus("saved");
    setMessage("Rating added. Your teammate-level intel is now on this profile.");
    router.push(`/professors/${professorId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded border border-cypress/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-vermilion">Add athlete rating</p>
        <h2 className="mt-1 text-2xl font-black leading-tight text-cypress">Would you recommend this professor to another athlete?</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-cypress/60">
          Rate the parts of class that matter during travel weeks, practice blocks, and game days.
        </p>
        {betaReviewMode ? (
          <div className="mt-4 rounded border border-vermilion/20 bg-vermilion/5 p-3 text-sm font-bold leading-6 text-cypress">
            Beta mode is on: reviews can be submitted without Google login while the pilot is being tested.
          </div>
        ) : null}
        <div className="mt-4 rounded border border-cypress/10 bg-paper p-3 text-sm font-semibold leading-6 text-cypress/70">
          Keep it useful for teammates: focus on class experience, avoid personal attacks, do not share
          private information, and be honest about what happened.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Course code</span>
          <input
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 outline-none focus:border-vermilion"
            name="courseTaken"
            placeholder="BIOL 110"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Term taken</span>
          <input
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 outline-none focus:border-vermilion"
            name="semesterTaken"
            placeholder="Spring 2026"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Sport</span>
          <input
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 outline-none focus:border-vermilion"
            name="sport"
            placeholder="Basketball"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Take again?</span>
          <select
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 outline-none focus:border-vermilion"
            name="wouldTakeAgain"
            defaultValue="true"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3">
        {ratingFields.map(([name, label]) => (
          <label key={name} className="grid gap-2 rounded bg-paper p-3 sm:grid-cols-[220px_1fr_48px] sm:items-center">
            <span className="text-sm font-bold text-cypress">{label}</span>
            <input name={name} type="range" min="1" max="5" defaultValue="4" className="accent-vermilion" />
            <span className="text-xs font-black uppercase text-cypress/55">1-5</span>
          </label>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-bold text-cypress/70">Written review</span>
        <textarea
          className="mt-1 min-h-32 w-full rounded border border-cypress/15 bg-white px-3 py-2 outline-none focus:border-vermilion"
          name="comment"
          placeholder="Tell other athletes what to expect around travel, missed class, makeup work, and communication."
          required
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="min-h-11 rounded bg-vermilion px-5 font-black text-white transition hover:bg-vermilion/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "saving"}
          type="submit"
        >
          {status === "saving" ? "Saving..." : "Submit Rating"}
        </button>
        {message ? (
          <p className={status === "error" ? "text-sm font-bold text-vermilion" : "text-sm font-bold text-cypress/70"}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
