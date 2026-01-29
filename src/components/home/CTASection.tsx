import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";

const benefits = [
  "Triagem inicial gratuita de 30 minutos",
  "Avaliação completa das necessidades",
  "Plano de tratamento personalizado",
  "Suporte contínuo para a família",
];

export function CTASection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-accent p-8 md:p-12 lg:p-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl leading-tight">
                Dê o primeiro passo para o bem-estar do seu filho
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-lg mx-auto lg:mx-0">
                Faça sua triagem inicial gratuita e descubra como podemos ajudar
                sua família a encontrar o caminho para uma vida mais equilibrada.
              </p>

              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-primary-foreground/90 justify-center lg:justify-start"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-card rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Agenda disponível
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Agende sua consulta
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Triagem gratuita para conhecer nossa equipe
                  </p>
                </div>

                <div className="space-y-4">
                  <Link to="/agendar" className="block">
                    <Button size="lg" className="w-full h-14 text-base shadow-lg shadow-primary/25 group">
                      <Calendar className="mr-2 h-5 w-5" />
                      Agendar consulta gratuita
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <Link to="/contato" className="block">
                    <Button variant="outline" size="lg" className="w-full h-14 text-base group">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Falar com a equipe
                    </Button>
                  </Link>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Respondemos em até 2 horas durante o horário comercial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
