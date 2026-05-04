import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminRequiredMessage } from "@/components/admin-required-message";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

async function updateProfessorStatus(formData: FormData) {
  "use server";

  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return;

  const professorIdValue = formData.get("professorId");
  const actionValue = formData.get("action");
  const professorId = typeof professorIdValue === "string" ? professorIdValue : "";
  const action = typeof actionValue === "string" ? actionValue : "";

  if (!professorId) return;

  if (action === "approve") {
    await prisma.professor.update({
      where: { id: professorId },
      data: { status: "approved" }
    }).catch(() => null);
  }

  if (action === "reject") {
    await prisma.professor.delete({
      where: { id: professorId }
    }).catch(() => null);
  }

  revalidatePath("/admin/professors");
  revalidatePath("/professors");
}

export default async function AdminProfessorsPage() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return <AdminRequiredMessage />;

  const [pendingProfessors, approvedProfessors] = await Promise.all([
    prisma.professor.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" }
    }),
    prisma.professor.findMany({
      where: { status: "approved" },
      select: { fullName: true, department: true }
    })
  ]);

  const approvedNames = new Set(approvedProfessors.map((professor) => professor.fullName.toLowerCase()));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-vermilion">Admin</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-cypress sm:text-4xl">Professor approvals</h1>
        <p className="mt-3 max-w-2xl leading-7 text-cypress/70">
          Approve athlete-submitted professors so they appear in search, or reject requests that are duplicates
          or not useful for the guide.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-2 border-b border-cypress/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-cypress">
          {pendingProfessors.length} pending {pendingProfessors.length === 1 ? "professor" : "professors"}
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-black">
          <Link className="text-vermilion" href="/admin/reviews">
            Review moderation
          </Link>
          <Link className="text-vermilion" href="/professors">
            Back to search
          </Link>
        </div>
      </div>

      {pendingProfessors.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {pendingProfessors.map((professor) => {
            const hasSimilarApprovedProfessor = approvedNames.has(professor.fullName.toLowerCase());

            return (
              <article className="rounded border border-cypress/10 bg-white p-5 shadow-sm" key={professor.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-field-gold/30 px-2.5 py-1 text-xs font-black text-cypress">
                    Pending
                  </span>
                  <span className="text-xs font-bold text-cypress/55">
                    {professor.createdAt.toLocaleDateString("en-US")}
                  </span>
                  {hasSimilarApprovedProfessor ? (
                    <span className="rounded bg-vermilion/10 px-2.5 py-1 text-xs font-black text-vermilion">
                      Similar approved name
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-2xl font-black leading-tight text-cypress">{professor.fullName}</h2>
                <p className="mt-1 text-sm font-semibold text-cypress/65">
                  {professor.department} · {professor.college}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <form action={updateProfessorStatus}>
                    <input name="professorId" type="hidden" value={professor.id} />
                    <input name="action" type="hidden" value="approve" />
                    <button className="min-h-10 rounded bg-vermilion px-4 text-sm font-black text-white" type="submit">
                      Approve
                    </button>
                  </form>
                  <form action={updateProfessorStatus}>
                    <input name="professorId" type="hidden" value={professor.id} />
                    <input name="action" type="hidden" value="reject" />
                    <button className="min-h-10 rounded border border-cypress/15 px-4 text-sm font-black text-cypress" type="submit">
                      Reject
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded border border-cypress/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-cypress">No pending professors</h2>
          <p className="mx-auto mt-2 max-w-md text-cypress/65">
            New “Professor not listed?” requests will appear here before they go live.
          </p>
        </div>
      )}
    </main>
  );
}
