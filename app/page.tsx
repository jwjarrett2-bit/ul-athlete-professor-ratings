import Link from "next/link";
import { Suspense } from "react";
import { SearchBox } from "@/components/search-box";

const ratingCategories = [
  {
    title: "Overall recommendation",
    description: "Would another student-athlete recommend this professor during season?"
  },
  {
    title: "Athlete friendliness",
    description: "How well does the professor understand travel, practice, and competition?"
  },
  {
    title: "Flexibility",
    description: "How reasonable are makeup work, deadline changes, and missed class conversations?"
  },
  {
    title: "Workload",
    description: "How manageable is the class alongside training, games, and recovery?"
  },
  {
    title: "Attendance strictness",
    description: "How strict is the attendance policy when athletes have official conflicts?"
  },
  {
    title: "Communication",
    description: "How clearly and quickly does the professor respond when plans change?"
  }
];

export default function Home() {
  return (
    <main>
      <section className="border-b border-cypress/10 bg-cypress text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
          <p className="text-sm font-black uppercase tracking-wide text-vermilion">
            University of Louisiana student-athlete guide
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Find athlete-friendly professors before you build your schedule.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
            A simple professor rating site built for UL student-athletes, focused on flexibility,
            attendance, workload, communication, and whether teammates would recommend the class.
          </p>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/60">
            This is an unofficial student-built guide based on athlete experiences, not a University
            of Louisiana service or general professor rating site.
          </p>

          <div className="mt-8 max-w-2xl">
            <Suspense fallback={null}>
              <SearchBox
                buttonLabel="Search Professors"
                placeholder="Search professor, department, or college"
              />
            </Suspense>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded bg-vermilion px-5 font-black text-white shadow-sm transition hover:bg-vermilion/90"
              href="/professors"
            >
              Search Professors
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded border border-white/25 px-5 font-black text-white hover:bg-white/10"
              href="/professors"
            >
              Leave a Review
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-black text-white/80 sm:grid-cols-3">
            <div className="rounded border border-white/15 bg-white/5 p-3">Built for travel weeks</div>
            <div className="rounded border border-white/15 bg-white/5 p-3">Sort by athlete fit</div>
            <div className="rounded border border-white/15 bg-white/5 p-3">Reviews require login</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase text-vermilion">Athlete-focused ratings</p>
          <h2 className="mt-2 text-3xl font-black text-cypress">Not a generic professor rating site.</h2>
          <p className="mt-3 leading-7 text-cypress/70">
            Ratings are centered on the class experience student-athletes actually need to know
            before registration.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ratingCategories.map((category) => (
            <article key={category.title} className="rounded border border-cypress/10 bg-white p-5 shadow-sm transition hover:border-vermilion/40">
              <h3 className="text-lg font-black text-cypress">{category.title}</h3>
              <p className="mt-2 leading-6 text-cypress/65">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
