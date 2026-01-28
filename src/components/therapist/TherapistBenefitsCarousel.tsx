import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  CreditCard, 
  Bell, 
  HeadphonesIcon, 
  UserCheck, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Calendar,
    title: "Agendamento simplificado",
    description: "Seus pacientes agendam e remarcam direto pela plataforma, sem troca de mensagens.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Pagamentos organizados",
    description: "Receba seus repasses de forma transparente com histórico completo e recibos automáticos.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description: "Pacientes recebem lembretes de consulta, reduzindo faltas e cancelamentos de última hora.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte dedicado",
    description: "Equipe de suporte para resolver questões administrativas e técnicas rapidamente.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: UserCheck,
    title: "Pacientes qualificados",
    description: "Triagem inicial garante que você receba pacientes alinhados com sua especialidade.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    title: "Prontuário integrado",
    description: "Registre sessões e acompanhe a evolução dos pacientes de forma organizada.",
    color: "bg-teal-100 text-teal-600",
  },
];

export function TherapistBenefitsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    goTo(currentIndex === 0 ? benefits.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    goTo((currentIndex + 1) % benefits.length);
  };

  const currentBenefit = benefits[currentIndex];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Por que continuar no Crescer
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative p-6">
          <div 
            className="flex items-start gap-4 transition-all duration-500"
            key={currentIndex}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentBenefit.color}`}>
              <currentBenefit.icon className="h-6 w-6" />
            </div>
            <div className="animate-fade-in">
              <h3 className="font-semibold text-foreground">
                {currentBenefit.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {currentBenefit.description}
              </p>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="mt-4 flex justify-center gap-1.5">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/20 w-1.5 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
