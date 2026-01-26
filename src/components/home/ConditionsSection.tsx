import { useRef, useEffect, useState } from "react";

const conditions = [
  { name: "Ansiedade", emoji: "😰" },
  { name: "TDAH", emoji: "⚡" },
  { name: "Depressão", emoji: "💔" },
  { name: "TOC", emoji: "🔄" },
  { name: "Fobias", emoji: "😨" },
  { name: "Autismo", emoji: "🧩" },
  { name: "Trauma", emoji: "🌪️" },
  { name: "Bullying", emoji: "😢" },
  { name: "Luto", emoji: "🕊️" },
  { name: "Comportamento Opositivo", emoji: "😤" },
  { name: "Dificuldades Escolares", emoji: "📚" },
  { name: "Problemas de Sono", emoji: "😴" },
  { name: "Autoestima", emoji: "💪" },
  { name: "Ansiedade Social", emoji: "👥" },
  { name: "Estresse", emoji: "🤯" },
  { name: "Alimentação", emoji: "🍎" },
];

export function ConditionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    let animationId: number;
    let scrollPosition = 0;

    const animate = () => {
      if (!isPaused) {
        scrollPosition += 0.5;
        if (scrollPosition >= scroll.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scroll.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate conditions for infinite scroll effect
  const duplicatedConditions = [...conditions, ...conditions];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
      <div className="container-custom mb-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Condições que tratamos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa equipe é especializada em diversas condições de saúde mental
            infantojuvenil, utilizando tratamentos baseados em evidências.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-hidden whitespace-nowrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="inline-flex gap-4 px-4">
          {duplicatedConditions.map((condition, index) => (
            <div
              key={`${condition.name}-${index}`}
              className="group inline-flex items-center gap-3 rounded-2xl bg-card px-6 py-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <span className="text-2xl">{condition.emoji}</span>
              <span className="font-medium text-foreground whitespace-nowrap">
                {condition.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-custom mt-8 text-center">
        <p className="text-muted-foreground">
          Não encontrou o que procura?{" "}
          <a href="/contato" className="text-primary hover:underline font-medium">
            Entre em contato
          </a>{" "}
          para uma avaliação personalizada.
        </p>
      </div>
    </section>
  );
}
