import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Play, Sparkles } from "lucide-react";
export function HeroSection() {
  return <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-sky/30">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-lavender/20 blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              <span>Triagem inicial gratuita</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cuidando do{" "}
                <span className="text-gradient-primary">futuro emocional</span>{" "}
                do seu filho
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Oferecemos terapia especializada para crianças e adolescentes, 
                com uma abordagem acolhedora e baseada em evidências científicas 
                que realmente funciona.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/agendar">
                <Button size="lg" className="w-full sm:w-auto btn-shadow group">
                  <Phone className="mr-2 h-5 w-5" />
                  Fazer triagem inicial gratuita
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <Play className="mr-2 h-5 w-5" />
                Como funciona
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/70" />)}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">+500</strong> famílias atendidas
                </span>
              </div>
              
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative h-[400px] w-[400px] sm:h-[450px] sm:w-[450px] lg:h-[500px] lg:w-[500px]">
                {/* Decorative circles */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-float" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-mint to-lavender animate-float-delayed" />
                <div className="absolute inset-8 rounded-full bg-card shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🌱</div>
                    <p className="font-display text-xl font-semibold text-foreground">
                      Cada criança merece florescer
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Terapia que transforma
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-20 rounded-2xl bg-card p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint">
                    <span className="text-2xl">😊</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">94%</p>
                    <p className="text-sm text-muted-foreground">Melhora relatada</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-20 rounded-2xl bg-card p-4 shadow-lg animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">8 sessões</p>
                    <p className="text-sm text-muted-foreground">Resultados visíveis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}