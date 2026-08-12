import { db } from "@/lib/db";
import { getDriverRecommendations, type DriverRecommendation } from "@/lib/driver-recommendation";
import { computeBusAvailability, type BusAvailabilityResult } from "@/lib/availability-engine";

/**
 * Fundament pod przyszły automatyczny generator propozycji grafiku (Etap 9) — dla
 * zadanego zakresu dat znajduje zlecenia bez pełnej obsady i dla każdego zwraca
 * najlepszego kandydata (kierowcę/autobus) z tym samym silnikiem rekomendacji, który
 * zasila panel "Proponowana obsada". To WYŁĄCZNIE dane pomocnicze — nic tutaj nie
 * zapisuje żadnego przydziału do bazy ani nie podejmuje decyzji za administratora.
 * Przyszły algorytm będzie mógł budować się na tej samej funkcji, iterując po
 * kolejnych dniach/tygodniach i uwzględniając własne reguły kolejności/priorytetu.
 */

export interface BookingCrewGap {
  bookingId: string;
  customerName: string;
  startAt: Date;
  endAt: Date;
  missingDriver: boolean;
  missingBus: boolean;
  topDriverCandidate: DriverRecommendation | null;
  topBusCandidate: { busId: string; label: string; result: BusAvailabilityResult } | null;
}

export async function getScheduleProposal(rangeStart: Date, rangeEnd: Date): Promise<BookingCrewGap[]> {
  const bookings = await db.booking.findMany({
    where: {
      status: { not: "ANULOWANE" },
      startAt: { lt: rangeEnd },
      endAt: { gt: rangeStart },
    },
    include: {
      drivers: { select: { driverId: true } },
      buses: { select: { busId: true } },
      sourceInquiry: { select: { type: true, relatedLineId: true } },
    },
    orderBy: { startAt: "asc" },
  });

  const gaps: BookingCrewGap[] = [];

  for (const booking of bookings) {
    const missingDriver = booking.drivers.length === 0;
    const missingBus = booking.buses.length === 0;
    if (!missingDriver && !missingBus) continue;

    let topDriverCandidate: DriverRecommendation | null = null;
    if (missingDriver) {
      const recommendations = await getDriverRecommendations({
        startAt: booking.startAt,
        endAt: booking.endAt,
        excludeBookingId: booking.id,
        inquiryType: booking.sourceInquiry?.type ?? null,
        lineId: booking.sourceInquiry?.relatedLineId ?? null,
      });
      topDriverCandidate = recommendations[0] ?? null;
    }

    let topBusCandidate: BookingCrewGap["topBusCandidate"] = null;
    if (missingBus) {
      const [buses, busStatuses] = await Promise.all([
        db.bus.findMany({ where: { status: "ACTIVE" }, orderBy: { registrationNumber: "asc" } }),
        computeBusAvailability({ startAt: booking.startAt, endAt: booking.endAt, excludeBookingId: booking.id }),
      ]);
      const ranked = buses
        .map((bus) => ({
          busId: bus.id,
          label: `${bus.registrationNumber} — ${bus.brandModel}`,
          result: busStatuses.get(bus.id) ?? { busId: bus.id, status: "DOSTEPNY" as const, issues: [] },
        }))
        .sort((a, b) => {
          const order = { DOSTEPNY: 0, OSTRZEZENIE: 1, KONFLIKT: 2 };
          return order[a.result.status] - order[b.result.status];
        });
      topBusCandidate = ranked[0] ?? null;
    }

    gaps.push({
      bookingId: booking.id,
      customerName: booking.customerName,
      startAt: booking.startAt,
      endAt: booking.endAt,
      missingDriver,
      missingBus,
      topDriverCandidate,
      topBusCandidate,
    });
  }

  return gaps;
}
