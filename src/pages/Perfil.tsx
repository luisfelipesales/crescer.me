import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  User,
  Phone,
  Calendar,
  Loader2,
  Save,
  Shield,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type InsurancePlan = Tables<"insurance_plans">;
type PatientInsurance = Tables<"patient_insurance"> & {
  insurance_plan: InsurancePlan;
};
type ChildLink = Tables<"parent_child_links"> & {
  child: Tables<"profiles">;
};

export default function Perfil() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile();
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  // Insurance state
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [patientInsurance, setPatientInsurance] = useState<PatientInsurance[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [addingInsurance, setAddingInsurance] = useState(false);

  // Children state (for parents)
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [newChildName, setNewChildName] = useState("");
  const [newChildDob, setNewChildDob] = useState("");
  const [addingChild, setAddingChild] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setDateOfBirth(profile.date_of_birth || "");
      setBio(profile.bio || "");
      fetchInsuranceData();
      if (profile.profile_type === "parent") {
        fetchChildren();
      }
    }
  }, [profile]);

  const fetchInsuranceData = async () => {
    try {
      // Fetch available plans
      const { data: plans } = await supabase
        .from("insurance_plans")
        .select("*")
        .eq("is_active", true)
        .order("name");

      setInsurancePlans(plans || []);

      // Fetch patient's insurance
      if (profile) {
        const { data: patientIns } = await supabase
          .from("patient_insurance")
          .select("*, insurance_plan:insurance_plans(*)")
          .eq("patient_id", profile.id);

        setPatientInsurance((patientIns as PatientInsurance[]) || []);
      }
    } catch (error) {
      console.error("Error fetching insurance:", error);
    }
  };

  const fetchChildren = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from("parent_child_links")
        .select("*, child:profiles!parent_child_links_child_id_fkey(*)")
        .eq("parent_id", profile.id);

      setChildren((data as ChildLink[]) || []);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          bio: bio || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      refetch();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleAddInsurance = async () => {
    if (!profile || !selectedInsurance) return;

    setAddingInsurance(true);
    try {
      const { error } = await supabase.from("patient_insurance").insert({
        patient_id: profile.id,
        insurance_plan_id: selectedInsurance,
        policy_number: policyNumber || null,
      });

      if (error) throw error;

      toast.success("Convênio adicionado!");
      setSelectedInsurance("");
      setPolicyNumber("");
      fetchInsuranceData();
    } catch (error: any) {
      console.error("Error adding insurance:", error);
      toast.error(error.message || "Erro ao adicionar convênio");
    } finally {
      setAddingInsurance(false);
    }
  };

  const handleRemoveInsurance = async (id: string) => {
    try {
      const { error } = await supabase.from("patient_insurance").delete().eq("id", id);

      if (error) throw error;

      toast.success("Convênio removido");
      fetchInsuranceData();
    } catch (error: any) {
      console.error("Error removing insurance:", error);
      toast.error(error.message || "Erro ao remover convênio");
    }
  };

  const handleAddChild = async () => {
    if (!profile || !user || !newChildName) return;

    setAddingChild(true);
    try {
      // Create a child profile
      const { data: childProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id, // Same user manages child
          full_name: newChildName,
          date_of_birth: newChildDob || null,
          profile_type: "patient",
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create parent-child link
      const { error: linkError } = await supabase.from("parent_child_links").insert({
        parent_id: profile.id,
        child_id: childProfile.id,
        relationship: "parent",
      });

      if (linkError) throw linkError;

      toast.success("Dependente adicionado!");
      setNewChildName("");
      setNewChildDob("");
      fetchChildren();
    } catch (error: any) {
      console.error("Error adding child:", error);
      toast.error(error.message || "Erro ao adicionar dependente");
    } finally {
      setAddingChild(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-muted/30 py-8 md:py-12">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Meu Perfil
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize seus dados de contato e informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Sobre você (opcional)</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            {/* Insurance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Convênios
                </CardTitle>
                <CardDescription>
                  Gerencie seus planos de saúde
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current insurance */}
                {patientInsurance.length > 0 && (
                  <div className="space-y-2">
                    {patientInsurance.map((ins) => (
                      <div
                        key={ins.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">{ins.insurance_plan.name}</p>
                          {ins.policy_number && (
                            <p className="text-sm text-muted-foreground">
                              Carteirinha: {ins.policy_number}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInsurance(ins.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Add insurance */}
                <div className="space-y-3">
                  <Label>Adicionar Convênio</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o convênio" />
                      </SelectTrigger>
                      <SelectContent>
                        {insurancePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="Número da carteirinha"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAddInsurance}
                    disabled={!selectedInsurance || addingInsurance}
                  >
                    {addingInsurance ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Adicionar Convênio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Children (for parents only) */}
            {profile.profile_type === "parent" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dependentes
                  </CardTitle>
                  <CardDescription>
                    Gerencie os perfis dos seus filhos ou dependentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current children */}
                  {children.length > 0 && (
                    <div className="space-y-2">
                      {children.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{link.child.full_name}</p>
                              {link.child.date_of_birth && (
                                <p className="text-sm text-muted-foreground">
                                  Nascimento:{" "}
                                  {format(new Date(link.child.date_of_birth), "dd/MM/yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* Add child */}
                  <div className="space-y-3">
                    <Label>Adicionar Dependente</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        placeholder="Nome completo"
                      />
                      <Input
                        type="date"
                        value={newChildDob}
                        onChange={(e) => setNewChildDob(e.target.value)}
                        placeholder="Data de nascimento"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleAddChild}
                      disabled={!newChildName || addingChild}
                    >
                      {addingChild ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Adicionar Dependente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
