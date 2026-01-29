import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    content:
      "Minha filha tinha muita ansiedade escolar e depois de 3 meses de terapia, ela está completamente diferente. A abordagem da equipe foi incrível, sempre nos mantendo informados do progresso.",
    author: "Marina S.",
    role: "Mãe de Sofia, 9 anos",
    condition: "Ansiedade",
    rating: 5,
  },
  {
    content:
      "O treinamento de pais foi transformador para nossa família. Aprendemos a lidar melhor com os comportamentos desafiadores do nosso filho e hoje temos uma convivência muito mais harmoniosa.",
    author: "Carlos e Ana",
    role: "Pais de Lucas, 7 anos",
    condition: "TDAH",
    rating: 5,
  },
  {
    content:
      "Meu adolescente estava passando por um momento muito difícil com autoestima. A terapeuta conseguiu criar uma conexão incrível com ele e hoje ele está muito mais confiante.",
    author: "Patrícia M.",
    role: "Mãe de Gabriel, 15 anos",
    condition: "Autoestima",
    rating: 5,
  },
  {
    content:
      "A equipe é extremamente profissional e acolhedora. Minha filha se sentia muito à vontade nas sessões e os resultados foram rápidos e consistentes.",
    author: "Fernanda L.",
    role: "Mãe de Beatriz, 11 anos",
    condition: "TOC",
    rating: 5,
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
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="pill-badge mx-auto mb-4">Depoimentos</div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
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
              className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 transition-all duration-300 hover:shadow-xl"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {testimonial.condition}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile - Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 shadow-lg">
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              "{testimonials[currentIndex].content}"
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
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
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
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
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30"
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
