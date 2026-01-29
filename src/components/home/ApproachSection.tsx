import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Target, HeartHandshake } from "lucide-react";

const approaches = [
  {
    icon: Brain,
    title: "Terapia Cognitivo-Comportamental",
    description: "Abordagem cientificamente comprovada que ajuda crianças a identificar e modificar pensamentos problemáticos.",
  },
  {
    icon: Users,
    title: "Treinamento de Pais",
    description: "Capacitamos pais com estratégias práticas para apoiar o desenvolvimento emocional em casa.",
  },
  {
    icon: Target,
    title: "Tratamento Focado em Resultados",
    description: "Estabelecemos metas claras e mensuráveis, acompanhando o progresso a cada sessão.",
  },
  {
    icon: HeartHandshake,
    title: "Abordagem Familiar Integrada",
    description: "Trabalhamos com toda a família para criar um ambiente de suporte.",
  },
];

const steps = [
  { number: "1", title: "Avaliação Completa", description: "Entendemos as necessidades únicas de cada criança e família." },
  { number: "2", title: "Plano Personalizado", description: "Criamos um plano de tratamento adaptado aos objetivos da família." },
  { number: "3", title: "Acompanhamento Contínuo", description: "Monitoramos o progresso e ajustamos o tratamento conforme necessário." },
];

export function ApproachSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="pill-badge mb-4">Nossa metodologia</div>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Cuidamos da saúde emocional com{" "}
                <span className="text-gradient-primary">tecnologia e ciência</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Combinamos as mais modernas técnicas de psicologia baseadas em
                evidências com uma abordagem acolhedora e personalizada.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">{step.title}</h4>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/abordagem">
                <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/25 group">
                  Saiba mais sobre nossa abordagem
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {approaches.map((approach, index) => (
              <div 
                key={index} 
                className="group rounded-3xl bg-card border border-border/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <approach.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {approach.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {approach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
