import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { AssessmentForm } from "./AssessmentForm";

interface PendingAssessment {
  id: string;
  template_name: string;
  template_code: string;
  sent_at: string;
  expires_at: string | null;
}

interface PatientAssessmentsProps {
  patientId: string;
}

export function PatientAssessments({ patientId }: PatientAssessmentsProps) {
  const [pendingAssessments, setPendingAssessments] = useState<PendingAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<PendingAssessment | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchPendingAssessments();
  }, [patientId]);

  const fetchPendingAssessments = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("patient_assessments")
        .select(`
          id,
          sent_at,
          expires_at,
          assessment_templates(name, code)
        `)
        .eq("patient_id", patientId)
        .eq("status", "pending")
        .order("sent_at", { ascending: false });

      if (data) {
        setPendingAssessments(
          data.map((a: any) => ({
            id: a.id,
            template_name: a.assessment_templates?.name || "Questionário",
            template_code: a.assessment_templates?.code || "",
            sent_at: a.sent_at,
            expires_at: a.expires_at,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessment: PendingAssessment) => {
    setSelectedAssessment(assessment);
    setFormOpen(true);
  };

  const handleComplete = () => {
    fetchPendingAssessments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pendingAssessments.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Questionários Pendentes</CardTitle>
          </div>
          <CardDescription>
            Complete os questionários para acompanhar seu progresso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{assessment.template_name}</span>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    Pendente
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enviado em {format(new Date(assessment.sent_at), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <Button size="sm" onClick={() => handleStartAssessment(assessment)}>
                Responder
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedAssessment && (
        <AssessmentForm
          open={formOpen}
          onOpenChange={setFormOpen}
          assessmentId={selectedAssessment.id}
          templateName={selectedAssessment.template_name}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
