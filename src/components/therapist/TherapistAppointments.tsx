import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format, isPast, isFuture, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type AppointmentWithPatient = Tables<"appointments"> & {
  patient: Tables<"profiles"> | null;
};

interface TherapistAppointmentsProps {
  therapistId: string;
  onRefresh?: () => void;
}

export function TherapistAppointments({
  therapistId,
  onRefresh,
}: TherapistAppointmentsProps) {
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithPatient | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logData, setLogData] = useState({
    attended: true,
    weekly_goal: "",
    homework: "",
    notes: "",
  });
  const [savingLog, setSavingLog] = useState(false);

  useEffect(() => {
    if (therapistId) {
      fetchAppointments();
    }
  }, [therapistId, filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();

      let query = supabase
        .from("appointments")
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(*)
        `)
        .eq("therapist_id", therapistId);

      if (filter === "upcoming") {
        query = query.gte("scheduled_at", now).order("scheduled_at", { ascending: true });
      } else {
        query = query.lt("scheduled_at", now).order("scheduled_at", { ascending: false });
      }

      const { data } = await query.limit(50);
      setAppointments((data as AppointmentWithPatient[]) || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      toast.success(
        newStatus === "confirmed"
          ? "Consulta confirmada!"
          : newStatus === "completed"
          ? "Consulta marcada como concluída!"
          : "Consulta cancelada"
      );

      fetchAppointments();
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar status");
    }
  };

  const openSessionLog = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment);
    setLogData({
      attended: true,
      weekly_goal: "",
      homework: "",
      notes: "",
    });
    setShowLogDialog(true);
  };

  const saveSessionLog = async () => {
    if (!selectedAppointment) return;
    setSavingLog(true);

    try {
      const { error } = await supabase.from("session_logs").upsert({
        appointment_id: selectedAppointment.id,
        therapist_id: therapistId,
        patient_id: selectedAppointment.patient_id,
        attended: logData.attended,
        weekly_goal: logData.weekly_goal || null,
        homework: logData.homework || null,
        notes: logData.notes || null,
      });

      if (error) throw error;

      // Also update appointment status to completed
      await supabase
        .from("appointments")
        .update({ status: "completed" })
        .eq("id", selectedAppointment.id);

      // Criar oferta pós-sessão para o paciente (se compareceu)
      if (logData.attended) {
        await supabase.from("post_session_offers").insert({
          appointment_id: selectedAppointment.id,
          patient_id: selectedAppointment.patient_id,
          therapist_id: therapistId,
          offer_type: "package_4",
          status: "pending",
        });
      }

      toast.success("Registro salvo com sucesso!");
      setShowLogDialog(false);
      fetchAppointments();
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar registro");
    } finally {
      setSavingLog(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmada</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Concluída</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
        >
          Próximas
        </Button>
        <Button
          variant={filter === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("past")}
        >
          Histórico
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground">
              {filter === "upcoming"
                ? "Nenhuma consulta agendada"
                : "Nenhum histórico encontrado"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "upcoming"
                ? "Suas próximas consultas aparecerão aqui"
                : "Consultas passadas aparecerão aqui"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const aptDate = new Date(apt.scheduled_at);
            const aptIsPast = isPast(aptDate);
            const aptIsToday = isToday(aptDate);

            return (
              <Card
                key={apt.id}
                className={`${
                  aptIsToday
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
              >
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  {/* Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      {apt.is_online ? (
                        <Video className="h-6 w-6 text-primary" />
                      ) : (
                        <MapPin className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {apt.patient?.full_name || "Paciente"}
                        </p>
                        {getStatusBadge(apt.status)}
                        {aptIsToday && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Hoje
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(aptDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(aptDate, "HH:mm")}
                        </span>
                        <span>{apt.duration_minutes} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(apt.id, "confirmed")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(apt.id, "cancelled")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && aptIsPast && (
                      <Button size="sm" onClick={() => openSessionLog(apt)}>
                        <FileText className="mr-1 h-4 w-4" />
                        Registrar sessão
                      </Button>
                    )}
                    {apt.status === "confirmed" && !aptIsPast && apt.is_online && (
                      <Button size="sm" asChild>
                        <a
                          href={`/video-call?room=${apt.meeting_room_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="mr-1 h-4 w-4" />
                          Iniciar chamada
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Session Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registro pós-sessão</DialogTitle>
            <DialogDescription>
              {selectedAppointment?.patient?.full_name} -{" "}
              {selectedAppointment &&
                format(new Date(selectedAppointment.scheduled_at), "dd/MM/yyyy HH:mm")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="attended">Paciente compareceu?</Label>
              <Switch
                id="attended"
                checked={logData.attended}
                onCheckedChange={(checked) =>
                  setLogData({ ...logData, attended: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekly_goal">Meta da semana</Label>
              <Textarea
                id="weekly_goal"
                placeholder="Qual foi a meta definida para esta semana?"
                value={logData.weekly_goal}
                onChange={(e) =>
                  setLogData({ ...logData, weekly_goal: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homework">Tarefas para casa</Label>
              <Textarea
                id="homework"
                placeholder="Quais atividades foram passadas para o paciente?"
                value={logData.homework}
                onChange={(e) =>
                  setLogData({ ...logData, homework: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Outras observações relevantes..."
                value={logData.notes}
                onChange={(e) =>
                  setLogData({ ...logData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowLogDialog(false)}
                disabled={savingLog}
              >
                Cancelar
              </Button>
              <Button onClick={saveSessionLog} disabled={savingLog}>
                {savingLog ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar registro"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
