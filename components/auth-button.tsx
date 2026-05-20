"use client";

import { signIn, signOut, useSession } from "next-auth/react";

type AuthButtonProps = {
  betaReviewMode?: boolean;
};

export function AuthButton({ betaReviewMode = false }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="rounded border border-cypress/15 px-3 py-2 text-sm font-black text-cypress/50">
        Checking...
      </span>
    );
  }

  if (session?.user) {
    return (
      <button
        className="rounded border border-cypress/15 bg-white px-3 py-2 text-sm font-black text-cypress hover:border-vermilion hover:text-vermilion"
        onClick={() => signOut()}
        type="button"
      >
        Logout
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {betaReviewMode ? (
        <span className="hidden rounded bg-vermilion/10 px-3 py-2 text-xs font-black uppercase text-vermilion sm:inline-flex">
          Beta mode
        </span>
      ) : null}
      <button
        className="rounded border border-cypress/15 bg-white px-3 py-2 text-sm font-black text-cypress hover:border-vermilion hover:text-vermilion"
        onClick={() => signIn("google")}
        type="button"
      >
        Login
      </button>
    </div>
  );
}
