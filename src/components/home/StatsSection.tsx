import { TrendingUp, Award, Clock, Users } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "94%",
    label: "dos pais relataram melhoras significativas nos sintomas",
    color: "bg-mint",
  },
  {
    icon: Award,
    value: "85%",
    label: "das crianças alcançaram suas metas terapêuticas",
    color: "bg-lavender",
  },
  {
    icon: Clock,
    value: "8",
    label: "semanas em média para ver resultados mensuráveis",
    color: "bg-peach",
  },
  {
    icon: Users,
    value: "+500",
    label: "famílias transformadas pela nossa abordagem",
    color: "bg-sky",
  },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Resultados que fazem a diferença
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa abordagem baseada em evidências científicas proporciona 
            resultados mensuráveis e duradouros para crianças e famílias.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-background p-6 card-hover"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {stat.label}
                </p>
              </div>
              {/* Decorative gradient */}
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 transition-transform group-hover:scale-150" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
