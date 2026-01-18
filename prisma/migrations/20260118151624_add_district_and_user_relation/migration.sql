-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('POTHOLE', 'GARBAGE_DUMP', 'STREETLIGHT_OUTAGE', 'WATER_LEAKAGE', 'ILLEGAL_PARKING', 'TRAFFIC_SIGNAL_ISSUE', 'TRANSPORT_ISSUE', 'NOISE_POLLUTION', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "district" TEXT;

-- CreateTable
CREATE TABLE "IssueReport" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "IssueType" NOT NULL,
    "photo" TEXT,
    "video" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
