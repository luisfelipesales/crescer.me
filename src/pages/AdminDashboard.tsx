import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Users,
  UserCheck,
  Clock,
  Settings,
  LogOut,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  CalendarClock,
  MessageSquare,
} from "lucide-react";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments"> & {
  patient: { full_name: string } | null;
  therapist: { full_name: string } | null;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isAdmin, isTherapist, loading: profileLoading } = useProfile();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Tables<"profiles">[]>([]);
  const [therapists, setTherapists] = useState<Tables<"profiles">[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && !isAdmin && !isTherapist) {
      navigate("/dashboard");
    }
  }, [isAdmin, isTherapist, profileLoading, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isTherapist)) {
      fetchData();
    }
  }, [user, isAdmin, isTherapist]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(full_name),
          therapist:profiles!appointments_therapist_id_fkey(full_name)
        `)
        .order("scheduled_at", { ascending: true });

      setAppointments((appointmentsData as Appointment[]) || []);

      // Fetch patients (admin sees all, therapist sees their patients)
      if (isAdmin) {
        const { data: patientsData } = await supabase
          .from("profiles")
          .select("*")
          .in("profile_type", ["patient", "parent"])
          .order("full_name");

        setPatients(patientsData || []);
      } else if (isTherapist && profile) {
        // Therapist sees patients they have appointments with
        const { data: therapistAppointments } = await supabase
          .from("appointments")
          .select("patient_id")
          .eq("therapist_id", profile.id);
        
        if (therapistAppointments && therapistAppointments.length > 0) {
          const patientIds = [...new Set(therapistAppointments.map(a => a.patient_id))];
          const { data: patientsData } = await supabase
            .from("profiles")
            .select("*")
            .in("id", patientIds)
            .order("full_name");
          
          setPatients(patientsData || []);
        }
      }

      // Fetch therapists
      const { data: therapistsData } = await supabase
        .from("profiles")
        .select("*")
        .eq("profile_type", "therapist")
        .order("full_name");

      setTherapists(therapistsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointmentId);

      fetchData();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isTherapist)) {
    return null;
  }

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const todayAppointments = appointments.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.scheduled_at).toDateString() === today;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "Pendente" },
      confirmed: { variant: "default", label: "Confirmado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
      completed: { variant: "outline", label: "Concluído" },
    };
    const { variant, label } = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {isAdmin ? "Painel administrativo" : "Portal do terapeuta"}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Olá, {profile?.full_name || "Usuário"}! Gerencie sua agenda e pacientes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Consultas hoje</CardDescription>
                <CardTitle className="text-3xl">{todayAppointments.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Agendadas para hoje</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pendentes</CardDescription>
                <CardTitle className="text-3xl text-accent">{pendingAppointments.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Aguardando confirmação</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pacientes</CardDescription>
                <CardTitle className="text-3xl">{patients.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Cadastrados</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Terapeutas</CardDescription>
                <CardTitle className="text-3xl">{therapists.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <span>Na equipe</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Consultas
              </TabsTrigger>
              <TabsTrigger value="patients">
                <Users className="mr-2 h-4 w-4" />
                {isAdmin ? "Pacientes" : "Meus Pacientes"}
              </TabsTrigger>
              <TabsTrigger value="therapists">
                <UserCheck className="mr-2 h-4 w-4" />
                Terapeutas
              </TabsTrigger>
              {isTherapist && (
                <TabsTrigger value="availability">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Meus Horários
                </TabsTrigger>
              )}
              <TabsTrigger value="chat" onClick={() => navigate("/chat")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Consultas Agendadas</CardTitle>
                  <CardDescription>
                    Gerencie as consultas e aprove solicitações pendentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Nenhuma consulta agendada</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {appointment.patient?.full_name || "Paciente"}
                              </span>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>Terapeuta: {appointment.therapist?.full_name}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {new Date(appointment.scheduled_at).toLocaleDateString("pt-BR", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{appointment.duration_minutes} min</span>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground">
                                Obs: {appointment.notes}
                              </p>
                            )}
                          </div>
                          {appointment.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateAppointmentStatus(appointment.id, "confirmed")
                                }
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  updateAppointmentStatus(appointment.id, "cancelled")
                                }
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Cancelar
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>{isAdmin ? "Pacientes Cadastrados" : "Meus Pacientes"}</CardTitle>
                  <CardDescription>
                    {isAdmin ? "Lista de todos os pacientes e responsáveis" : "Pacientes com consultas agendadas com você"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : patients.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Nenhum paciente {isAdmin ? "cadastrado" : "encontrado"}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{patient.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {patient.profile_type === "parent" ? "Responsável" : "Paciente"}
                                {patient.phone && ` • ${patient.phone}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/prontuario/${patient.id}`)}
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              Prontuário
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="therapists">
              <Card>
                <CardHeader>
                  <CardTitle>Equipe de Terapeutas</CardTitle>
                  <CardDescription>
                    Profissionais cadastrados na clínica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : therapists.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <UserCheck className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Nenhum terapeuta cadastrado</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {therapists.map((therapist) => (
                        <Card key={therapist.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <UserCheck className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{therapist.full_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {therapist.bio?.slice(0, 50) || "Terapeuta"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isTherapist && profile && (
              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Horários de Atendimento</CardTitle>
                    <CardDescription>
                      Defina sua disponibilidade semanal para consultas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityManager therapistId={profile.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
