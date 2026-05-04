import { PrismaClient } from "@prisma/client";
import { starterProfessors, starterReviews } from "../data/starter-professors";

const prisma = new PrismaClient();

async function main() {
  for (const professor of starterProfessors) {
    const { id, ...professorData } = professor;

    await prisma.professor.upsert({
      where: { id },
      update: professorData,
      create: {
        id,
        ...professorData
      }
    });
  }

  await prisma.review.deleteMany({
    where: {
      professorId: {
        in: starterProfessors.map((professor) => professor.id)
      }
    }
  });

  for (const review of starterReviews) {
    const professor = await prisma.professor.findUniqueOrThrow({
      where: { id: review.professorId }
    });

    await prisma.review.create({
      data: {
        professorId: professor.id,
        courseTaken: review.courseTaken,
        semesterTaken: review.semesterTaken,
        sport: review.sport,
        overallRecommendation: review.overallRecommendation,
        athleteFriendliness: review.athleteFriendliness,
        flexibility: review.flexibility,
        workload: review.workload,
        attendanceStrictness: review.attendanceStrictness,
        communication: review.communication,
        wouldTakeAgain: review.wouldTakeAgain,
        comment: review.comment
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
