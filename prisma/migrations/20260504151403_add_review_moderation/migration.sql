-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('visible', 'reported', 'hidden');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'visible';

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "Review"("status");
