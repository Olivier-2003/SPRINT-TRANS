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

export function TestimonialsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-14 md:pb-24 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col gap-3">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Opinie klientów</span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Zaufanie to nasza najlepsza droga</h2>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <ScrollReveal key={t.author + i} delay={i * 90}>
            <Card className="h-full gap-0 rounded-2xl border border-white/10 bg-gradient-to-b from-brand-navy-card to-brand-navy py-0 text-white shadow-xl ring-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <CardContent className="flex flex-col gap-4 px-7 py-8">
                <div className="flex items-center justify-between">
                  <Quote className="size-7 text-primary" />
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="size-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-lg leading-relaxed font-medium text-white">{t.quote}</p>
                <p className="mt-1 border-t border-white/10 pt-3 text-sm font-medium text-brand-navy-muted">
                  {t.author}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
