-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_sourceInquiryId_fkey";

-- AlterTable
ALTER TABLE "booking_buses" ADD COLUMN     "plannedHours" DECIMAL(5,1);

-- AlterTable
ALTER TABLE "booking_drivers" ADD COLUMN     "plannedHours" DECIMAL(5,1);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_sourceInquiryId_fkey" FOREIGN KEY ("sourceInquiryId") REFERENCES "inquiries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
