import { starterProfessors, starterReviews } from "@/data/starter-professors";
import { prisma } from "@/lib/prisma";
import { athleteFitScore, averageFor, type ProfessorWithReviews } from "@/lib/ratings";

export type ProfessorSearchOptions = {
  query?: string;
  department?: string;
  sort?: string;
};

function fallbackProfessors(): ProfessorWithReviews[] {
  return starterProfessors.map((professor) => ({
    ...professor,
    reviews: starterReviews
      .filter((review) => review.professorId === professor.id)
      .map((review) => ({ ...review, status: "visible" }))
  }));
}

function filterProfessors(professors: ProfessorWithReviews[], options: ProfessorSearchOptions) {
  const queryTerms =
    options.query
      ?.toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean) ?? [];
  const department = options.department?.trim();

  return professors.filter((professor) => {
    const searchableName = professor.fullName.toLowerCase();
    const matchesQuery = !queryTerms.length || queryTerms.every((term) => searchableName.includes(term));
    const matchesDepartment = !department || department === "all" || professor.department === department;

    return matchesQuery && matchesDepartment;
  });
}

function sortProfessors<T extends ProfessorWithReviews>(professors: T[], sort = "athleteRecommendation") {
  return [...professors].sort((a, b) => {
    if (sort === "athleteRecommendation") return athleteFitScore(b.reviews) - athleteFitScore(a.reviews);
    if (sort === "flexibility") return averageFor(b.reviews, "flexibility") - averageFor(a.reviews, "flexibility");
    if (sort === "workload") return averageFor(a.reviews, "workload") - averageFor(b.reviews, "workload");
    if (sort === "reviews") return b.reviews.length - a.reviews.length;
    return a.fullName.localeCompare(b.fullName);
  });
}

export async function getProfessors(options: ProfessorSearchOptions | string = {}) {
  const normalizedOptions = typeof options === "string" ? { query: options } : options;

  try {
    const professors = await prisma.professor.findMany({
      where: { status: "approved" },
      include: {
        reviews: {
          where: { status: { not: "hidden" } },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { fullName: "asc" }
    });

    return sortProfessors(filterProfessors(professors, normalizedOptions), normalizedOptions.sort);
  } catch {
    return sortProfessors(filterProfessors(fallbackProfessors(), normalizedOptions), normalizedOptions.sort);
  }
}

export async function getProfessorDepartments() {
  try {
    const departments = await prisma.professor.findMany({
      where: { status: "approved" },
      distinct: ["department"],
      orderBy: { department: "asc" },
      select: { department: true }
    });

    if (departments.length) return departments.map((professor) => professor.department);
  } catch {
  }

  return [...new Set(starterProfessors.map((professor) => professor.department))].sort();
}

export async function getProfessorById(id: string) {
  try {
    const professor = await prisma.professor.findFirst({
      where: { id, status: "approved" },
      include: {
        reviews: {
          where: { status: { not: "hidden" } },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (professor) return professor;
  } catch {
  }

  return fallbackProfessors().find((professor) => professor.id === id) ?? null;
}
