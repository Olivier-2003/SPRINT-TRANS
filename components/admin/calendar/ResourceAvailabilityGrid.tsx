import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ResourceDayStatus, ResourceRow } from "@/lib/resource-calendar";

const STATUS_STYLES: Record<ResourceDayStatus, string> = {
  WOLNY: "",
  ZAJETY: "bg-muted text-muted-foreground",
  CZESCIOWO: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  NIEDOSTEPNY: "bg-destructive/15 text-destructive",
};

const STATUS_LETTERS: Record<ResourceDayStatus, string> = {
  WOLNY: "",
  ZAJETY: "Z",
  CZESCIOWO: "C",
  NIEDOSTEPNY: "N",
};

export function ResourceAvailabilityGrid({ days, resources }: { days: Date[]; resources: ResourceRow[] }) {
  if (resources.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zasobów do wyświetlenia.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>
          <span className="mr-1 inline-block size-3 rounded-sm bg-muted align-middle" /> Zajęty (zlecenie)
        </span>
        <span>
          <span className="mr-1 inline-block size-3 rounded-sm bg-amber-100 align-middle dark:bg-amber-950" />{" "}
          Częściowa dostępność
        </span>
        <span>
          <span className="mr-1 inline-block size-3 rounded-sm bg-destructive/15 align-middle" /> Niedostępny
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background">Zasób</TableHead>
            {days.map((day) => (
              <TableHead key={day.toISOString()} className="w-8 text-center px-1">
                {day.getDate()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="sticky left-0 bg-background font-medium">
                <Link href={resource.href} className="underline underline-offset-2">
                  {resource.label}
                </Link>
              </TableCell>
              {resource.days.map((day, i) => (
                <TableCell
                  key={i}
                  title={day.title}
                  className={`w-8 px-1 text-center text-xs ${STATUS_STYLES[day.status]}`}
                >
                  {STATUS_LETTERS[day.status]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
