-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "DriverEmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BusStatus" AS ENUM ('ACTIVE', 'SERVICE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('WYNAJEM', 'WYCIECZKA', 'LINIA_REGULARNA', 'INNE');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NOWE', 'DO_KONTAKTU', 'SKONTAKTOWANO', 'OCZEKUJE_NA_DECYZJE', 'ZAAKCEPTOWANE', 'ODRZUCONE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PROBA_KONTAKTU', 'ROZMOWA_TELEFONICZNA', 'EMAIL', 'BRAK_ODPOWIEDZI', 'PROSBA_O_PONOWNY_KONTAKT', 'USTALENIE_CENY', 'AKCEPTACJA_KLIENTA', 'NOTATKA');

-- CreateEnum
CREATE TYPE "RoutePointType" AS ENUM ('BAZA_WYJAZD', 'ODBIOR', 'PRZYSTANEK', 'ZWROT', 'BAZA_POWROT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ZAPLANOWANE', 'W_TRAKCIE', 'ZAKONCZONE', 'ANULOWANE');

-- CreateEnum
CREATE TYPE "BookingDriverRole" AS ENUM ('GLOWNY', 'POMOCNICZY');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "licenseCategories" TEXT NOT NULL,
    "employmentStatus" "DriverEmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_availability" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "driver_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buses" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "brandModel" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "productionYear" INTEGER,
    "description" TEXT,
    "features" JSONB,
    "status" "BusStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_photos" (
    "id" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bus_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_availability" (
    "id" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "bus_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regular_lines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originLabel" TEXT NOT NULL,
    "destinationLabel" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regular_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_stops" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "stopName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "arrivalOffsetMinutes" INTEGER NOT NULL,

    CONSTRAINT "line_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_schedules" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "daysOfWeek" INTEGER[],
    "departureTime" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "validFrom" DATE NOT NULL,
    "validTo" DATE,

    CONSTRAINT "line_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priceInfo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_photos" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "trip_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_settings" (
    "id" TEXT NOT NULL,
    "ratePerKm" DECIMAL(10,2) NOT NULL,
    "baseFee" DECIMAL(10,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "calculator_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_distance_cache" (
    "id" TEXT NOT NULL,
    "originText" TEXT NOT NULL,
    "destinationText" TEXT NOT NULL,
    "distanceKm" DECIMAL(10,2) NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "route_distance_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "requestedDepartureAt" TIMESTAMP(3) NOT NULL,
    "requestedReturnAt" TIMESTAMP(3),
    "passengerCount" INTEGER NOT NULL,
    "additionalInfo" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NOWE',
    "relatedLineId" TEXT,
    "relatedTripId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_contact_logs" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_contact_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_points" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT,
    "bookingId" TEXT,
    "sequence" INTEGER NOT NULL,
    "pointType" "RoutePointType" NOT NULL,
    "label" TEXT NOT NULL,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),

    CONSTRAINT "route_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_quotes" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "distanceKmAuto" DECIMAL(10,2),
    "ratePerKmAtQuote" DECIMAL(10,2) NOT NULL,
    "baseFeeAtQuote" DECIMAL(10,2) NOT NULL,
    "calculatedPrice" DECIMAL(10,2) NOT NULL,
    "manualDistanceKm" DECIMAL(10,2),
    "manualPrice" DECIMAL(10,2),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "note" TEXT,

    CONSTRAINT "price_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "sourceInquiryId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "finalPrice" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'ZAPLANOWANE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_drivers" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "roleOnTrip" "BookingDriverRole",

    CONSTRAINT "booking_drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_buses" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "busId" TEXT NOT NULL,

    CONSTRAINT "booking_buses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "driver_availability_driverId_date_idx" ON "driver_availability"("driverId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "buses_registrationNumber_key" ON "buses"("registrationNumber");

-- CreateIndex
CREATE INDEX "bus_photos_busId_sortOrder_idx" ON "bus_photos"("busId", "sortOrder");

-- CreateIndex
CREATE INDEX "bus_availability_busId_date_idx" ON "bus_availability"("busId", "date");

-- CreateIndex
CREATE INDEX "line_stops_lineId_sortOrder_idx" ON "line_stops"("lineId", "sortOrder");

-- CreateIndex
CREATE INDEX "line_schedules_lineId_idx" ON "line_schedules"("lineId");

-- CreateIndex
CREATE INDEX "trip_photos_tripId_sortOrder_idx" ON "trip_photos"("tripId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "route_distance_cache_originText_destinationText_key" ON "route_distance_cache"("originText", "destinationText");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");

-- CreateIndex
CREATE INDEX "inquiry_contact_logs_inquiryId_createdAt_idx" ON "inquiry_contact_logs"("inquiryId", "createdAt");

-- CreateIndex
CREATE INDEX "route_points_inquiryId_sequence_idx" ON "route_points"("inquiryId", "sequence");

-- CreateIndex
CREATE INDEX "route_points_bookingId_sequence_idx" ON "route_points"("bookingId", "sequence");

-- CreateIndex
CREATE INDEX "price_quotes_inquiryId_isCurrent_idx" ON "price_quotes"("inquiryId", "isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_sourceInquiryId_key" ON "bookings"("sourceInquiryId");

-- CreateIndex
CREATE INDEX "bookings_startAt_endAt_idx" ON "bookings"("startAt", "endAt");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "booking_drivers_bookingId_driverId_key" ON "booking_drivers"("bookingId", "driverId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_buses_bookingId_busId_key" ON "booking_buses"("bookingId", "busId");

-- AddForeignKey
ALTER TABLE "driver_availability" ADD CONSTRAINT "driver_availability_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_photos" ADD CONSTRAINT "bus_photos_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_availability" ADD CONSTRAINT "bus_availability_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_stops" ADD CONSTRAINT "line_stops_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "regular_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_schedules" ADD CONSTRAINT "line_schedules_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "regular_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_photos" ADD CONSTRAINT "trip_photos_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_settings" ADD CONSTRAINT "calculator_settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_relatedLineId_fkey" FOREIGN KEY ("relatedLineId") REFERENCES "regular_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_relatedTripId_fkey" FOREIGN KEY ("relatedTripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_contact_logs" ADD CONSTRAINT "inquiry_contact_logs_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_contact_logs" ADD CONSTRAINT "inquiry_contact_logs_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_points" ADD CONSTRAINT "route_points_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_points" ADD CONSTRAINT "route_points_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_quotes" ADD CONSTRAINT "price_quotes_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_quotes" ADD CONSTRAINT "price_quotes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_sourceInquiryId_fkey" FOREIGN KEY ("sourceInquiryId") REFERENCES "inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_drivers" ADD CONSTRAINT "booking_drivers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_drivers" ADD CONSTRAINT "booking_drivers_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_buses" ADD CONSTRAINT "booking_buses_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_buses" ADD CONSTRAINT "booking_buses_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
