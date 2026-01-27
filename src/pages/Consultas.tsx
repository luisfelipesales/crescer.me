import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Loader2,
  Plus,
  XCircle,
  CheckCircle,
  AlertCircle,
  Video,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments"> & {
  therapist: { full_name: string } | null;
  is_online?: boolean;
  meeting_room_id?: string | null;
};

export default function Consultas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchAppointments();
    }
  }, [profile]);

  const fetchAppointments = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          therapist:profiles!appointments_therapist_id_fkey(full_name)
        `)
        .or(`patient_id.eq.${profile.id},scheduled_by.eq.${profile.id}`)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      setAppointments((data as Appointment[]) || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingAppointments = appointments.filter(
    (a) => isFuture(new Date(a.scheduled_at)) || isToday(new Date(a.scheduled_at))
  );
  const pastAppointments = appointments.filter(
    (a) => isPast(new Date(a.scheduled_at)) && !isToday(new Date(a.scheduled_at))
  );

  const getStatusBadge = (status: string, date: Date) => {
    if (status === "cancelled") {
      return <Badge variant="destructive">Cancelada</Badge>;
    }
    if (status === "completed") {
      return <Badge variant="outline">Concluída</Badge>;
    }
    if (isPast(date) && status !== "completed") {
      return <Badge variant="secondary">Não compareceu</Badge>;
    }
    if (status === "confirmed") {
      return <Badge className="bg-primary text-primary-foreground">Confirmada</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const date = new Date(appointment.scheduled_at);
    const canCancel =
      isFuture(date) && appointment.status !== "cancelled" && appointment.status !== "completed";
    
    // Check if it's time for the video call (within 15 minutes before or during the appointment)
    const now = new Date();
    const appointmentStart = date;
    const appointmentEnd = new Date(date.getTime() + (appointment.duration_minutes || 50) * 60000);
    const canJoinCall = 
      appointment.is_online && 
      appointment.status === "confirmed" &&
      now >= new Date(appointmentStart.getTime() - 15 * 60000) && 
      now <= appointmentEnd;

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${
                appointment.is_online ? "bg-blue-500/10" : "bg-primary/10"
              }`}>
                {appointment.is_online ? (
                  <Video className="h-6 w-6 text-blue-500" />
                ) : (
                  <MapPin className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  {getStatusBadge(appointment.status, date)}
                  {appointment.is_online && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-600">
                      <Video className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(date, "HH:mm")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {appointment.therapist?.full_name || "Terapeuta"}
                  </span>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground">
                    Obs: {appointment.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canJoinCall && (
                <Link to={`/video/${appointment.id}`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Video className="mr-1 h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao painel
              </Button>
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Minhas Consultas
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Gerencie suas consultas agendadas
                </p>
              </div>
              <Link to="/agendar">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agendar Nova
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h2 className="mb-2 font-display text-xl font-semibold">
                  Nenhuma consulta encontrada
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Você ainda não tem consultas agendadas
                </p>
                <Link to="/agendar">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agendar Primeira Consulta
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Próximas ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Histórico ({pastAppointments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Nenhuma consulta agendada</p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Nenhuma consulta no histórico</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}
