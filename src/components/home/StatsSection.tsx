import { TrendingUp, Award, Clock, Users } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "94%",
    label: "dos pais relataram melhoras significativas nos sintomas",
  },
  {
    icon: Award,
    value: "85%",
    label: "das crianças alcançaram suas metas terapêuticas",
  },
  {
    icon: Clock,
    value: "8",
    label: "semanas em média para ver resultados mensuráveis",
  },
  {
    icon: Users,
    value: "+500",
    label: "famílias transformadas pela nossa abordagem",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container-custom">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="font-display text-4xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px] mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
