import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleNextSessionCardProps {
  therapistId: string;
  therapistName: string;
  lastSessionDate: Date;
  hasActivePackage?: boolean;
  remainingSessions?: number;
}

export function ScheduleNextSessionCard({
  therapistId,
  therapistName,
  lastSessionDate,
  hasActivePackage = false,
  remainingSessions = 0,
}: ScheduleNextSessionCardProps) {
  const suggestedDate = addDays(lastSessionDate, 7);

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Continue seu progresso!
              </h3>
              {hasActivePackage && remainingSessions > 0 && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {remainingSessions} sessões restantes
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Agende sua próxima sessão com {therapistName}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Sugestão:{" "}
                {format(suggestedDate, "EEEE, dd/MM", { locale: ptBR })}
              </span>
            </div>
          </div>

          <Link to={`/agendar?therapist=${therapistId}`}>
            <Button size="lg" className="w-full md:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar próxima sessão
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
