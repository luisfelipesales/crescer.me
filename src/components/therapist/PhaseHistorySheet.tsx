import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, ArrowRight, History } from "lucide-react";
import { TreatmentPhaseBadge, TreatmentPhase } from "./TreatmentPhaseBadge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhaseHistoryEntry {
  id: string;
  from_phase: TreatmentPhase | null;
  to_phase: TreatmentPhase;
  notes: string | null;
  created_at: string;
  changed_by_name?: string;
}

interface PhaseHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatmentId: string;
  patientName: string;
}

export function PhaseHistorySheet({
  open,
  onOpenChange,
  treatmentId,
  patientName,
}: PhaseHistorySheetProps) {
  const [history, setHistory] = useState<PhaseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && treatmentId) {
      fetchHistory();
    }
  }, [open, treatmentId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("treatment_phase_history")
        .select(`
          *,
          changed_by_profile:profiles!treatment_phase_history_changed_by_fkey(full_name)
        `)
        .eq("treatment_id", treatmentId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedHistory = (data || []).map((entry: any) => ({
        ...entry,
        changed_by_name: entry.changed_by_profile?.full_name || "Sistema",
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching phase history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Fases
          </SheetTitle>
          <SheetDescription>
            Paciente: {patientName}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center">
              <History className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhuma transição de fase registrada
              </p>
            </div>
          ) : (
            <div className="relative space-y-4 pl-6">
              {/* Timeline line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

              {history.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-4 top-2 h-3 w-3 rounded-full border-2 ${
                    index === 0 ? "bg-primary border-primary" : "bg-background border-border"
                  }`} />

                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {entry.from_phase ? (
                        <>
                          <TreatmentPhaseBadge phase={entry.from_phase} size="sm" />
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Início →</span>
                      )}
                      <TreatmentPhaseBadge phase={entry.to_phase} size="sm" />
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>

                    {entry.notes && (
                      <p className="mt-2 text-sm text-muted-foreground border-t pt-2">
                        {entry.notes}
                      </p>
                    )}

                    <div className="mt-2 text-xs text-muted-foreground/70">
                      Por: {entry.changed_by_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
