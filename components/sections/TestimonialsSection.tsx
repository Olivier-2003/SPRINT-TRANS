import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Treść przykładowa (placeholder) — SPRINT-TRANS nie dostarczył jeszcze
 * prawdziwych opinii klientów. Brak dedykowanego modelu bazy dla opinii —
 * to wyłącznie warstwa prezentacyjna, do podmiany na realne dane w przyszłości
 * (np. własny model `Testimonial` albo integracja z Google/Facebook Reviews).
 */
const TESTIMONIALS = [
  {
    quote: "Profesjonalna obsługa, autokar czysty i bardzo komfortowy. Polecam każdemu!",
    author: "Klient indywidualny",
  },
  {
    quote: "Punktualnie, bezpiecznie, wszystko na najwyższym poziomie.",
    author: "Klient indywidualny",
  },
  {
    quote: "Korzystamy regularnie z przewozów pracowniczych. Zero problemów.",
    author: "Klient biznesowy",
  },
];

// Lista zdublowana — przy przewinięciu paska o dokładnie -50% druga kopia
// zajmuje miejsce pierwszej, co daje bezszwową, nieskończoną pętlę (patrz
// .testimonials-track w globals.css).
const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export function TestimonialsSection() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 pt-10 pb-14 md:pt-14 md:pb-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Opinie klientów</span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Zaufanie to nasza najlepsza droga</h2>
      </ScrollReveal>

      <ScrollReveal className="relative -mx-6 lg:mx-0">
        <div
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="testimonials-track flex w-max gap-6 px-6">
            {MARQUEE_ITEMS.map((t, i) => (
              <Card
                key={i}
                className="w-[320px] shrink-0 gap-0 rounded-2xl border border-white/10 bg-gradient-to-b from-brand-navy-card to-[color-mix(in_oklch,var(--color-brand-navy),black_30%)] py-0 text-white shadow-2xl ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_60px_-20px_rgba(0,0,0,0.6)] sm:w-[380px]"
              >
                <CardContent className="flex flex-col gap-5 px-8 py-9">
                  <div className="flex items-center justify-between">
                    <Quote className="size-8 text-primary" />
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} className="size-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xl leading-relaxed font-semibold text-white">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-1 border-t border-white/10 pt-4 text-sm font-medium text-brand-navy-muted">
                    {t.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
