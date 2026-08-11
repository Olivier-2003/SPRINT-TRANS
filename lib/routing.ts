import { db } from "@/lib/db";

/** Brak skonfigurowanego klucza API — kalkulator jest chwilowo niedostępny. */
export class RoutingConfigError extends Error {}

/** Błąd geokodowania/wyznaczania trasy dla konkretnego zapytania (np. nie znaleziono adresu). */
export class RoutingLookupError extends Error {}

const ORS_API_KEY = process.env.OPENROUTESERVICE_API_KEY;
const ORS_GEOCODE_URL = "https://api.openrouteservice.org/geocode/search";
const ORS_DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions/driving-car";

type Coordinate = [number, number]; // [lng, lat]

async function geocode(query: string): Promise<Coordinate> {
  if (!ORS_API_KEY) {
    throw new RoutingConfigError("Brak klucza API OpenRouteService (OPENROUTESERVICE_API_KEY).");
  }

  const url = new URL(ORS_GEOCODE_URL);
  url.searchParams.set("api_key", ORS_API_KEY);
  url.searchParams.set("text", query);
  url.searchParams.set("size", "1");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new RoutingLookupError(`Nie udało się zgeokodować adresu: „${query}”.`);
  }

  const data = await response.json();
  const coordinates = data?.features?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new RoutingLookupError(`Nie znaleziono lokalizacji: „${query}”. Sprawdź, czy adres jest poprawny.`);
  }

  return [coordinates[0], coordinates[1]];
}

async function fetchDirectDistanceKm(from: Coordinate, to: Coordinate): Promise<number> {
  if (!ORS_API_KEY) {
    throw new RoutingConfigError("Brak klucza API OpenRouteService (OPENROUTESERVICE_API_KEY).");
  }

  const response = await fetch(ORS_DIRECTIONS_URL, {
    method: "POST",
    headers: {
      Authorization: ORS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coordinates: [from, to] }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new RoutingLookupError("Nie udało się wyznaczyć trasy między podanymi punktami.");
  }

  const data = await response.json();
  const distanceMeters = data?.routes?.[0]?.summary?.distance;
  if (typeof distanceMeters !== "number") {
    throw new RoutingLookupError("Brak danych o długości trasy dla podanych punktów.");
  }

  return distanceMeters / 1000;
}

/**
 * Dystans jednego odcinka trasy (para punktów) — z cache. RouteDistanceCache
 * jest kluczowany po znormalizowanym tekście punktów (nie po współrzędnych),
 * więc oszczędza zarówno geokodowanie, jak i wyznaczanie trasy dla powtarzających
 * się odcinków (np. popularna trasa zapytana przez wielu klientów).
 */
async function getLegDistanceKm(originText: string, destinationText: string): Promise<number> {
  const originKey = originText.trim();
  const destinationKey = destinationText.trim();

  const cached = await db.routeDistanceCache.findUnique({
    where: { originText_destinationText: { originText: originKey, destinationText: destinationKey } },
  });
  if (cached) return Number(cached.distanceKm);

  const [originCoord, destinationCoord] = await Promise.all([geocode(originKey), geocode(destinationKey)]);
  const distanceKm = await fetchDirectDistanceKm(originCoord, destinationCoord);

  await db.routeDistanceCache.upsert({
    where: { originText_destinationText: { originText: originKey, destinationText: destinationKey } },
    create: { originText: originKey, destinationText: destinationKey, distanceKm },
    update: { distanceKm, computedAt: new Date() },
  });

  return distanceKm;
}

/**
 * Sumaryczny dystans wielopunktowej trasy (dowolna liczba punktów pośrednich),
 * liczony jako suma kolejnych odcinków — każdy odcinek osobno cache'owany.
 */
export async function getRouteDistanceKm(pointLabels: string[]): Promise<number> {
  if (pointLabels.length < 2) {
    throw new RoutingLookupError("Trasa musi mieć co najmniej dwa punkty.");
  }

  let total = 0;
  for (let i = 0; i < pointLabels.length - 1; i++) {
    total += await getLegDistanceKm(pointLabels[i], pointLabels[i + 1]);
  }
  return total;
}
