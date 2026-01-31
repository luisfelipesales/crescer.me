import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { usePostSessionOffer } from "@/hooks/usePostSessionOffer";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostSessionOfferDialog } from "@/components/patient/PostSessionOfferDialog";
import { ScheduleNextSessionCard } from "@/components/patient/ScheduleNextSessionCard";
import { PatientAssessments } from "@/components/assessment/PatientAssessments";
import { supabase } from "@/integrations/supabase/client";
import { format, isFuture, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, FileText, Settings, LogOut, Loader2, Shield } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments"> & {
  therapist: { full_name: string } | null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { profile, isAdmin, isTherapist, loading: profileLoading } = useProfile();
  const { pendingOffer, lastSession, activePackage, refresh: refreshOffers } = usePostSessionOffer(profile?.id);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Mostrar dialog de oferta pós-sessão quando houver oferta pendente
  useEffect(() => {
    if (pendingOffer && !showOfferDialog) {
      setShowOfferDialog(true);
    }
  }, [pendingOffer]);

  useEffect(() => {
    if (profile) {
      fetchNextAppointment();
    }
  }, [profile]);

  const fetchNextAppointment = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from("appointments")
        .select(`
          *,
          therapist:profiles!appointments_therapist_id_fkey(full_name)
        `)
        .or(`patient_id.eq.${profile.id},scheduled_by.eq.${profile.id}`)
        .gte("scheduled_at", new Date().toISOString())
        .in("status", ["pending", "confirmed"])
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single();

      setNextAppointment(data as Appointment | null);
    } catch (error) {
      // No appointment found is OK
    } finally {
      setLoadingAppointment(false);
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

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      icon: Calendar,
      title: "Agendar consulta",
      description: "Marque uma nova consulta com nossos especialistas",
      href: "/agendar",
    },
    {
      icon: Clock,
      title: "Minhas consultas",
      description: "Veja suas consultas agendadas e histórico",
      href: "/consultas",
    },
    {
      icon: User,
      title: "Meu perfil",
      description: "Atualize suas informações pessoais",
      href: "/perfil",
    },
    {
      icon: FileText,
      title: "Documentos",
      description: "Acesse relatórios e documentos",
      href: "/prontuario/" + (profile?.id || ""),
    },
  ];

  const therapistQuickActions = [
    {
      icon: Calendar,
      title: "Minha agenda",
      description: "Gerencie suas consultas e disponibilidade",
      href: "/terapeuta",
    },
    {
      icon: User,
      title: "Meus pacientes",
      description: "Veja seus pacientes atribuídos",
      href: "/terapeuta?tab=patients",
    },
    {
      icon: FileText,
      title: "Portal do Terapeuta",
      description: "Acesse todas as ferramentas do terapeuta",
      href: "/terapeuta",
    },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Olá, {profile?.full_name || user.user_metadata?.full_name || "Paciente"}! 👋
              </h1>
              <p className="mt-1 text-muted-foreground">
                Bem-vindo(a) ao seu portal de saúde mental
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isTherapist && (
                <Link to="/terapeuta">
                  <Button variant="default" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Portal do Terapeuta
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Painel admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Próxima consulta */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Próxima consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAppointment ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando...
                </div>
              ) : nextAppointment ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {format(new Date(nextAppointment.scheduled_at), "EEEE, dd 'de' MMMM", {
                        locale: ptBR,
                      })}{" "}
                      às {format(new Date(nextAppointment.scheduled_at), "HH:mm")}
                    </p>
                    <p className="text-muted-foreground">
                      Com {nextAppointment.therapist?.full_name || "Terapeuta"}
                    </p>
                  </div>
                  <Link to="/consultas">
                    <Button variant="outline">Ver Detalhes</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      Nenhuma consulta agendada
                    </p>
                    <p className="text-muted-foreground">
                      Agende sua primeira consulta para começar o tratamento
                    </p>
                  </div>
                  <Link to="/agendar">
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Agora
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA para agendar próxima sessão - aparece se teve sessão recente e não tem próxima agendada */}
          {lastSession && !nextAppointment && differenceInDays(new Date(), lastSession.completed_at) <= 14 && (
            <div className="mb-8">
              <ScheduleNextSessionCard
                therapistId={lastSession.therapist_id}
                therapistName={lastSession.therapist_name}
                lastSessionDate={lastSession.completed_at}
                hasActivePackage={!!activePackage}
                remainingSessions={activePackage?.remaining || 0}
              />
            </div>
          )}

          {/* Questionários Pendentes */}
          {profile && (
            <div className="mb-8">
              <PatientAssessments patientId={profile.id} />
            </div>
          )}

          {/* Quick Actions */}
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
            Acesso rápido
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-8 rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-foreground">
              Precisa de ajuda?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre em contato conosco pelo e-mail{" "}
              <a href="mailto:contato@crescer.me" className="text-primary hover:underline">
                contato@crescer.me
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Dialog de oferta pós-sessão */}
      {pendingOffer && (
        <PostSessionOfferDialog
          open={showOfferDialog}
          onOpenChange={setShowOfferDialog}
          offer={pendingOffer}
          patientId={profile?.id || ""}
          onAccept={refreshOffers}
          onDecline={refreshOffers}
        />
      )}
    </Layout>
  );
}
