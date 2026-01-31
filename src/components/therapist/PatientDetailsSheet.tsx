import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TherapistAssessmentManager } from "@/components/assessment/TherapistAssessmentManager";
import { TreatmentPhaseBadge, TreatmentPhase } from "./TreatmentPhaseBadge";
import { PhaseTransitionDialog } from "./PhaseTransitionDialog";
import { PhaseHistorySheet } from "./PhaseHistorySheet";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, History, ClipboardList, FileText, User } from "lucide-react";

interface PatientDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: {
    id: string;
    name: string;
    treatmentId?: string;
    currentPhase?: TreatmentPhase;
  };
  therapistId: string;
  onRefresh: () => void;
}

export function PatientDetailsSheet({
  open,
  onOpenChange,
  patient,
  therapistId,
  onRefresh,
}: PatientDetailsSheetProps) {
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle>{patient.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  {patient.currentPhase && (
                    <TreatmentPhaseBadge phase={patient.currentPhase} size="sm" />
                  )}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Phase Actions */}
          {patient.treatmentId && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhaseDialogOpen(true)}
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Alterar Fase
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistorySheetOpen(true)}
              >
                <History className="mr-2 h-4 w-4" />
                Histórico
              </Button>
            </div>
          )}

          <Tabs defaultValue="assessments" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assessments" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Prontuário
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-280px)] mt-4">
              <TabsContent value="assessments" className="mt-0">
                <TherapistAssessmentManager
                  therapistId={therapistId}
                  patientId={patient.id}
                  patientName={patient.name}
                  treatmentId={patient.treatmentId}
                />
              </TabsContent>

              <TabsContent value="records" className="mt-0">
                <div className="py-8 text-center text-muted-foreground">
                  <FileText className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2 text-sm">
                    Acesse o prontuário completo pela página de prontuários
                  </p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => window.open(`/prontuario/${patient.id}`, "_blank")}
                  >
                    Abrir Prontuário
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Phase Dialogs */}
      {patient.treatmentId && patient.currentPhase && (
        <>
          <PhaseTransitionDialog
            open={phaseDialogOpen}
            onOpenChange={setPhaseDialogOpen}
            treatmentId={patient.treatmentId}
            currentPhase={patient.currentPhase}
            patientName={patient.name}
            onPhaseChanged={onRefresh}
          />
          <PhaseHistorySheet
            open={historySheetOpen}
            onOpenChange={setHistorySheetOpen}
            treatmentId={patient.treatmentId}
            patientName={patient.name}
          />
        </>
      )}
    </>
  );
}
