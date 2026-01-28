import { useState, useEffect } from "react";
import { Shield, Calendar, Bell, HeartHandshake, Clock, MessageSquare } from "lucide-react";

const patientBenefits = [
  {
    icon: Shield,
    title: "Ambiente seguro",
    description: "Comunicação protegida e dados confidenciais",
  },
  {
    icon: Calendar,
    title: "Agendamento fácil",
    description: "Marque e remarque consultas em segundos",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description: "Nunca perca uma consulta importante",
  },
  {
    icon: HeartHandshake,
    title: "Suporte contínuo",
    description: "Acompanhamento da evolução do tratamento",
  },
];

const therapistBenefits = [
  {
    icon: Clock,
    title: "Gestão simplificada",
    description: "Agenda, pacientes e pagamentos em um só lugar",
  },
  {
    icon: Calendar,
    title: "Controle total",
    description: "Defina horários, preços e disponibilidade",
  },
  {
    icon: MessageSquare,
    title: "Comunicação integrada",
    description: "Chat seguro com pacientes e responsáveis",
  },
  {
    icon: Shield,
    title: "Transparência financeira",
    description: "Recibos e repasses organizados",
  },
];

interface AuthBenefitsProps {
  type: "patient" | "therapist";
}

export function AuthBenefits({ type }: AuthBenefitsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const benefits = type === "patient" ? patientBenefits : therapistBenefits;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % benefits.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [benefits.length]);

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="font-display text-2xl font-bold text-primary-foreground lg:text-3xl">
          {type === "patient" 
            ? "Cuidado especializado para crianças e adolescentes"
            : "Gerencie sua prática com facilidade"
          }
        </h2>
        <p className="mt-2 text-primary-foreground/80">
          {type === "patient"
            ? "Acesse uma rede de profissionais qualificados e acompanhe todo o tratamento em um só lugar."
            : "Foque no que importa: seus pacientes. A gente cuida do resto."
          }
        </p>
      </div>

      <div className="grid gap-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 rounded-xl p-4 transition-all duration-300 ${
              index === activeIndex
                ? "bg-white/20 shadow-lg scale-[1.02]"
                : "bg-white/5"
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
              index === activeIndex ? "bg-accent text-accent-foreground" : "bg-white/10"
            }`}>
              <benefit.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm text-primary-foreground/70">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 lg:justify-start">
        {benefits.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === activeIndex
                ? "bg-accent w-6"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
