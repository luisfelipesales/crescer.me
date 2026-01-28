import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/errorLogger";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Maximize,
  MessageSquare,
  Users,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments"> & {
  therapist: { full_name: string } | null;
  patient: { full_name: string } | null;
};

export default function VideoCall() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [inCall, setInCall] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (appointmentId && profile) {
      fetchAppointment();
    }
  }, [appointmentId, profile]);

  useEffect(() => {
    // Load Jitsi Meet External API
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  const fetchAppointment = async () => {
    if (!appointmentId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          therapist:profiles!appointments_therapist_id_fkey(full_name),
          patient:profiles!appointments_patient_id_fkey(full_name)
        `)
        .eq("id", appointmentId)
        .single();

      if (error) throw error;
      
      // Verify user has access to this appointment
      const hasAccess = 
        data.patient_id === profile?.id || 
        data.therapist_id === profile?.id ||
        data.scheduled_by === profile?.id;

      if (!hasAccess) {
        navigate("/consultas");
        return;
      }

      setAppointment(data as Appointment);
    } catch (error) {
      logError("VideoCall.fetchAppointment", error);
      navigate("/consultas");
    } finally {
      setLoading(false);
    }
  };

  const startCall = () => {
    if (!jitsiLoaded || !jitsiContainerRef.current || !appointment) return;

    const domain = "meet.jit.si";
    const roomName = appointment.meeting_room_id || `clinica-${appointment.id}`;
    
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: profile?.full_name || "Participante",
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "chat",
          "recording",
          "settings",
          "raisehand",
          "videoquality",
          "tileview",
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: "#1a1a2e",
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        MOBILE_APP_PROMO: false,
      },
      lang: "pt-BR",
    };

    // @ts-ignore - JitsiMeetExternalAPI is loaded dynamically
    jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    
    jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
      setInCall(false);
      navigate("/consultas");
    });

    setInCall(true);
  };

  const endCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("hangup");
    }
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !appointment) {
    return null;
  }

  const isTherapist = profile?.id === appointment.therapist_id;
  const otherParticipant = isTherapist 
    ? appointment.patient?.full_name 
    : appointment.therapist?.full_name;

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a2e]">
      {/* Header */}
      {!inCall && (
        <header className="border-b border-white/10 bg-[#1a1a2e] px-4 py-4">
          <div className="container-custom flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/consultas")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div className="text-center text-white">
              <p className="text-sm opacity-70">Teleconsulta</p>
              <p className="font-medium">
                {format(new Date(appointment.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="w-20" />
          </div>
        </header>
      )}

      {/* Pre-call screen */}
      {!inCall && (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-lg border-white/10 bg-white/5 text-white">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                <Video className="h-10 w-10 text-primary" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-bold">
                Pronto para a consulta?
              </h1>
              <p className="mb-8 text-white/70">
                Sua sessão com <span className="font-medium text-white">{otherParticipant}</span>
              </p>
              
              <div className="mb-8 space-y-3 text-left text-sm text-white/70">
                <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <Video className="h-5 w-5 text-primary" />
                  <span>Verifique se sua câmera está funcionando</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <Mic className="h-5 w-5 text-primary" />
                  <span>Teste seu microfone antes de começar</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Encontre um local silencioso e bem iluminado</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={startCall}
                disabled={!jitsiLoaded}
              >
                {jitsiLoaded ? (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Entrar na Consulta
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Carregando...
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Jitsi container */}
      <div
        ref={jitsiContainerRef}
        className={`flex-1 ${inCall ? "block" : "hidden"}`}
        style={{ minHeight: inCall ? "100vh" : 0 }}
      />
    </div>
  );
}
