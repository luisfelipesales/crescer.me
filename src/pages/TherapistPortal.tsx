import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format, isFuture, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  LogOut,
  Loader2,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  BarChart3,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { TherapistSettings } from "@/components/therapist/TherapistSettings";
import { TherapistPatients } from "@/components/therapist/TherapistPatients";
import { TherapistAppointments } from "@/components/therapist/TherapistAppointments";
import { TherapistPayouts } from "@/components/therapist/TherapistPayouts";
import { TherapistBenefitsCarousel } from "@/components/therapist/TherapistBenefitsCarousel";
import { TherapistMetrics } from "@/components/therapist/TherapistMetrics";
import { toast } from "sonner";

export default function TherapistPortal() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { profile, isTherapist, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("appointments");
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    pendingLogs: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (!profileLoading && !isTherapist) {
      toast.error("Acesso restrito a terapeutas");
      navigate("/dashboard");
    }
  }, [user, loading, isTherapist, profileLoading, navigate]);

  useEffect(() => {
    if (profile && isTherapist) {
      fetchStats();
    }
  }, [profile, isTherapist]);

  const fetchStats = async () => {
    if (!profile) return;
    setLoadingStats(true);

    try {
      const today = new Date();
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);

      // Today's appointments
      const { count: todayCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("therapist_id", profile.id)
        .gte("scheduled_at", today.toISOString().split("T")[0])
        .lt("scheduled_at", new Date(today.getTime() + 86400000).toISOString().split("T")[0])
        .in("status", ["pending", "confirmed"]);

      // Week's appointments
      const { count: weekCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("therapist_id", profile.id)
        .gte("scheduled_at", today.toISOString())
        .lt("scheduled_at", weekEnd.toISOString())
        .in("status", ["pending", "confirmed"]);

      // Total unique patients
      const { data: patients } = await supabase
        .from("appointments")
        .select("patient_id")
        .eq("therapist_id", profile.id);

      const uniquePatients = new Set(patients?.map((p) => p.patient_id) || []);

      // Pending session logs (completed appointments without logs)
      const { data: completedAppointments } = await supabase
        .from("appointments")
        .select("id")
        .eq("therapist_id", profile.id)
        .eq("status", "completed");

      const appointmentIds = completedAppointments?.map((a) => a.id) || [];
      
      let pendingLogs = 0;
      if (appointmentIds.length > 0) {
        const { data: existingLogs } = await supabase
          .from("session_logs")
          .select("appointment_id")
          .in("appointment_id", appointmentIds);

        const loggedIds = new Set(existingLogs?.map((l) => l.appointment_id) || []);
        pendingLogs = appointmentIds.filter((id) => !loggedIds.has(id)).length;
      }

      setStats({
        todayAppointments: todayCount || 0,
        weekAppointments: weekCount || 0,
        totalPatients: uniquePatients.size,
        pendingLogs,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isTherapist) {
    return null;
  }

  const statCards = [
    {
      icon: Calendar,
      title: "Hoje",
      value: stats.todayAppointments,
      description: "consultas",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      title: "Esta semana",
      value: stats.weekAppointments,
      description: "consultas",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Pacientes",
      value: stats.totalPatients,
      description: "ativos",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: FileText,
      title: "Pendentes",
      value: stats.pendingLogs,
      description: "registros",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                to="/dashboard"
                className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar ao painel
              </Link>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Portal do Terapeuta
              </h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie sua agenda, pacientes e configurações
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingStats ? "-" : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Carousel */}
          <div className="mb-8">
            <TherapistBenefitsCarousel />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Pacientes</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Métricas</span>
              </TabsTrigger>
              <TabsTrigger value="payouts" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Financeiro</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <TherapistAppointments therapistId={profile?.id || ""} onRefresh={fetchStats} />
            </TabsContent>

            <TabsContent value="patients">
              <TherapistPatients therapistId={profile?.id || ""} />
            </TabsContent>

            <TabsContent value="metrics">
              <TherapistMetrics therapistId={profile?.id || ""} />
            </TabsContent>

            <TabsContent value="payouts">
              <TherapistPayouts therapistId={profile?.id || ""} />
            </TabsContent>

            <TabsContent value="settings">
              <TherapistSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
