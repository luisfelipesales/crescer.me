import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active automation rules
    const { data: automationRules, error: rulesError } = await supabase
      .from("assessment_automation")
      .select(`
        *,
        template:assessment_templates(*)
      `)
      .eq("is_active", true);

    if (rulesError) {
      throw new Error(`Failed to fetch automation rules: ${rulesError.message}`);
    }

    // Get all active treatments
    const { data: treatments, error: treatmentsError } = await supabase
      .from("patient_treatments")
      .select("*")
      .is("discharged_at", null);

    if (treatmentsError) {
      throw new Error(`Failed to fetch treatments: ${treatmentsError.message}`);
    }

    const assessmentsSent: Array<{ patientId: string; templateCode: string }> = [];
    const now = new Date();

    for (const treatment of treatments || []) {
      // Find automation rules for this treatment's phase
      const applicableRules = (automationRules || []).filter(
        (rule: any) => rule.treatment_phase === treatment.current_phase
      );

      for (const rule of applicableRules) {
        // Check if we should send an assessment based on frequency
        const { data: lastAssessment, error: lastError } = await supabase
          .from("patient_assessments")
          .select("created_at")
          .eq("patient_id", treatment.patient_id)
          .eq("template_id", rule.template_id)
          .eq("treatment_id", treatment.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastError) {
          console.error(`Error checking last assessment: ${lastError.message}`);
          continue;
        }

        let shouldSend = false;

        if (!lastAssessment) {
          // Never sent for this treatment, send immediately
          shouldSend = true;
        } else {
          // Check if enough days have passed since last assessment
          const lastDate = new Date(lastAssessment.created_at);
          const daysSinceLast = Math.floor(
            (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          shouldSend = daysSinceLast >= rule.frequency_days;
        }

        if (shouldSend) {
          // Check if there's already a pending assessment for this template
          const { data: pendingAssessment } = await supabase
            .from("patient_assessments")
            .select("id")
            .eq("patient_id", treatment.patient_id)
            .eq("template_id", rule.template_id)
            .eq("status", "pending")
            .maybeSingle();

          if (!pendingAssessment) {
            // Create new assessment
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to complete

            const { error: insertError } = await supabase
              .from("patient_assessments")
              .insert({
                patient_id: treatment.patient_id,
                therapist_id: treatment.therapist_id,
                template_id: rule.template_id,
                treatment_id: treatment.id,
                status: "pending",
                expires_at: expiresAt.toISOString(),
              });

            if (insertError) {
              console.error(`Error creating assessment: ${insertError.message}`);
            } else {
              assessmentsSent.push({
                patientId: treatment.patient_id,
                templateCode: rule.template?.code || rule.template_id,
              });
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        assessmentsSent: assessmentsSent.length,
        details: assessmentsSent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-scheduled-assessments:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
