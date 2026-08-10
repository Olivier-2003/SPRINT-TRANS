import { AdminListHeader } from "@/components/admin/AdminListHeader";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { LinesTable } from "@/components/admin/lines/LinesTable";
import { getLines } from "@/lib/data/lines";

export default async function LinesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [lines, { error }] = await Promise.all([getLines(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <AdminListHeader
        title="Linie regularne"
        description="Trasy, przystanki i harmonogramy kursów."
        addHref="/admin/linie/nowy"
        addLabel="Dodaj linię"
      />
      <ErrorBanner message={error} />
      <LinesTable lines={lines} />
    </div>
  );
}
