"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

type SearchBoxProps = {
  placeholder?: string;
  buttonLabel?: string;
};

export function SearchBox({
  placeholder = "Search by professor, department, or college",
  buttonLabel = "Search"
}: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`/professors?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="professor-search">
        Search professors
      </label>
      <input
        id="professor-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 flex-1 rounded border border-cypress/15 bg-white px-4 text-base font-medium text-cypress outline-none ring-vermilion/20 transition placeholder:text-cypress/40 focus:border-vermilion focus:ring-4"
        type="search"
      />
      <button
        className="min-h-12 rounded bg-vermilion px-5 font-black text-white transition hover:bg-vermilion/90"
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
