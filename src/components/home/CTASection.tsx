import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Consulta inicial gratuita de 30 minutos",
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
                Dê o primeiro passo para o bem-estar do seu filho
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-lg mx-auto lg:mx-0">
                Agende uma consulta inicial gratuita e descubra como podemos ajudar
                sua família a encontrar o caminho para uma vida mais equilibrada.
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
                    Primeira sessão gratuita para conhecer nossa equipe
                  </p>
                </div>

                <div className="space-y-4">
                  <Link to="/agendar" className="block">
                    <Button size="lg" className="w-full btn-shadow group">
                      <Phone className="mr-2 h-5 w-5" />
                      Agendar consulta grátis
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        ou
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" size="lg" className="w-full group">
                      <svg
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Falar pelo WhatsApp
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
