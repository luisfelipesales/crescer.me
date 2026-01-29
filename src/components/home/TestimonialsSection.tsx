import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    content:
      "Minha filha tinha muita ansiedade escolar e depois de 3 meses de terapia, ela está completamente diferente. A abordagem da equipe foi incrível, sempre nos mantendo informados do progresso.",
    author: "Marina S.",
    role: "Mãe de Sofia, 9 anos",
    condition: "Ansiedade",
    color: "bg-mint",
  },
  {
    content:
      "O treinamento de pais foi transformador para nossa família. Aprendemos a lidar melhor com os comportamentos desafiadores do nosso filho e hoje temos uma convivência muito mais harmoniosa.",
    author: "Carlos e Ana",
    role: "Pais de Lucas, 7 anos",
    condition: "TDAH",
    color: "bg-lavender",
  },
  {
    content:
      "Meu adolescente estava passando por um momento muito difícil com autoestima. A terapeuta conseguiu criar uma conexão incrível com ele e hoje ele está muito mais confiante.",
    author: "Patrícia M.",
    role: "Mãe de Gabriel, 15 anos",
    condition: "Autoestima",
    color: "bg-peach",
  },
  {
    content:
      "A equipe é extremamente profissional e acolhedora. Minha filha se sentia muito à vontade nas sessões e os resultados foram rápidos e consistentes.",
    author: "Fernanda L.",
    role: "Mãe de Beatriz, 11 anos",
    condition: "TOC",
    color: "bg-sky",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            O que as famílias dizem
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de famílias que transformaram suas vidas com nossa ajuda.
          </p>
        </div>

        {/* Desktop - Grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-md transition-all hover:shadow-xl"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full ${testimonial.color} flex items-center justify-center font-display font-bold text-foreground`}
                >
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <span
                className={`absolute top-4 right-4 inline-flex items-center rounded-full ${testimonial.color} px-2 py-1 text-xs font-medium`}
              >
                {testimonial.condition}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile - Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-lg">
            <Quote className="h-8 w-8 text-primary/20 mb-4" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              "{testimonials[currentIndex].content}"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full ${testimonials[currentIndex].color} flex items-center justify-center font-display font-bold text-foreground`}
                >
                  {testimonials[currentIndex].author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full ${testimonials[currentIndex].color} px-3 py-1 text-xs font-medium`}
              >
                {testimonials[currentIndex].condition}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
