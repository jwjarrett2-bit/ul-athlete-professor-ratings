import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { RatingForm } from "@/components/rating-form";
import { authOptions } from "@/lib/auth";
import { getProfessorById } from "@/lib/professors";

type ReviewPageProps = {
  params: Promise<{ professorId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { professorId } = await params;
  const [professor, session] = await Promise.all([
    getProfessorById(professorId),
    getServerSession(authOptions)
  ]);

  if (!professor) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <Link className="text-sm font-bold text-vermilion" href={`/professors/${professor.id}`}>
        Back to professor
      </Link>
      <div className="mt-6 rounded border border-cypress/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-black uppercase text-vermilion">{professor.department}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-cypress sm:text-4xl">Rate {professor.fullName}</h1>
        <p className="mt-3 leading-7 text-cypress/70">
          Share whether this professor is a good fit for UL student-athletes balancing class,
          travel, practice, and competition.
        </p>
      </div>
      <div className="mt-6">
        {session?.user ? (
          <RatingForm professorId={professor.id} />
        ) : (
          <div className="rounded border border-cypress/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-cypress">Login required</h2>
            <p className="mt-2 leading-7 text-cypress/70">
              Student-athletes must log in with Google before submitting a professor review.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
