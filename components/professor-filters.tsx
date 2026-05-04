"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type ProfessorFiltersProps = {
  departments: string[];
};

export function ProfessorFilters({ departments }: ProfessorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [department, setDepartment] = useState(searchParams.get("department") ?? "all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "athleteRecommendation");
  const [isUpdating, setIsUpdating] = useState(false);

  const resultsUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (department !== "all") params.set("department", department);
    if (sort !== "athleteRecommendation") params.set("sort", sort);

    const queryString = params.toString();
    return queryString ? `/professors?${queryString}` : "/professors";
  }, [department, query, sort]);

  useEffect(() => {
    setIsUpdating(true);
    const timeout = window.setTimeout(() => {
      router.replace(resultsUrl);
      setIsUpdating(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [resultsUrl, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(resultsUrl);
  }

  return (
    <form onSubmit={onSubmit} className="rounded border border-cypress/10 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_190px_auto]">
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Search by professor name</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by professor name"
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none ring-vermilion/20 transition placeholder:text-cypress/40 focus:border-vermilion focus:ring-4"
            type="search"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Department</span>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none focus:border-vermilion"
          >
            <option value="all">All departments</option>
            {departments.map((departmentName) => (
              <option key={departmentName} value={departmentName}>
                {departmentName}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-cypress/70">Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none focus:border-vermilion"
          >
            <option value="athleteRecommendation">Highest athlete recommendation</option>
            <option value="flexibility">Highest flexibility</option>
            <option value="workload">Lowest workload</option>
            <option value="reviews">Most reviews</option>
          </select>
        </label>
        <div className="flex gap-2 self-end">
          <button className="min-h-11 flex-1 rounded bg-vermilion px-5 font-black text-white transition hover:bg-vermilion/90" type="submit">
            Search
          </button>
          <button
            className="min-h-11 rounded border border-cypress/15 px-4 font-black text-cypress"
            onClick={() => {
              setQuery("");
              setDepartment("all");
              setSort("athleteRecommendation");
            }}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-cypress/55" aria-live="polite">
        {isUpdating ? "Updating athlete recommendations..." : "Results update automatically as you type."}
      </p>
    </form>
  );
}
