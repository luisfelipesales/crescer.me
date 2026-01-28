import { Shield, CalendarCheck, Bell, HeartHandshake, CreditCard, MessageSquare } from "lucide-react";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Agendamento flexível",
    description: "Remarque ou cancele facilmente quando precisar",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description: "Notificações por e-mail e SMS antes da consulta",
  },
  {
    icon: Shield,
    title: "Ambiente seguro",
    description: "Dados protegidos e comunicação confidencial",
  },
  {
    icon: HeartHandshake,
    title: "Suporte contínuo",
    description: "Acompanhamos sua jornada de cuidado",
  },
  {
    icon: CreditCard,
    title: "Pagamento organizado",
    description: "Histórico completo e pacotes com desconto",
  },
  {
    icon: MessageSquare,
    title: "Chat integrado",
    description: "Comunicação direta com o terapeuta",
  },
];

export function SchedulingBenefits() {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
        Por que agendar pelo Crescer?
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg bg-background/60 p-3 transition-colors hover:bg-background"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <benefit.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">
                {benefit.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
