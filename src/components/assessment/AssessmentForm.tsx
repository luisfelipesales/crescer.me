import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question_number: number;
  question_text: string;
  options: { value: number; label: string }[];
}

interface AssessmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  templateName: string;
  onComplete: () => void;
}

export function AssessmentForm({
  open,
  onOpenChange,
  assessmentId,
  templateName,
  onComplete,
}: AssessmentFormProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && assessmentId) {
      fetchQuestions();
    }
  }, [open, assessmentId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Get the template ID from the assessment
      const { data: assessment } = await supabase
        .from("patient_assessments")
        .select("template_id")
        .eq("id", assessmentId)
        .single();

      if (!assessment) return;

      // Get questions for this template
      const { data: questionsData } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("template_id", assessment.template_id)
        .order("question_number");

      if (questionsData) {
        setQuestions(
          questionsData.map((q: any) => ({
            ...q,
            options: q.options as { value: number; label: string }[],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Insert all responses
      const responses = Object.entries(answers).map(([questionId, value]) => ({
        assessment_id: assessmentId,
        question_id: questionId,
        response_value: value,
      }));

      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .insert(responses);

      if (responsesError) throw responsesError;

      // Calculate total score
      const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

      // Get scoring ranges to determine severity
      const { data: assessment } = await supabase
        .from("patient_assessments")
        .select("template_id, assessment_templates(scoring_ranges)")
        .eq("id", assessmentId)
        .single();

      let severityLevel = "unknown";
      if (assessment?.assessment_templates) {
        const ranges = (assessment.assessment_templates as any).scoring_ranges as any[];
        const matchingRange = ranges.find(
          (r) => totalScore >= r.min && totalScore <= r.max
        );
        if (matchingRange) {
          severityLevel = matchingRange.severity;
        }
      }

      // Update assessment with score
      const { error: updateError } = await supabase
        .from("patient_assessments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          total_score: totalScore,
          severity_level: severityLevel,
        })
        .eq("id", assessmentId);

      if (updateError) throw updateError;

      toast.success("Questionário enviado com sucesso!");
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Erro ao enviar questionário");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isCurrentAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{templateName}</DialogTitle>
          <DialogDescription>
            Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos seguintes problemas?
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pergunta {currentIndex + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            {currentQuestion && (
              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground">
                  {currentQuestion.question_text}
                </p>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString()}
                  onValueChange={(value) =>
                    handleAnswer(currentQuestion.id, parseInt(value))
                  }
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={option.value.toString()} />
                      <span className="flex-1">{option.label}</span>
                      <span className="text-sm text-muted-foreground">({option.value})</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Enviar
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isCurrentAnswered}>
                Próxima
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
