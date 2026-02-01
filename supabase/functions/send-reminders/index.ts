import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReminderResult {
  appointmentId: string;
  patientName: string;
  emailSent: boolean;
  smsSent: boolean;
  error?: string;
}

interface AppointmentData {
  id: string;
  scheduled_at: string;
  is_online: boolean;
  status: string;
  patient: {
    id: string;
    full_name: string;
    phone: string | null;
    user_id: string;
  } | null;
  therapist: {
    full_name: string;
  } | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const zenviaApiToken = Deno.env.get("ZENVIA_API_TOKEN");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get appointments scheduled for next 24 hours that haven't been reminded
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(`
        id,
        scheduled_at,
        is_online,
        status,
        patient:profiles!appointments_patient_id_fkey(
          id,
          full_name,
          phone,
          user_id
        ),
        therapist:profiles!appointments_therapist_id_fkey(
          full_name
        )
      `)
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", tomorrow.toISOString())
      .in("status", ["pending", "confirmed"]);

    if (appointmentsError) {
      throw new Error(`Failed to fetch appointments: ${appointmentsError.message}`);
    }

    const results: ReminderResult[] = [];

    for (const aptRaw of appointments || []) {
      // Cast to proper type - Supabase returns single object for !inner joins
      const apt = aptRaw as unknown as AppointmentData;
      
      const result: ReminderResult = {
        appointmentId: apt.id,
        patientName: apt.patient?.full_name || "Paciente",
        emailSent: false,
        smsSent: false,
      };

      const scheduledDate = new Date(apt.scheduled_at);
      const formattedDate = scheduledDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      const formattedTime = scheduledDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Get patient email from auth.users
      if (apt.patient?.user_id) {
        const { data: authUser } = await supabase.auth.admin.getUserById(
          apt.patient.user_id
        );

        // Send email reminder
        if (authUser?.user?.email && resendApiKey) {
          try {
            const resend = new Resend(resendApiKey);
            
            await resend.emails.send({
              from: "Clínica <noreply@seudominio.com>", // Replace with your verified domain
              to: [authUser.user.email],
              subject: `Lembrete: Sua consulta está agendada para ${formattedDate}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #10b981;">Lembrete de Consulta</h2>
                  <p>Olá, <strong>${apt.patient?.full_name}</strong>!</p>
                  <p>Este é um lembrete da sua consulta agendada:</p>
                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>📅 Data:</strong> ${formattedDate}</p>
                    <p><strong>🕐 Horário:</strong> ${formattedTime}</p>
                    <p><strong>👨‍⚕️ Terapeuta:</strong> ${apt.therapist?.full_name}</p>
                    <p><strong>📍 Modalidade:</strong> ${apt.is_online ? "Online (videochamada)" : "Presencial"}</p>
                  </div>
                  ${apt.is_online ? `
                    <p>Você receberá o link para a videochamada por e-mail antes do horário agendado.</p>
                  ` : `
                    <p>Por favor, chegue com alguns minutos de antecedência.</p>
                  `}
                  <p>Se precisar remarcar ou cancelar, entre em contato conosco o mais breve possível.</p>
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px;">
                    Este é um e-mail automático. Por favor, não responda.
                  </p>
                </div>
              `,
            });
            
            result.emailSent = true;
            console.log(`Email sent to ${authUser.user.email}`);
          } catch (emailError: unknown) {
            const errMsg = emailError instanceof Error ? emailError.message : "Unknown error";
            console.error(`Failed to send email: ${errMsg}`);
            result.error = `Email error: ${errMsg}`;
          }
        }
      }

      // Send SMS reminder
      if (apt.patient?.phone && zenviaApiToken) {
        try {
          const phone = apt.patient.phone.replace(/\D/g, "");
          const formattedPhone = phone.startsWith("55") ? phone : `55${phone}`;
          
          const smsMessage = `Olá ${apt.patient?.full_name}! Lembrete: sua consulta com ${apt.therapist?.full_name} está agendada para ${formattedDate} às ${formattedTime}. ${apt.is_online ? "Modalidade: Online" : "Modalidade: Presencial"}`;

          const response = await fetch("https://api.zenvia.com/v2/channels/sms/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-TOKEN": zenviaApiToken,
            },
            body: JSON.stringify({
              from: "health-hug", // Replace with your Zenvia sender ID
              to: formattedPhone,
              contents: [
                {
                  type: "text",
                  text: smsMessage,
                },
              ],
            }),
          });

          if (response.ok) {
            result.smsSent = true;
            console.log(`SMS sent to ${formattedPhone}`);
          } else {
            const errorData = await response.text();
            console.error(`Zenvia SMS error: ${errorData}`);
            result.error = (result.error || "") + ` SMS error: ${errorData}`;
          }
        } catch (smsError: unknown) {
          const errMsg = smsError instanceof Error ? smsError.message : "Unknown error";
          console.error(`Failed to send SMS: ${errMsg}`);
          result.error = (result.error || "") + ` SMS error: ${errMsg}`;
        }
      }

      results.push(result);
    }

    const summary = {
      totalAppointments: appointments?.length || 0,
      emailsSent: results.filter((r) => r.emailSent).length,
      smsSent: results.filter((r) => r.smsSent).length,
      errors: results.filter((r) => r.error).length,
      details: results,
    };

    console.log("Reminder summary:", JSON.stringify(summary, null, 2));

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-reminders:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
