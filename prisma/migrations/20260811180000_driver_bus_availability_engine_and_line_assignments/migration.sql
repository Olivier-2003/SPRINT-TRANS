-- CreateEnum
CREATE TYPE "DriverAvailabilityType" AS ENUM ('URLOP', 'CHOROBOWE', 'SZKOLENIE', 'NIEDOSTEPNY', 'DOSTEPNY_CZESCIOWO');

-- CreateEnum
CREATE TYPE "BusAvailabilityType" AS ENUM ('DOSTEPNY', 'SERWIS', 'PRZEGLAD', 'AWARIA', 'NIEDOSTEPNY');

-- CreateEnum
CREATE TYPE "DriverLineRole" AS ENUM ('GLOWNY', 'PREFEROWANY', 'REZERWOWY');

-- DropIndex
DROP INDEX "driver_availability_driverId_date_idx";

-- DropIndex
DROP INDEX "bus_availability_busId_date_idx";

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "maxDailyWorkHours" DECIMAL(4,1),
ADD COLUMN     "monthlyWorkHoursNorm" DECIMAL(6,1),
ADD COLUMN     "preferredWorkTypes" "InquiryType"[] DEFAULT ARRAY[]::"InquiryType"[],
ADD COLUMN     "restingHoursRequired" DECIMAL(4,1) NOT NULL DEFAULT 11,
ADD COLUMN     "restrictedWorkTypes" "InquiryType"[] DEFAULT ARRAY[]::"InquiryType"[],
ADD COLUMN     "weeklyWorkHoursNorm" DECIMAL(5,1);

-- AlterTable
ALTER TABLE "driver_availability" DROP COLUMN "availableFrom",
DROP COLUMN "availableTo",
DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "DriverAvailabilityType" NOT NULL;

-- AlterTable
ALTER TABLE "bus_availability" DROP COLUMN "availableFrom",
DROP COLUMN "availableTo",
DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "BusAvailabilityType" NOT NULL;

-- CreateTable
CREATE TABLE "driver_line_assignments" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "role" "DriverLineRole" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driver_line_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driver_line_assignments_driverId_lineId_key" ON "driver_line_assignments"("driverId", "lineId");

-- CreateIndex
CREATE INDEX "driver_availability_driverId_startAt_endAt_idx" ON "driver_availability"("driverId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "bus_availability_busId_startAt_endAt_idx" ON "bus_availability"("busId", "startAt", "endAt");

-- AddForeignKey
ALTER TABLE "driver_availability" ADD CONSTRAINT "driver_availability_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_availability" ADD CONSTRAINT "bus_availability_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_line_assignments" ADD CONSTRAINT "driver_line_assignments_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_line_assignments" ADD CONSTRAINT "driver_line_assignments_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "regular_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
