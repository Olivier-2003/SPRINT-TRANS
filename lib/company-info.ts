/** Adres siedziby firmy — współdzielony między stopką a stroną kontaktową. */
export const COMPANY_ADDRESS = "Wiertników 4, 88-192 Piechcin, Polska";

/** Osadzona mapa Google bez klucza API — wystarczy adres w zapytaniu. */
export const COMPANY_MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_ADDRESS)}&output=embed`;
