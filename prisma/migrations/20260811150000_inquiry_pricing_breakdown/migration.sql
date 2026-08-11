-- AlterTable
ALTER TABLE "calculator_settings" ADD COLUMN     "averageSpeedKmh" DECIMAL(6,2) NOT NULL DEFAULT 55,
ADD COLUMN     "driverOvernightRate" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "hourlyWaitingRate" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "price_quotes" ADD COLUMN     "averageSpeedKmhAtQuote" DECIMAL(6,2) NOT NULL DEFAULT 55,
ADD COLUMN     "distanceCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "driverCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "driverOvernightRateAtQuote" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedWaitingHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
ADD COLUMN     "hourlyWaitingRateAtQuote" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "manualExtraCosts" DECIMAL(10,2),
ADD COLUMN     "manualExtraCostsNote" TEXT,
ADD COLUMN     "overnightCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "overnightStays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tripDays" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "waitingCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
