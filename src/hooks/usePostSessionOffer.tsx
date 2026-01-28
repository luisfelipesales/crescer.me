import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/errorLogger";

interface PostSessionOffer {
  id: string;
  appointment_id: string;
  therapist_id: string;
  therapist_name: string;
  session_price: number;
}

interface LastCompletedSession {
  therapist_id: string;
  therapist_name: string;
  completed_at: Date;
}

interface ActivePackage {
  id: string;
  therapist_id: string;
  total_sessions: number;
  used_sessions: number;
  remaining: number;
}

export function usePostSessionOffer(patientId: string | undefined) {
  const [pendingOffer, setPendingOffer] = useState<PostSessionOffer | null>(null);
  const [lastSession, setLastSession] = useState<LastCompletedSession | null>(null);
  const [activePackage, setActivePackage] = useState<ActivePackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  const fetchData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      // Buscar oferta pendente
      const { data: offers } = await supabase
        .from("post_session_offers")
        .select(`
          id,
          appointment_id,
          therapist_id
        `)
        .eq("patient_id", patientId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      if (offers && offers.length > 0) {
        const offer = offers[0];
        
        // Buscar dados do terapeuta
        const { data: therapist } = await supabase
          .from("profiles")
          .select("full_name, session_price")
          .eq("id", offer.therapist_id)
          .maybeSingle();

        if (therapist) {
          setPendingOffer({
            id: offer.id,
            appointment_id: offer.appointment_id,
            therapist_id: offer.therapist_id,
            therapist_name: therapist.full_name,
            session_price: therapist.session_price || 15000, // Default 150 BRL
          });

          // Marcar como exibida
          await supabase
            .from("post_session_offers")
            .update({ shown_at: new Date().toISOString() })
            .eq("id", offer.id);
        }
      }

      // Buscar última sessão completada (para mostrar CTA de agendar próxima)
      const { data: lastCompletedAppointment } = await supabase
        .from("appointments")
        .select(`
          scheduled_at,
          therapist_id,
          therapist:profiles!appointments_therapist_id_fkey(full_name)
        `)
        .eq("patient_id", patientId)
        .eq("status", "completed")
        .order("scheduled_at", { ascending: false })
        .limit(1);

      if (lastCompletedAppointment && lastCompletedAppointment.length > 0) {
        const apt = lastCompletedAppointment[0];
        const therapistData = apt.therapist as { full_name: string } | null;
        setLastSession({
          therapist_id: apt.therapist_id,
          therapist_name: therapistData?.full_name || "Terapeuta",
          completed_at: new Date(apt.scheduled_at),
        });
      }

      // Buscar pacote ativo
      const { data: packages } = await supabase
        .from("session_packages")
        .select("id, therapist_id, total_sessions, used_sessions")
        .eq("patient_id", patientId)
        .eq("status", "active")
        .order("purchased_at", { ascending: false })
        .limit(1);

      if (packages && packages.length > 0) {
        const pkg = packages[0];
        setActivePackage({
          id: pkg.id,
          therapist_id: pkg.therapist_id,
          total_sessions: pkg.total_sessions,
          used_sessions: pkg.used_sessions,
          remaining: pkg.total_sessions - pkg.used_sessions,
        });
      }
    } catch (error) {
      logError("usePostSessionOffer.fetchData", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchData();
  };

  return {
    pendingOffer,
    lastSession,
    activePackage,
    loading,
    refresh,
  };
}
