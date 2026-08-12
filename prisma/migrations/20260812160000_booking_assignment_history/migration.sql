-- CreateEnum
CREATE TYPE "AssignmentResourceType" AS ENUM ('KIEROWCA', 'AUTOBUS');

-- CreateEnum
CREATE TYPE "AssignmentChangeType" AS ENUM ('PRZYPISANO', 'ZMIENIONO', 'USUNIETO');

-- CreateTable
CREATE TABLE "booking_assignment_history" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "resourceType" "AssignmentResourceType" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceLabel" TEXT NOT NULL,
    "changeType" "AssignmentChangeType" NOT NULL,
    "note" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,

    CONSTRAINT "booking_assignment_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_assignment_history_bookingId_changedAt_idx" ON "booking_assignment_history"("bookingId", "changedAt");

-- AddForeignKey
ALTER TABLE "booking_assignment_history" ADD CONSTRAINT "booking_assignment_history_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_assignment_history" ADD CONSTRAINT "booking_assignment_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
