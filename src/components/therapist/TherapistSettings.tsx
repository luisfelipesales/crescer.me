import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";

const APPROACHES = [
  "Terapia Cognitivo-Comportamental (TCC)",
  "Psicanálise",
  "Terapia Comportamental",
  "Terapia Humanista",
  "Terapia Sistêmica",
  "Neuropsicologia",
  "ABA - Análise do Comportamento Aplicada",
  "Terapia Integrativa",
];

export function TherapistSettings() {
  const { profile, refetch } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    session_price: "",
    min_age: "",
    max_age: "",
    therapeutic_approach: "",
    bio: "",
  });
  const [specialties, setSpecialties] = useState<Tables<"specialties">[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  useEffect(() => {
    if (profile) {
      setFormData({
        session_price: profile.session_price ? String(profile.session_price / 100) : "",
        min_age: profile.min_age ? String(profile.min_age) : "",
        max_age: profile.max_age ? String(profile.max_age) : "",
        therapeutic_approach: profile.therapeutic_approach || "",
        bio: profile.bio || "",
      });
      fetchSpecialties();
    }
  }, [profile]);

  const fetchSpecialties = async () => {
    if (!profile) return;
    setLoadingSpecialties(true);

    try {
      // Fetch all specialties
      const { data: allSpecialties } = await supabase
        .from("specialties")
        .select("*")
        .order("name");

      setSpecialties(allSpecialties || []);

      // Fetch therapist's current specialties
      const { data: therapistSpecialties } = await supabase
        .from("therapist_specialties")
        .select("specialty_id")
        .eq("therapist_id", profile.id);

      setSelectedSpecialties(
        therapistSpecialties?.map((s) => s.specialty_id) || []
      );
    } catch (error) {
      console.error("Error fetching specialties:", error);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          session_price: formData.session_price
            ? Math.round(parseFloat(formData.session_price) * 100)
            : null,
          min_age: formData.min_age ? parseInt(formData.min_age) : null,
          max_age: formData.max_age ? parseInt(formData.max_age) : null,
          therapeutic_approach: formData.therapeutic_approach || null,
          bio: formData.bio || null,
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // Update specialties
      // First, remove all existing
      await supabase
        .from("therapist_specialties")
        .delete()
        .eq("therapist_id", profile.id);

      // Then add selected ones
      if (selectedSpecialties.length > 0) {
        const { error: specError } = await supabase
          .from("therapist_specialties")
          .insert(
            selectedSpecialties.map((specId) => ({
              therapist_id: profile.id,
              specialty_id: specId,
            }))
          );

        if (specError) throw specError;
      }

      toast.success("Configurações salvas com sucesso!");
      refetch();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (specialtyId: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialtyId)
        ? prev.filter((id) => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Pricing & Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil e Preços</CardTitle>
          <CardDescription>
            Configure seu valor por sessão e informações de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="session_price">Valor da Sessão (R$)</Label>
              <Input
                id="session_price"
                type="number"
                placeholder="Ex: 200"
                value={formData.session_price}
                onChange={(e) =>
                  setFormData({ ...formData, session_price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_age">Idade Mínima</Label>
              <Input
                id="min_age"
                type="number"
                placeholder="Ex: 4"
                value={formData.min_age}
                onChange={(e) =>
                  setFormData({ ...formData, min_age: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_age">Idade Máxima</Label>
              <Input
                id="max_age"
                type="number"
                placeholder="Ex: 17"
                value={formData.max_age}
                onChange={(e) =>
                  setFormData({ ...formData, max_age: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapeutic_approach">Abordagem Terapêutica</Label>
            <Select
              value={formData.therapeutic_approach}
              onValueChange={(v) =>
                setFormData({ ...formData, therapeutic_approach: v })
              }
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Selecione sua abordagem" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {APPROACHES.map((approach) => (
                  <SelectItem key={approach} value={approach}>
                    {approach}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Sobre você</Label>
            <Textarea
              id="bio"
              placeholder="Descreva sua formação, experiência e abordagem..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
          <CardDescription>
            Selecione as queixas e condições que você atende
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSpecialties ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <Button
                  key={specialty.id}
                  variant={
                    selectedSpecialties.includes(specialty.id)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleSpecialty(specialty.id)}
                >
                  {specialty.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade</CardTitle>
          <CardDescription>
            Configure seus horários de atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityManager therapistId={profile.id} />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
