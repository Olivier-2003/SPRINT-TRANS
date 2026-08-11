-- AlterEnum
BEGIN;
CREATE TYPE "InquiryStatus_new" AS ENUM ('NOWE', 'DO_KONTAKTU', 'WYCENIONE', 'OCZEKUJE_NA_KLIENTA', 'ZAAKCEPTOWANE', 'ODRZUCONE', 'ANULOWANE');
ALTER TABLE "inquiries" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inquiries" ALTER COLUMN "status" TYPE "InquiryStatus_new" USING ("status"::text::"InquiryStatus_new");
ALTER TYPE "InquiryStatus" RENAME TO "InquiryStatus_old";
ALTER TYPE "InquiryStatus_new" RENAME TO "InquiryStatus";
DROP TYPE "InquiryStatus_old";
ALTER TABLE "inquiries" ALTER COLUMN "status" SET DEFAULT 'NOWE';
COMMIT;

-- AlterTable
ALTER TABLE "price_quotes" ADD COLUMN     "manualDriverCount" INTEGER,
ADD COLUMN     "manualOvernightStays" INTEGER,
ADD COLUMN     "manualTripDays" INTEGER,
ADD COLUMN     "manualWaitingHours" DECIMAL(6,2);
