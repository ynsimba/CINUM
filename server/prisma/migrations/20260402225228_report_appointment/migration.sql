-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "appointmentAt" TIMESTAMP(3),
ADD COLUMN     "appointmentNote" TEXT NOT NULL DEFAULT '';
