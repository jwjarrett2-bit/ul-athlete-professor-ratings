-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "email" TEXT,
    "title" TEXT,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "courseTaken" TEXT NOT NULL,
    "semesterTaken" TEXT NOT NULL,
    "overallRecommendation" INTEGER NOT NULL,
    "athleteFriendliness" INTEGER NOT NULL,
    "flexibility" INTEGER NOT NULL,
    "workload" INTEGER NOT NULL,
    "attendanceStrictness" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "wouldTakeAgain" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Professor_fullName_idx" ON "Professor"("fullName");

-- CreateIndex
CREATE INDEX "Professor_department_idx" ON "Professor"("department");

-- CreateIndex
CREATE INDEX "Professor_status_idx" ON "Professor"("status");

-- CreateIndex
CREATE INDEX "Review_professorId_idx" ON "Review"("professorId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
