import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, ArrowRight, CheckCircle, Mail } from "lucide-react";

const benefits = [
  "Triagem inicial gratuita de 30 minutos",
  "Avaliação completa das necessidades",
  "Plano de tratamento personalizado",
  "Suporte contínuo para a família",
];

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 lg:p-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                Dê o primeiro passo com segurança
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-lg mx-auto lg:mx-0">
                Faça uma triagem inicial gratuita e descubra o caminho mais indicado 
                para sua família, com orientação e equipe selecionada de terapeutas.
              </p>

              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-primary-foreground/90 justify-center lg:justify-start"
                  >
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Agenda disponível</span>
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
                    <Button size="lg" className="w-full btn-shadow group">
                      <Phone className="mr-2 h-5 w-5" />
                      Fazer triagem inicial gratuita
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <a
                    href="mailto:contato@crescer.me"
                    className="block"
                  >
                    <Button variant="outline" size="lg" className="w-full group">
                      <Mail className="mr-2 h-5 w-5" />
                      Enviar e-mail
                    </Button>
                  </a>
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
