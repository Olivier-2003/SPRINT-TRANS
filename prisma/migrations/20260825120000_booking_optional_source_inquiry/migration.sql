-- Booking.sourceInquiryId (i relacja sourceInquiry) staje się opcjonalna,
-- żeby dało się utworzyć zlecenie ręcznie w panelu, bez powiązanego zapytania.
-- Ograniczenie FK (bookings_sourceInquiryId_fkey) i unikalny indeks pozostają
-- bez zmian — NULL jest z nich zwolniony automatycznie przez Postgres.
ALTER TABLE "bookings" ALTER COLUMN "sourceInquiryId" DROP NOT NULL;
