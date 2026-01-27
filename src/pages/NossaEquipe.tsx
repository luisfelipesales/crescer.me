import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TherapistCard, type TherapistWithDetails } from "@/components/therapist/TherapistCard";
import { TherapistFilters, type TherapistFiltersState } from "@/components/therapist/TherapistFilters";
import { useTherapists } from "@/hooks/useTherapists";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { GraduationCap, Award, Heart, Loader2, User, Clock, DollarSign } from "lucide-react";
import { format, addDays, setHours, setMinutes, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const highlights = [
  {
    icon: GraduationCap,
    title: "Formação de excelência",
    description:
      "Todos os profissionais possuem formação em instituições renomadas e especialização em saúde mental infantojuvenil.",
  },
  {
    icon: Award,
    title: "Atualização constante",
    description:
      "Nossa equipe participa regularmente de congressos, cursos e supervisões para oferecer o que há de mais moderno na área.",
  },
  {
    icon: Heart,
    title: "Dedicação ao paciente",
    description:
      "Cada membro da equipe compartilha a missão de cuidar com empatia, respeito e compromisso com os melhores resultados.",
  },
];

export default function NossaEquipe() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TherapistFiltersState>({
    ageRange: "",
    specialty: "",
    priceRange: "",
    availability: "",
    approach: "",
  });

  const { therapists, specialties, approaches, loading } = useTherapists(filters);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistWithDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const handleViewSchedule = (therapist: TherapistWithDetails) => {
    setSelectedTherapist(therapist);
    setSelectedDate(undefined);
    setAvailableTimes([]);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTherapist?.availability) {
      const dayOfWeek = date.getDay();
      const slots = selectedTherapist.availability.filter(
        (a) => a.day_of_week === dayOfWeek && a.is_active
      );

      const times: string[] = [];
      const now = new Date();

      slots.forEach((slot) => {
        const [startHour, startMin] = slot.start_time.split(":").map(Number);
        const [endHour, endMin] = slot.end_time.split(":").map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
          const slotTime = setMinutes(setHours(date, currentHour), currentMin);

          // Only add future times
          if (isAfter(slotTime, now)) {
            times.push(
              `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`
            );
          }

          currentMin += 50;
          if (currentMin >= 60) {
            currentHour += 1;
            currentMin = currentMin - 60;
          }
        }
      });

      setAvailableTimes(times.sort());
    }
  };

  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    if (date < today) return true;
    if (date > addDays(today, 60)) return true;

    if (!selectedTherapist?.availability) return true;

    const dayOfWeek = date.getDay();
    return !selectedTherapist.availability.some(
      (a) => a.day_of_week === dayOfWeek && a.is_active
    );
  };

  const formatPrice = (priceInCents: number | null) => {
    if (!priceInCents) return "Sob consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const handleSelectTime = (time: string) => {
    if (!selectedTherapist) return;
    // Navigate to booking page with pre-selected data
    navigate(`/agendar?therapist=${selectedTherapist.id}&date=${selectedDate?.toISOString()}&time=${time}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Nossa equipe
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Encontre o{" "}
              <span className="text-primary">psicólogo ideal</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Nossa rede curada de psicólogos especializados em saúde mental
              infantojuvenil está pronta para cuidar da sua família.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-border py-12">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border py-6">
        <div className="container-custom">
          <TherapistFilters
            filters={filters}
            onFiltersChange={setFilters}
            specialties={specialties}
            approaches={approaches}
          />
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : therapists.length === 0 ? (
            <div className="py-12 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground">
                Nenhum terapeuta encontrado
              </h3>
              <p className="mt-1 text-muted-foreground">
                Tente ajustar os filtros para encontrar mais opções
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  setFilters({
                    ageRange: "",
                    specialty: "",
                    priceRange: "",
                    availability: "",
                    approach: "",
                  })
                }
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {therapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onViewSchedule={handleViewSchedule}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Schedule Dialog */}
      <Dialog open={!!selectedTherapist} onOpenChange={() => setSelectedTherapist(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedTherapist && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {selectedTherapist.avatar_url ? (
                      <img
                        src={selectedTherapist.avatar_url}
                        alt={selectedTherapist.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <span className="block">{selectedTherapist.full_name}</span>
                    {selectedTherapist.therapeutic_approach && (
                      <span className="block text-sm font-normal text-muted-foreground">
                        {selectedTherapist.therapeutic_approach}
                      </span>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Selecione uma data e horário para agendar com {selectedTherapist.full_name}
                </DialogDescription>
              </DialogHeader>

              {/* Quick info */}
              <div className="flex flex-wrap gap-3 border-b pb-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatPrice(selectedTherapist.session_price)}</span>
                </div>
                {selectedTherapist.min_age && selectedTherapist.max_age && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTherapist.min_age} - {selectedTherapist.max_age} anos</span>
                  </div>
                )}
                {selectedTherapist.nextAvailable && (
                  <div className="flex items-center gap-1.5 text-sm text-primary">
                    <Clock className="h-4 w-4" />
                    <span>
                      Próximo:{" "}
                      {format(selectedTherapist.nextAvailable, "EEE dd/MM HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              {selectedTherapist.specialties && selectedTherapist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-4 border-b">
                  {selectedTherapist.specialties.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {s.specialty.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Calendar */}
              <div className="pt-2">
                <h4 className="font-medium text-foreground mb-3">Escolha uma data</h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disabledDays}
                  locale={ptBR}
                  className="rounded-md border mx-auto pointer-events-auto"
                />
              </div>

              {/* Times */}
              {selectedDate && (
                <div className="pt-4">
                  <h4 className="font-medium text-foreground mb-3">
                    Horários em {format(selectedDate, "dd/MM", { locale: ptBR })}
                  </h4>
                  {availableTimes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum horário disponível nesta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleSelectTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Pronto para dar o primeiro passo?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Agende uma triagem inicial com um de nossos especialistas e
            descubra como podemos ajudar sua família.
          </p>
          <a
            href="/agendar"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Agendar triagem
          </a>
        </div>
      </section>
    </Layout>
  );
}
