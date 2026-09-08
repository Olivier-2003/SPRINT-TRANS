-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "sourceLineId" TEXT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_sourceLineId_fkey" FOREIGN KEY ("sourceLineId") REFERENCES "regular_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
