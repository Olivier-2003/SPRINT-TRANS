import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

// TODO: podmienić "#" na prawdziwe linki do opinii poszczególnych klientów, gdy będą dostępne.
const REFERENCES = [
  { name: "UKS Biła Piechcin", reviewUrl: "#" },
  { name: "Solino (Grupa Orlen)", reviewUrl: "#" },
  { name: "Noteć Inowrocław", reviewUrl: "#" },
] as const;

/**
 * Logo/avatar klientów to na razie neutralny placeholder (inicjał) — do
 * podmiany na prawdziwe logotypy, gdy SPRINT-TRANS je dostarczy.
 */
export function ReferencesSection() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Referencje</span>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Zaufali nam</h2>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {REFERENCES.map((ref, i) => (
          <ScrollReveal
            key={ref.name}
            delay={i * 90}
            className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-bold text-foreground">
              {ref.name.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{ref.name}</h3>
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, star) => (
                <Star key={star} className="size-5 fill-current" />
              ))}
            </div>
            <Button
              render={<Link href={ref.reviewUrl} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              variant="outline"
              className="mt-2 h-11 rounded-full"
            >
              Zobacz opinię
            </Button>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
