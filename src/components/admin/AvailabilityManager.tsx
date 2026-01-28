import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { logError } from "@/lib/errorLogger";
import type { Tables } from "@/integrations/supabase/types";

interface AvailabilityManagerProps {
  therapistId: string;
}

type Availability = Tables<"therapist_availability">;

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export function AvailabilityManager({ therapistId }: AvailabilityManagerProps) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [therapistId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("therapist_availability")
        .select("*")
        .eq("therapist_id", therapistId)
        .order("day_of_week")
        .order("start_time");

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      logError("AvailabilityManager.fetchAvailability", error);
      toast.error("Erro ao carregar disponibilidade");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async (dayOfWeek: number) => {
    try {
      const { data, error } = await supabase
        .from("therapist_availability")
        .insert({
          therapist_id: therapistId,
          day_of_week: dayOfWeek,
          start_time: "08:00",
          end_time: "12:00",
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setAvailability([...availability, data]);
      toast.success("Horário adicionado");
    } catch (error) {
      logError("AvailabilityManager.addTimeSlot", error);
      toast.error("Erro ao adicionar horário");
    }
  };

  const updateTimeSlot = async (
    id: string,
    field: keyof Availability,
    value: string | boolean
  ) => {
    try {
      const { error } = await supabase
        .from("therapist_availability")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      setAvailability(
        availability.map((slot) =>
          slot.id === id ? { ...slot, [field]: value } : slot
        )
      );
    } catch (error) {
      logError("AvailabilityManager.updateTimeSlot", error);
      toast.error("Erro ao atualizar horário");
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from("therapist_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAvailability(availability.filter((slot) => slot.id !== id));
      toast.success("Horário removido");
    } catch (error) {
      logError("AvailabilityManager.deleteTimeSlot", error);
      toast.error("Erro ao remover horário");
    }
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availability.filter((slot) => slot.day_of_week === dayOfWeek);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {DAYS_OF_WEEK.map((day) => {
        const daySlots = getAvailabilityForDay(day.value);
        
        return (
          <Card key={day.value}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{day.label}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot(day.value)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {daySlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum horário definido
                </p>
              ) : (
                <div className="space-y-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slot.is_active}
                          onCheckedChange={(checked) =>
                            updateTimeSlot(slot.id, "is_active", checked)
                          }
                        />
                        <Label className="text-sm">Ativo</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Das</Label>
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) =>
                            updateTimeSlot(slot.id, "start_time", e.target.value)
                          }
                          className="w-28"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">às</Label>
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) =>
                            updateTimeSlot(slot.id, "end_time", e.target.value)
                          }
                          className="w-28"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTimeSlot(slot.id)}
                        className="ml-auto text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
