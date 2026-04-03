-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "identityDocOriginalName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "identityDocPath" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "identityDocType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "maritalStatus" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postName" TEXT NOT NULL DEFAULT '';
