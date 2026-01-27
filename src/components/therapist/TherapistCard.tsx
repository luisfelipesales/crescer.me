import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export type TherapistWithDetails = Tables<"profiles"> & {
  availability?: Tables<"therapist_availability">[];
  specialties?: { specialty: Tables<"specialties"> }[];
  nextAvailable?: Date | null;
};

interface TherapistCardProps {
  therapist: TherapistWithDetails;
  onViewSchedule: (therapist: TherapistWithDetails) => void;
}

export function TherapistCard({ therapist, onViewSchedule }: TherapistCardProps) {
  const formatPrice = (priceInCents: number | null) => {
    if (!priceInCents) return "Sob consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatAgeRange = () => {
    const min = therapist.min_age;
    const max = therapist.max_age;
    if (!min && !max) return null;
    if (min && max) return `${min} - ${max} anos`;
    if (min) return `A partir de ${min} anos`;
    if (max) return `Até ${max} anos`;
    return null;
  };

  const formatNextAvailable = () => {
    if (!therapist.nextAvailable) return null;
    const now = new Date();
    const diff = therapist.nextAvailable.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Hoje às ${therapist.nextAvailable.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days === 1) {
      return `Amanhã às ${therapist.nextAvailable.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return therapist.nextAvailable.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const topSpecialties = therapist.specialties?.slice(0, 3) || [];
  const ageRange = formatAgeRange();
  const nextAvailable = formatNextAvailable();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
      {/* Header with avatar */}
      <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-card shadow-md">
            {therapist.avatar_url ? (
              <img
                src={therapist.avatar_url}
                alt={therapist.full_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground truncate">
              {therapist.full_name}
            </h3>
            {therapist.therapeutic_approach && (
              <p className="text-sm text-primary font-medium truncate">
                {therapist.therapeutic_approach}
              </p>
            )}
            {ageRange && (
              <p className="text-xs text-muted-foreground mt-1">
                Atende: {ageRange}
              </p>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Specialties */}
        {topSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topSpecialties.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {s.specialty.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sessão</span>
          <span className="font-semibold text-foreground">
            {formatPrice(therapist.session_price)}
          </span>
        </div>

        {/* Next available */}
        {nextAvailable && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Próximo horário</p>
              <p className="text-sm font-medium text-foreground truncate">
                {nextAvailable}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          className="w-full"
          onClick={() => onViewSchedule(therapist)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Ver horários
        </Button>
      </CardContent>
    </Card>
  );
}
