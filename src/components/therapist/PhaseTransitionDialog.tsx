import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { 
  TreatmentPhaseBadge, 
  TreatmentPhase,
  allPhases,
  getPhaseLabel 
} from "./TreatmentPhaseBadge";

interface PhaseTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatmentId: string;
  currentPhase: TreatmentPhase;
  patientName: string;
  onPhaseChanged: () => void;
}

export function PhaseTransitionDialog({
  open,
  onOpenChange,
  treatmentId,
  currentPhase,
  patientName,
  onPhaseChanged,
}: PhaseTransitionDialogProps) {
  const [selectedPhase, setSelectedPhase] = useState<TreatmentPhase>(currentPhase);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedPhase === currentPhase) {
      toast.info("Selecione uma fase diferente da atual");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("patient_treatments")
        .update({
          current_phase: selectedPhase,
          notes: notes || null,
        })
        .eq("id", treatmentId);

      if (error) throw error;

      toast.success(
        `Fase alterada para "${getPhaseLabel(selectedPhase)}"`
      );
      onPhaseChanged();
      onOpenChange(false);
      setNotes("");
    } catch (error) {
      console.error("Error updating phase:", error);
      toast.error("Erro ao atualizar fase do tratamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Fase do Tratamento</DialogTitle>
          <DialogDescription>
            Paciente: <span className="font-medium text-foreground">{patientName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fase atual:</span>
            <TreatmentPhaseBadge phase={currentPhase} size="md" />
          </div>

          <div className="space-y-3">
            <Label>Nova fase</Label>
            <RadioGroup
              value={selectedPhase}
              onValueChange={(value) => setSelectedPhase(value as TreatmentPhase)}
              className="grid gap-2"
            >
              {allPhases.map((phase) => (
                <label
                  key={phase}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedPhase === phase
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  } ${phase === currentPhase ? "opacity-50" : ""}`}
                >
                  <RadioGroupItem 
                    value={phase} 
                    disabled={phase === currentPhase}
                  />
                  <TreatmentPhaseBadge phase={phase} size="md" />
                  {phase !== currentPhase && selectedPhase === phase && (
                    <ArrowRight className="ml-auto h-4 w-4 text-primary" />
                  )}
                  {phase === currentPhase && (
                    <span className="ml-auto text-xs text-muted-foreground">(atual)</span>
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Motivo da mudança de fase, progresso observado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || selectedPhase === currentPhase}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Mudança
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
