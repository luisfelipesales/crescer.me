import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

const trustBadges = [
  "Triagem inicial gratuita",
  "Psicólogos especializados",
  "Atendimento online ou presencial",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-custom relative">
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28 items-center">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="pill-badge self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>O melhor cuidado em saúde mental para seu filho</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Saúde emocional{" "}
                <span className="text-gradient-primary">é pra toda família</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Impulsionamos o desenvolvimento emocional de crianças e adolescentes. 
                Do bem-estar ao pico do potencial, acelere a mudança que quer ver nos seus filhos.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/agendar">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar consulta
                </Button>
              </Link>
              <Link to="/abordagem">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-base group"
                >
                  Como funciona
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-3 pt-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px]">
              {/* Main image container - Zenklub style with rounded corners */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-lavender">
                {/* Placeholder for hero image - shows happy family/children */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-6">👨‍👩‍👧‍👦</div>
                    <p className="font-display text-xl font-semibold text-foreground">
                      Famílias mais felizes
                    </p>
                    <p className="text-muted-foreground mt-2">
                      +500 famílias atendidas
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating notification card - top right */}
              <div className="absolute -top-4 -right-4 md:top-4 md:right-[-60px] bg-card rounded-2xl p-4 shadow-xl border border-border/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-xl">
                    📅
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sua sessão é hoje!</p>
                    <p className="font-semibold text-foreground text-sm">14h às 15h</p>
                  </div>
                </div>
              </div>

              {/* Floating stats card - bottom left */}
              <div className="absolute -bottom-4 -left-4 md:bottom-8 md:left-[-40px] bg-card rounded-2xl p-4 shadow-xl border border-border/50 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender text-xl">
                    📊
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">94%</p>
                    <p className="text-xs text-muted-foreground">Melhora relatada</p>
                  </div>
                </div>
              </div>

              {/* QR Code style decoration - bottom right */}
              <div className="absolute bottom-4 right-4 bg-card rounded-xl p-3 shadow-lg border border-border/50 hidden md:block">
                <div className="grid grid-cols-4 gap-1 w-16 h-16">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
                <p className="text-[8px] text-center text-muted-foreground mt-1">Baixe o app</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>
    </section>
  );
}
