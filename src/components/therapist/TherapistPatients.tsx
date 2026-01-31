import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Calendar, MoreHorizontal, History, ArrowRightLeft, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";
import { TreatmentPhaseBadge, TreatmentPhase } from "./TreatmentPhaseBadge";
import { PhaseTransitionDialog } from "./PhaseTransitionDialog";
import { PhaseHistorySheet } from "./PhaseHistorySheet";
import { PatientDetailsSheet } from "./PatientDetailsSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientInfo {
  profile: Tables<"profiles">;
  appointmentCount: number;
  lastAppointment: string | null;
  nextAppointment: string | null;
  treatment?: {
    id: string;
    current_phase: TreatmentPhase;
    phase_started_at: string;
    treatment_started_at: string;
  };
}

interface TherapistPatientsProps {
  therapistId: string;
}

export function TherapistPatients({ therapistId }: TherapistPatientsProps) {
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  useEffect(() => {
    if (therapistId) {
      fetchPatients();
    }
  }, [therapistId]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Get all appointments for this therapist
      const { data: appointments } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(*)
        `)
        .eq("therapist_id", therapistId)
        .order("scheduled_at", { ascending: false });

      // Get all treatments for this therapist
      const { data: treatments } = await supabase
        .from("patient_treatments")
        .select("*")
        .eq("therapist_id", therapistId);

      if (!appointments) {
        setPatients([]);
        return;
      }

      // Create a map of treatments by patient_id
      const treatmentMap = new Map<string, typeof treatments[0]>();
      (treatments || []).forEach((t: any) => {
        treatmentMap.set(t.patient_id, t);
      });

      // Group by patient
      const patientMap = new Map<string, PatientInfo>();
      const now = new Date();

      appointments.forEach((apt) => {
        if (!apt.patient) return;

        const patientId = apt.patient_id;
        const existing = patientMap.get(patientId);
        const aptDate = new Date(apt.scheduled_at);
        const isPast = aptDate < now;
        const isFuture = aptDate > now;

        const treatment = treatmentMap.get(patientId);

        if (existing) {
          existing.appointmentCount++;
          if (isPast && (!existing.lastAppointment || aptDate > new Date(existing.lastAppointment))) {
            existing.lastAppointment = apt.scheduled_at;
          }
          if (isFuture && (!existing.nextAppointment || aptDate < new Date(existing.nextAppointment))) {
            existing.nextAppointment = apt.scheduled_at;
          }
        } else {
          patientMap.set(patientId, {
            profile: apt.patient as Tables<"profiles">,
            appointmentCount: 1,
            lastAppointment: isPast ? apt.scheduled_at : null,
            nextAppointment: isFuture ? apt.scheduled_at : null,
            treatment: treatment ? {
              id: treatment.id,
              current_phase: treatment.current_phase as TreatmentPhase,
              phase_started_at: treatment.phase_started_at,
              treatment_started_at: treatment.treatment_started_at,
            } : undefined,
          });
        }
      });

      // Create treatments for patients that don't have one
      const patientsWithoutTreatment = Array.from(patientMap.values()).filter(p => !p.treatment);
      
      for (const patient of patientsWithoutTreatment) {
        const { data: newTreatment, error } = await supabase
          .from("patient_treatments")
          .insert({
            patient_id: patient.profile.id,
            therapist_id: therapistId,
            current_phase: "triagem",
          })
          .select()
          .single();

        if (!error && newTreatment) {
          const patientInfo = patientMap.get(patient.profile.id);
          if (patientInfo) {
            patientInfo.treatment = {
              id: newTreatment.id,
              current_phase: newTreatment.current_phase as TreatmentPhase,
              phase_started_at: newTreatment.phase_started_at,
              treatment_started_at: newTreatment.treatment_started_at,
            };
          }
        }
      }

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = () => {
    fetchPatients();
  };

  const openPhaseDialog = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setPhaseDialogOpen(true);
  };

  const openHistorySheet = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setHistorySheetOpen(true);
  };

  const openDetailsSheet = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setDetailsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="font-semibold text-foreground">Nenhum paciente ainda</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Seus pacientes aparecerão aqui após a primeira consulta
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <Card key={patient.profile.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {patient.profile.avatar_url ? (
                      <img
                        src={patient.profile.avatar_url}
                        alt={patient.profile.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{patient.profile.full_name}</CardTitle>
                    {patient.profile.date_of_birth && (
                      <CardDescription className="text-xs">
                        {new Date().getFullYear() -
                          new Date(patient.profile.date_of_birth).getFullYear()}{" "}
                        anos
                      </CardDescription>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDetailsSheet(patient)}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Assessments
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPhaseDialog(patient)}>
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Alterar Fase
                    </DropdownMenuItem>
                    {patient.treatment && (
                      <DropdownMenuItem onClick={() => openHistorySheet(patient)}>
                        <History className="mr-2 h-4 w-4" />
                        Histórico de Fases
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Treatment Phase Badge */}
              {patient.treatment && (
                <div className="flex items-center justify-between">
                  <TreatmentPhaseBadge phase={patient.treatment.current_phase} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    desde {format(new Date(patient.treatment.phase_started_at), "dd/MM/yy", { locale: ptBR })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de sessões</span>
                <Badge variant="secondary">{patient.appointmentCount}</Badge>
              </div>

              {patient.lastAppointment && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Última:</span>
                  <span className="text-foreground">
                    {format(new Date(patient.lastAppointment), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}

              {patient.nextAppointment && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Próxima:</span>
                  <span className="font-medium text-primary">
                    {format(new Date(patient.nextAppointment), "dd/MM 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phase Transition Dialog */}
      {selectedPatient?.treatment && (
        <PhaseTransitionDialog
          open={phaseDialogOpen}
          onOpenChange={setPhaseDialogOpen}
          treatmentId={selectedPatient.treatment.id}
          currentPhase={selectedPatient.treatment.current_phase}
          patientName={selectedPatient.profile.full_name}
          onPhaseChanged={handlePhaseChange}
        />
      )}

      {/* Phase History Sheet */}
      {selectedPatient?.treatment && (
        <PhaseHistorySheet
          open={historySheetOpen}
          onOpenChange={setHistorySheetOpen}
          treatmentId={selectedPatient.treatment.id}
          patientName={selectedPatient.profile.full_name}
        />
      )}

      {/* Patient Details Sheet */}
      {selectedPatient && (
        <PatientDetailsSheet
          open={detailsSheetOpen}
          onOpenChange={setDetailsSheetOpen}
          patient={{
            id: selectedPatient.profile.id,
            name: selectedPatient.profile.full_name,
            treatmentId: selectedPatient.treatment?.id,
            currentPhase: selectedPatient.treatment?.current_phase,
          }}
          therapistId={therapistId}
          onRefresh={handlePhaseChange}
        />
      )}
    </>
  );
}
