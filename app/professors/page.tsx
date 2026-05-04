import Link from "next/link";
import { ProfessorFilters } from "@/components/professor-filters";
import { ProfessorCard } from "@/components/professor-card";
import { getProfessorDepartments, getProfessors } from "@/lib/professors";

type ProfessorsPageProps = {
  searchParams: Promise<{ q?: string; department?: string; sort?: string }>;
};

export default async function ProfessorsPage({ searchParams }: ProfessorsPageProps) {
  const { q = "", department = "all", sort = "athleteRecommendation" } = await searchParams;
  const [professors, departments] = await Promise.all([
    getProfessors({ query: q, department, sort }),
    getProfessorDepartments()
  ]);

  const sortLabels: Record<string, string> = {
    athleteRecommendation: "highest athlete recommendation",
    flexibility: "highest flexibility",
    workload: "lowest workload",
    reviews: "most reviews"
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-8">
        <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-vermilion">Professor search</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-cypress sm:text-4xl">
            Search UL professors by athlete fit.
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-cypress/70">
            Search by professor name, filter by department, and sort by the rating details
            student-athletes care about most.
          </p>
        </div>
        <div className="mt-6">
          <ProfessorFilters departments={departments} />
        </div>
        <div className="mt-4">
          <Link
            className="inline-flex min-h-11 items-center rounded border border-cypress/15 bg-white px-5 font-black text-cypress shadow-sm transition hover:border-vermilion hover:text-vermilion"
            href="/professors/not-listed"
          >
            Professor not listed?
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 border-b border-cypress/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-cypress">
          {professors.length} {professors.length === 1 ? "professor" : "professors"}
          {q ? ` matching "${q}"` : ""}
          {department !== "all" ? ` in ${department}` : ""}
        </p>
        <span className="text-sm font-semibold text-cypress/55">
          Sorted by {sortLabels[sort] ?? "highest athlete recommendation"}
        </span>
      </div>

      {professors.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {professors.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      ) : (
        <div className="rounded border border-cypress/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-cypress">No professors found</h2>
          <p className="mx-auto mt-2 max-w-md text-cypress/65">
            Try a shorter name, clear the department filter, or request the professor if they are missing.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center rounded bg-vermilion px-5 font-black text-white"
            href="/professors/not-listed"
          >
            Professor not listed?
          </Link>
        </div>
      )}
    </main>
  );
}
