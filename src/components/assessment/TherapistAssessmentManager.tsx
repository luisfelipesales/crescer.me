import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Send, ClipboardList, TrendingUp, TrendingDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface Template {
  id: string;
  name: string;
  code: string;
  max_score: number;
}

interface AssessmentResult {
  id: string;
  completed_at: string;
  total_score: number;
  severity_level: string;
  template_name: string;
  template_code: string;
}

interface TherapistAssessmentManagerProps {
  therapistId: string;
  patientId: string;
  patientName: string;
  treatmentId?: string;
}

export function TherapistAssessmentManager({
  therapistId,
  patientId,
  patientName,
  treatmentId,
}: TherapistAssessmentManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch templates
      const { data: templatesData } = await supabase
        .from("assessment_templates")
        .select("id, name, code, max_score")
        .eq("is_active", true);

      if (templatesData) {
        setTemplates(templatesData);
      }

      // Fetch completed assessments for this patient
      const { data: resultsData } = await supabase
        .from("patient_assessments")
        .select(`
          id,
          completed_at,
          total_score,
          severity_level,
          assessment_templates(name, code)
        `)
        .eq("patient_id", patientId)
        .eq("status", "completed")
        .order("completed_at", { ascending: true });

      if (resultsData) {
        setResults(
          resultsData.map((r: any) => ({
            id: r.id,
            completed_at: r.completed_at,
            total_score: r.total_score,
            severity_level: r.severity_level,
            template_name: r.assessment_templates?.name || "",
            template_code: r.assessment_templates?.code || "",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAssessment = async () => {
    if (!selectedTemplate) {
      toast.error("Selecione um questionário");
      return;
    }

    setSending(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error } = await supabase.from("patient_assessments").insert({
        template_id: selectedTemplate,
        patient_id: patientId,
        therapist_id: therapistId,
        treatment_id: treatmentId || null,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast.success("Questionário enviado para o paciente!");
      setSelectedTemplate("");
      fetchData();
    } catch (error) {
      console.error("Error sending assessment:", error);
      toast.error("Erro ao enviar questionário");
    } finally {
      setSending(false);
    }
  };

  // Group results by template for charting
  const gad7Results = results.filter((r) => r.template_code === "gad7");
  const phq9Results = results.filter((r) => r.template_code === "phq9");

  const chartConfig = {
    score: {
      label: "Pontuação",
      color: "hsl(var(--primary))",
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minimal":
        return "bg-green-100 text-green-700";
      case "mild":
        return "bg-yellow-100 text-yellow-700";
      case "moderate":
        return "bg-orange-100 text-orange-700";
      case "moderately_severe":
      case "severe":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      minimal: "Mínimo",
      mild: "Leve",
      moderate: "Moderado",
      moderately_severe: "Moderadamente Grave",
      severe: "Grave",
    };
    return labels[severity] || severity;
  };

  const getTrend = (data: AssessmentResult[]) => {
    if (data.length < 2) return null;
    const last = data[data.length - 1].total_score;
    const prev = data[data.length - 2].total_score;
    return last < prev ? "down" : last > prev ? "up" : "stable";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Send Assessment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Enviar Questionário
          </CardTitle>
          <CardDescription>
            Envie um questionário para {patientName} responder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione o questionário" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSendAssessment} disabled={sending || !selectedTemplate}>
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Charts */}
      {(gad7Results.length > 0 || phq9Results.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* GAD-7 Chart */}
          {gad7Results.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">GAD-7 (Ansiedade)</CardTitle>
                  {getTrend(gad7Results) === "down" && (
                    <Badge className="bg-green-100 text-green-700">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      Melhorando
                    </Badge>
                  )}
                  {getTrend(gad7Results) === "up" && (
                    <Badge className="bg-red-100 text-red-700">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Aumentou
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Última: {gad7Results[gad7Results.length - 1]?.total_score} pts -{" "}
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${getSeverityColor(gad7Results[gad7Results.length - 1]?.severity_level)}`}>
                    {getSeverityLabel(gad7Results[gad7Results.length - 1]?.severity_level)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <LineChart
                    data={gad7Results.map((r) => ({
                      date: format(new Date(r.completed_at), "dd/MM", { locale: ptBR }),
                      score: r.total_score,
                    }))}
                  >
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 21]} tickLine={false} axisLine={false} />
                    <ReferenceLine y={5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <ReferenceLine y={10} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                    <ReferenceLine y={15} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* PHQ-9 Chart */}
          {phq9Results.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">PHQ-9 (Depressão)</CardTitle>
                  {getTrend(phq9Results) === "down" && (
                    <Badge className="bg-green-100 text-green-700">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      Melhorando
                    </Badge>
                  )}
                  {getTrend(phq9Results) === "up" && (
                    <Badge className="bg-red-100 text-red-700">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Aumentou
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Última: {phq9Results[phq9Results.length - 1]?.total_score} pts -{" "}
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${getSeverityColor(phq9Results[phq9Results.length - 1]?.severity_level)}`}>
                    {getSeverityLabel(phq9Results[phq9Results.length - 1]?.severity_level)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <LineChart
                    data={phq9Results.map((r) => ({
                      date: format(new Date(r.completed_at), "dd/MM", { locale: ptBR }),
                      score: r.total_score,
                    }))}
                  >
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 27]} tickLine={false} axisLine={false} />
                    <ReferenceLine y={5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <ReferenceLine y={10} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                    <ReferenceLine y={15} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No results message */}
      {results.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum questionário respondido ainda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
