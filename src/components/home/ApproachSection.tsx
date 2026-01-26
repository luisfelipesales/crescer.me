import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Users, Target, HeartHandshake } from "lucide-react";
const approaches = [{
  icon: Brain,
  title: "Terapia Cognitivo-Comportamental (TCC)",
  description: "Abordagem cientificamente comprovada que ajuda crianças a identificar e modificar pensamentos e comportamentos problemáticos.",
  color: "bg-primary/10 text-primary"
}, {
  icon: Users,
  title: "Treinamento de Pais",
  description: "Capacitamos pais com estratégias práticas para apoiar o desenvolvimento emocional de seus filhos em casa.",
  color: "bg-accent/10 text-accent"
}, {
  icon: Target,
  title: "Tratamento Focado em Resultados",
  description: "Estabelecemos metas claras e mensuráveis, acompanhando o progresso a cada sessão para garantir resultados.",
  color: "bg-lavender text-lavender-foreground"
}, {
  icon: HeartHandshake,
  title: "Abordagem Familiar Integrada",
  description: "Trabalhamos com toda a família para criar um ambiente de suporte que potencialize os resultados da terapia.",
  color: "bg-mint text-mint-foreground"
}];
export function ApproachSection() {
  return <section className="section-padding">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">Nossa metodologia</span>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Uma abordagem que realmente funciona
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Combinamos as mais modernas técnicas de psicologia baseadas em
                evidências com uma abordagem acolhedora e personalizada para cada
                criança e família.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Avaliação Completa</h4>
                  <p className="text-muted-foreground">
                    Entendemos as necessidades únicas de cada criança e família.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Plano Personalizado</h4>
                  <p className="text-muted-foreground">
                    Criamos um plano de tratamento adaptado aos objetivos da família.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Acompanhamento Contínuo</h4>
                  <p className="text-muted-foreground">
                    Monitoramos o progresso e ajustamos o tratamento conforme necessário.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/abordagem">
              <Button size="lg" className="group">
                Saiba mais sobre nossa abordagem
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {approaches.map((approach, index) => <Card key={index} className="group border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${approach.color}`}>
                    <approach.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {approach.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {approach.description}
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </section>;
}