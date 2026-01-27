import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

interface PatientInfo {
  profile: Tables<"profiles">;
  appointmentCount: number;
  lastAppointment: string | null;
  nextAppointment: string | null;
}

interface TherapistPatientsProps {
  therapistId: string;
}

export function TherapistPatients({ therapistId }: TherapistPatientsProps) {
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (!appointments) {
        setPatients([]);
        return;
      }

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
          });
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <Card key={patient.profile.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
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
          </CardHeader>
          <CardContent className="space-y-2">
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
  );
}
