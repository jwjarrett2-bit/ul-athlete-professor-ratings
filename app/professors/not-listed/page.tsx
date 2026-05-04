import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ProfessorNotListedPageProps = {
  searchParams: Promise<{ submitted?: string; duplicate?: string }>;
};

function cleanText(value: FormDataEntryValue | null, maxLength = 120) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function splitName(fullName: string) {
  const parts = fullName.split(" ").filter(Boolean);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "Unknown";

  return { firstName, lastName };
}

async function submitMissingProfessor(formData: FormData) {
  "use server";

  const fullName = cleanText(formData.get("fullName"));
  const department = cleanText(formData.get("department"));
  const college = cleanText(formData.get("college"));

  if (!fullName || !department || !college) {
    redirect("/professors/not-listed?submitted=missing");
  }

  const existingProfessor = await prisma.professor.findUnique({
    where: {
      fullName_department: {
        fullName,
        department
      }
    },
    select: {
      status: true
    }
  });

  if (existingProfessor) {
    redirect("/professors/not-listed?submitted=1&duplicate=1");
  }

  const { firstName, lastName } = splitName(fullName);

  await prisma.professor.create({
    data: {
      firstName,
      lastName,
      fullName,
      department,
      college,
      status: "pending"
    }
  });

  redirect("/professors/not-listed?submitted=1");
}

export default async function ProfessorNotListedPage({ searchParams }: ProfessorNotListedPageProps) {
  const { submitted, duplicate } = await searchParams;
  const isSubmitted = submitted === "1";
  const hasMissingFields = submitted === "missing";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <Link className="text-sm font-black text-vermilion" href="/professors">
        Back to professor search
      </Link>

      <section className="mt-6 rounded border border-cypress/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-black uppercase text-vermilion">Professor not listed?</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-cypress">Request a professor to be added.</h1>
        <p className="mt-3 leading-7 text-cypress/70">
          Add the professor here and they will be saved as pending. Pending professors stay out of search
          until they are approved.
        </p>

        {isSubmitted ? (
          <div className="mt-6 rounded border border-cypress/10 bg-paper p-5">
            <h2 className="text-xl font-black text-cypress">Request received</h2>
            <p className="mt-2 text-cypress/70">
              {duplicate
                ? "That professor and department already exist in the system, so no duplicate was created."
                : "The professor was saved as pending and will not appear in search until approved."}
            </p>
            <Link
              className="mt-4 inline-flex min-h-11 items-center rounded bg-vermilion px-5 font-black text-white"
              href="/professors"
            >
              Return to search
            </Link>
          </div>
        ) : (
          <form action={submitMissingProfessor} className="mt-6 grid gap-4">
            {hasMissingFields ? (
              <p className="rounded border border-vermilion/20 bg-vermilion/5 p-3 text-sm font-bold text-vermilion">
                Please fill out the professor name, department, and college.
              </p>
            ) : null}

            <label className="block">
              <span className="text-sm font-bold text-cypress/70">Full name</span>
              <input
                className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none ring-vermilion/20 transition placeholder:text-cypress/40 focus:border-vermilion focus:ring-4"
                name="fullName"
                placeholder="Example: Jordan Broussard"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-cypress/70">Department</span>
              <input
                className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none ring-vermilion/20 transition placeholder:text-cypress/40 focus:border-vermilion focus:ring-4"
                name="department"
                placeholder="Example: Kinesiology"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-cypress/70">College</span>
              <input
                className="mt-1 min-h-11 w-full rounded border border-cypress/15 bg-white px-3 text-cypress outline-none ring-vermilion/20 transition placeholder:text-cypress/40 focus:border-vermilion focus:ring-4"
                name="college"
                placeholder="Example: College of Education & Human Development"
                required
              />
            </label>

            <button className="min-h-11 rounded bg-vermilion px-5 font-black text-white transition hover:bg-vermilion/90" type="submit">
              Submit Professor
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
