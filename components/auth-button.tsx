"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
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
    <button
      className="rounded border border-cypress/15 bg-white px-3 py-2 text-sm font-black text-cypress hover:border-vermilion hover:text-vermilion"
      onClick={() => signIn("google")}
      type="button"
    >
      Login
    </button>
  );
}
