import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const audiences = [
  {
    emoji: "👶",
    title: "Crianças",
    age: "3-12 anos",
    description:
      "Ajudamos crianças a desenvolver habilidades emocionais através de terapia lúdica e técnicas adaptadas à sua idade.",
    conditions: ["Ansiedade", "TDAH", "Comportamento", "Medos"],
    color: "bg-mint",
    borderColor: "border-mint-foreground/20",
  },
  {
    emoji: "🧑‍🎓",
    title: "Adolescentes",
    age: "13-17 anos",
    description:
      "Apoiamos adolescentes nos desafios únicos dessa fase, desde pressão escolar até questões de identidade.",
    conditions: ["Depressão", "Autoestima", "Redes Sociais", "Estresse"],
    color: "bg-lavender",
    borderColor: "border-lavender-foreground/20",
  },
  {
    emoji: "🎓",
    title: "Jovens Adultos",
    age: "18-25 anos",
    description:
      "Auxiliamos na transição para a vida adulta, incluindo faculdade, carreira e relacionamentos.",
    conditions: ["Transições", "Ansiedade Social", "Independência"],
    color: "bg-peach",
    borderColor: "border-peach-foreground/20",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Pais e Famílias",
    age: "Todas as idades",
    description:
      "Treinamos pais com ferramentas práticas para apoiar seus filhos e melhorar a dinâmica familiar.",
    conditions: ["Comunicação", "Limites", "Conflitos", "Apoio"],
    color: "bg-sky",
    borderColor: "border-sky-foreground/20",
  },
];

export function AudienceSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Quem atendemos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos suporte especializado para cada fase do desenvolvimento,
            com abordagens personalizadas para cada faixa etária.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${audience.borderColor} bg-card p-6 card-hover`}
            >
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${audience.color} mb-4`}
              >
                <span className="text-3xl">{audience.emoji}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{audience.age}</p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {audience.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {audience.conditions.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 transition-transform group-hover:scale-x-100" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/abordagem">
            <Button variant="outline" size="lg" className="group">
              Conheça nossa abordagem
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
