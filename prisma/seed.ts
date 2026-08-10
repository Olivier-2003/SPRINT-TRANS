/**
 * Dane deweloperskie — wyłącznie fikcyjne/placeholder (Etap 1, docs/plan.md).
 * Zakaz używania tu prawdziwych danych klientów lub kierowców.
 */
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("ZmienToHaslo123!", 10);
  const admin = await db.adminUser.upsert({
    where: { email: "admin@sprint-trans.pl" },
    update: {},
    create: {
      email: "admin@sprint-trans.pl",
      passwordHash,
      name: "Administrator (dev)",
    },
  });

  await db.calculatorSettings.upsert({
    where: { id: "seed-calculator-settings" },
    update: {},
    create: {
      id: "seed-calculator-settings",
      ratePerKm: 3.5,
      baseFee: 150,
      updatedById: admin.id,
    },
  });

  const [driverJan, driverAnna] = await Promise.all([
    db.driver.create({
      data: {
        firstName: "Jan",
        lastName: "Testowy",
        phone: "500 100 200",
        email: "jan.testowy@example.com",
        licenseCategories: "D, D1",
      },
    }),
    db.driver.create({
      data: {
        firstName: "Anna",
        lastName: "Przykładowa",
        phone: "500 300 400",
        email: "anna.przykladowa@example.com",
        licenseCategories: "D",
      },
    }),
  ]);

  const busKrasnal = await db.bus.create({
    data: {
      registrationNumber: "DEV 12345 (placeholder)",
      brandModel: "Autobus testowy 1 (placeholder)",
      seats: 55,
      productionYear: 2019,
      description: "Dane placeholder — do zastąpienia prawdziwą flotą w Etapie 2.",
      status: "ACTIVE",
      photos: {
        create: [
          { url: "https://placehold.co/640x400?text=Autobus+1", sortOrder: 0 },
        ],
      },
    },
  });

  const busKomfort = await db.bus.create({
    data: {
      registrationNumber: "DEV 67890 (placeholder)",
      brandModel: "Autobus testowy 2 (placeholder)",
      seats: 35,
      productionYear: 2021,
      status: "ACTIVE",
      photos: {
        create: [
          { url: "https://placehold.co/640x400?text=Autobus+2", sortOrder: 0 },
        ],
      },
    },
  });

  await db.regularLine.create({
    data: {
      name: "Linia testowa A (placeholder)",
      originLabel: "Miasto A (placeholder)",
      destinationLabel: "Miasto B (placeholder)",
      description: "Przykładowa linia — treści docelowe dostarczy klient przed Etapem 3.",
      stops: {
        create: [
          { stopName: "Miasto A — dworzec (placeholder)", sortOrder: 0, arrivalOffsetMinutes: 0 },
          { stopName: "Miejscowość C (placeholder)", sortOrder: 1, arrivalOffsetMinutes: 40 },
          { stopName: "Miasto B — dworzec (placeholder)", sortOrder: 2, arrivalOffsetMinutes: 90 },
        ],
      },
      schedules: {
        create: [
          {
            daysOfWeek: [1, 2, 3, 4, 5],
            departureTime: "07:00",
            arrivalTime: "08:30",
            price: 25,
            validFrom: new Date("2026-01-01"),
          },
        ],
      },
    },
  });

  await db.trip.create({
    data: {
      title: "Przykładowa wycieczka (placeholder)",
      description: "Treści i zdjęcia dostarczy klient przed Etapem 3.",
      priceInfo: "Cena ustalana indywidualnie",
    },
  });

  // Przykładowe zapytanie -> wycena -> zlecenie, żeby zweryfikować cały model danych end-to-end.
  const inquiry = await db.inquiry.create({
    data: {
      type: "WYNAJEM",
      customerName: "Klient Testowy (placeholder)",
      customerEmail: "klient.testowy@example.com",
      customerPhone: "600 700 800",
      requestedDepartureAt: new Date("2026-09-10T08:00:00Z"),
      requestedReturnAt: new Date("2026-09-10T20:00:00Z"),
      passengerCount: 40,
      additionalInfo: "Przykładowe zapytanie deweloperskie (placeholder).",
      status: "ZAAKCEPTOWANE",
      routePoints: {
        create: [
          { sequence: 0, pointType: "BAZA_WYJAZD", label: "Baza SPRINT-TRANS (placeholder)" },
          { sequence: 1, pointType: "ODBIOR", label: "Miasto A — dworzec (placeholder)" },
          { sequence: 2, pointType: "ZWROT", label: "Miasto A — dworzec (placeholder)" },
          { sequence: 3, pointType: "BAZA_POWROT", label: "Baza SPRINT-TRANS (placeholder)" },
        ],
      },
      contactLogs: {
        create: [
          {
            adminUserId: admin.id,
            contactType: "ROZMOWA_TELEFONICZNA",
            note: "Przykładowy wpis historii kontaktu (placeholder).",
          },
          {
            adminUserId: admin.id,
            contactType: "AKCEPTACJA_KLIENTA",
            note: "Klient zaakceptował wycenę (placeholder).",
          },
        ],
      },
    },
  });

  const priceQuote = await db.priceQuote.create({
    data: {
      inquiryId: inquiry.id,
      distanceKmAuto: 180,
      ratePerKmAtQuote: 3.5,
      baseFeeAtQuote: 150,
      calculatedPrice: 780,
      isCurrent: true,
    },
  });

  await db.booking.create({
    data: {
      sourceInquiryId: inquiry.id,
      customerName: inquiry.customerName,
      customerEmail: inquiry.customerEmail,
      customerPhone: inquiry.customerPhone,
      startAt: inquiry.requestedDepartureAt,
      endAt: inquiry.requestedReturnAt ?? inquiry.requestedDepartureAt,
      finalPrice: priceQuote.calculatedPrice,
      status: "ZAPLANOWANE",
      createdById: admin.id,
      routePoints: {
        create: [
          { sequence: 0, pointType: "BAZA_WYJAZD", label: "Baza SPRINT-TRANS (placeholder)" },
          { sequence: 1, pointType: "ODBIOR", label: "Miasto A — dworzec (placeholder)" },
          { sequence: 2, pointType: "ZWROT", label: "Miasto A — dworzec (placeholder)" },
          { sequence: 3, pointType: "BAZA_POWROT", label: "Baza SPRINT-TRANS (placeholder)" },
        ],
      },
      drivers: {
        create: [{ driverId: driverJan.id, roleOnTrip: "GLOWNY" }, { driverId: driverAnna.id, roleOnTrip: "POMOCNICZY" }],
      },
      buses: {
        create: [{ busId: busKrasnal.id }, { busId: busKomfort.id }],
      },
    },
  });

  console.log("Seed zakończony (dane fikcyjne).");
  console.log(`Konto admina (dev): admin@sprint-trans.pl / ZmienToHaslo123!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
