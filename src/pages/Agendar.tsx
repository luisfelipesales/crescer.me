import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addDays, setHours, setMinutes, isBefore, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Video,
  MapPin,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Therapist = Tables<"profiles"> & {
  availability?: Tables<"therapist_availability">[];
  specialties?: { specialty: Tables<"specialties"> }[];
};

export default function Agendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [step, setStep] = useState(1);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [childId, setChildId] = useState<string>("");
  const [children, setChildren] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTherapists();
      if (profile?.profile_type === "parent") {
        fetchChildren();
      }
    }
  }, [user, profile]);

  // Handle URL parameters for pre-selection
  useEffect(() => {
    const therapistId = searchParams.get("therapist");
    const dateStr = searchParams.get("date");
    const timeStr = searchParams.get("time");

    if (therapistId && therapists.length > 0) {
      const preSelectedTherapist = therapists.find((t) => t.id === therapistId);
      if (preSelectedTherapist && !selectedTherapist) {
        setSelectedTherapist(preSelectedTherapist);
        setStep(2);

        if (dateStr) {
          const preSelectedDate = new Date(dateStr);
          setSelectedDate(preSelectedDate);
          setStep(3);

          if (timeStr) {
            setSelectedTime(timeStr);
          }
        }
      }
    }
  }, [searchParams, therapists, selectedTherapist]);

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          availability:therapist_availability(*),
          specialties:therapist_specialties(specialty:specialties(*))
        `)
        .eq("profile_type", "therapist");

      if (error) throw error;
      setTherapists((data as Therapist[]) || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Erro ao carregar terapeutas");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from("parent_child_links")
        .select("child:profiles!parent_child_links_child_id_fkey(*)")
        .eq("parent_id", profile.id);

      if (error) throw error;
      const childProfiles = data?.map((d) => d.child).filter(Boolean) as Tables<"profiles">[];
      setChildren(childProfiles || []);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const generateAvailableTimes = (date: Date, therapist: Therapist) => {
    const dayOfWeek = date.getDay();
    const availability = therapist.availability?.filter(
      (a) => a.day_of_week === dayOfWeek && a.is_active
    );

    if (!availability || availability.length === 0) {
      return [];
    }

    const times: string[] = [];
    availability.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
        times.push(timeString);
        
        currentMin += 50; // 50 min sessions
        if (currentMin >= 60) {
          currentHour += 1;
          currentMin = currentMin - 60;
        }
      }
    });

    return times.sort();
  };

  useEffect(() => {
    if (selectedDate && selectedTherapist) {
      const times = generateAvailableTimes(selectedDate, selectedTherapist);
      setAvailableTimes(times);
      setSelectedTime("");
    }
  }, [selectedDate, selectedTherapist]);

  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setStep(2);
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile || !selectedTherapist || !selectedDate || !selectedTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

      const patientId = profile.profile_type === "parent" && childId 
        ? childId 
        : profile.id;

      // Generate unique room ID for online consultations
      const meetingRoomId = isOnline ? `consulta-${Date.now()}-${Math.random().toString(36).substring(7)}` : null;

      const { error } = await supabase.from("appointments").insert({
        patient_id: patientId,
        therapist_id: selectedTherapist.id,
        scheduled_at: scheduledAt.toISOString(),
        scheduled_by: profile.id,
        notes: notes || null,
        duration_minutes: 50,
        status: "pending",
        is_online: isOnline,
        meeting_room_id: meetingRoomId,
      });

      if (error) throw error;

      toast.success("Consulta agendada com sucesso!");
      setStep(4);
    } catch (error: any) {
      console.error("Error scheduling appointment:", error);
      toast.error(error.message || "Erro ao agendar consulta");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) return true;
    if (isAfter(date, addDays(today, 60))) return true;
    
    if (!selectedTherapist?.availability) return true;
    
    const dayOfWeek = date.getDay();
    const hasAvailability = selectedTherapist.availability.some(
      (a) => a.day_of_week === dayOfWeek && a.is_active
    );
    
    return !hasAvailability;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => (step > 1 ? setStep(step - 1) : navigate("/dashboard"))}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Agendar Consulta
            </h1>
            <p className="mt-1 text-muted-foreground">
              {step === 1 && "Escolha o profissional para sua consulta"}
              {step === 2 && "Selecione a data desejada"}
              {step === 3 && "Escolha o horário e confirme"}
              {step === 4 && "Consulta agendada!"}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Select Therapist */}
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              {therapists.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <User className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Nenhum terapeuta disponível no momento</p>
                  </CardContent>
                </Card>
              ) : (
                therapists.map((therapist) => (
                  <Card
                    key={therapist.id}
                    className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                    onClick={() => handleSelectTherapist(therapist)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{therapist.full_name}</CardTitle>
                          <CardDescription>
                            {therapist.specialties && therapist.specialties.length > 0
                              ? therapist.specialties
                                  .map((s) => s.specialty.name)
                                  .slice(0, 3)
                                  .join(", ")
                              : "Terapeuta"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    {therapist.bio && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {therapist.bio}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && selectedTherapist && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Escolha a Data
                </CardTitle>
                <CardDescription>
                  Selecione uma data disponível na agenda de {selectedTherapist.full_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  disabled={disabledDays}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Time & Confirm */}
          {step === 3 && selectedTherapist && selectedDate && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Escolha o Horário
                  </CardTitle>
                  <CardDescription>
                    Horários disponíveis em{" "}
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {availableTimes.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Nenhum horário disponível nesta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Child selection for parents */}
              {profile?.profile_type === "parent" && children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Para quem é a consulta?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={childId} onValueChange={setChildId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}

              {/* Appointment Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Atendimento</CardTitle>
                  <CardDescription>Escolha como deseja realizar a consulta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={!isOnline ? "default" : "outline"}
                      className="flex h-auto flex-col gap-2 py-6"
                      onClick={() => setIsOnline(false)}
                    >
                      <MapPin className="h-6 w-6" />
                      <span className="font-medium">Presencial</span>
                      <span className="text-xs opacity-70">Na clínica</span>
                    </Button>
                    <Button
                      variant={isOnline ? "default" : "outline"}
                      className="flex h-auto flex-col gap-2 py-6"
                      onClick={() => setIsOnline(true)}
                    >
                      <Video className="h-6 w-6" />
                      <span className="font-medium">Teleconsulta</span>
                      <span className="text-xs opacity-70">Por vídeo</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações (opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Alguma informação adicional para o terapeuta..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Summary & Submit */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Resumo do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Terapeuta:</span>{" "}
                    {selectedTherapist.full_name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Data:</span>{" "}
                    {format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Horário:</span>{" "}
                    {selectedTime || "Não selecionado"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Duração:</span> 50 minutos
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tipo:</span>{" "}
                    <span className="inline-flex items-center gap-1">
                      {isOnline ? (
                        <>
                          <Video className="h-4 w-4" /> Teleconsulta
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" /> Presencial
                        </>
                      )}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedTime || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold">
                  Consulta Agendada!
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Sua consulta foi agendada com sucesso. Você receberá uma confirmação
                  por e-mail em breve.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate("/consultas")}>
                    Ver Minhas Consultas
                  </Button>
                  <Button onClick={() => navigate("/dashboard")}>
                    Voltar ao Portal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
