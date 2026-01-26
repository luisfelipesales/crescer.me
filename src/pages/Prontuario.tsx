import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Stethoscope, 
  Calendar,
  Clock,
  User,
  Edit,
  Save,
  X
} from "lucide-react";

interface MedicalRecord {
  id: string;
  patient_id: string;
  therapist_id: string;
  appointment_id: string | null;
  session_date: string;
  chief_complaint: string | null;
  session_notes: string;
  objectives: string | null;
  interventions: string | null;
  patient_response: string | null;
  homework: string | null;
  next_session_plan: string | null;
  created_at: string;
  updated_at: string;
}

interface PatientDiagnosis {
  id: string;
  patient_id: string;
  therapist_id: string;
  diagnosis_code: string | null;
  diagnosis_name: string;
  diagnosis_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
}

export default function Prontuario() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [diagnoses, setDiagnoses] = useState<PatientDiagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  
  const [recordForm, setRecordForm] = useState({
    session_date: format(new Date(), "yyyy-MM-dd"),
    chief_complaint: "",
    session_notes: "",
    objectives: "",
    interventions: "",
    patient_response: "",
    homework: "",
    next_session_plan: ""
  });
  
  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis_code: "",
    diagnosis_name: "",
    diagnosis_date: format(new Date(), "yyyy-MM-dd"),
    status: "active",
    notes: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile) {
      if (profile.profile_type !== "therapist" && !profile.user_id) {
        navigate("/dashboard");
      }
    }
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (patientId && profile) {
      fetchPatientData();
    }
  }, [patientId, profile]);

  const fetchPatientData = async () => {
    if (!patientId) return;
    
    try {
      setLoading(true);
      
      // Fetch patient info
      const { data: patientData, error: patientError } = await supabase
        .from("profiles")
        .select("id, full_name, date_of_birth, phone")
        .eq("id", patientId)
        .single();
      
      if (patientError) throw patientError;
      setPatient(patientData);
      
      // Fetch medical records
      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientId)
        .order("session_date", { ascending: false });
      
      if (recordsError) throw recordsError;
      setRecords(recordsData || []);
      
      // Fetch diagnoses
      const { data: diagnosesData, error: diagnosesError } = await supabase
        .from("patient_diagnoses")
        .select("*")
        .eq("patient_id", patientId)
        .order("diagnosis_date", { ascending: false });
      
      if (diagnosesError) throw diagnosesError;
      setDiagnoses(diagnosesData || []);
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar prontuário");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!profile || !patientId) return;
    
    if (!recordForm.session_notes.trim()) {
      toast.error("As notas da sessão são obrigatórias");
      return;
    }
    
    try {
      if (editingRecord) {
        const { error } = await supabase
          .from("medical_records")
          .update({
            session_date: recordForm.session_date,
            chief_complaint: recordForm.chief_complaint || null,
            session_notes: recordForm.session_notes,
            objectives: recordForm.objectives || null,
            interventions: recordForm.interventions || null,
            patient_response: recordForm.patient_response || null,
            homework: recordForm.homework || null,
            next_session_plan: recordForm.next_session_plan || null
          })
          .eq("id", editingRecord.id);
        
        if (error) throw error;
        toast.success("Registro atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from("medical_records")
          .insert({
            patient_id: patientId,
            therapist_id: profile.id,
            session_date: recordForm.session_date,
            chief_complaint: recordForm.chief_complaint || null,
            session_notes: recordForm.session_notes,
            objectives: recordForm.objectives || null,
            interventions: recordForm.interventions || null,
            patient_response: recordForm.patient_response || null,
            homework: recordForm.homework || null,
            next_session_plan: recordForm.next_session_plan || null
          });
        
        if (error) throw error;
        toast.success("Registro criado com sucesso");
      }
      
      setIsRecordDialogOpen(false);
      setEditingRecord(null);
      resetRecordForm();
      fetchPatientData();
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast.error("Erro ao salvar registro");
    }
  };

  const handleSaveDiagnosis = async () => {
    if (!profile || !patientId) return;
    
    if (!diagnosisForm.diagnosis_name.trim()) {
      toast.error("O nome do diagnóstico é obrigatório");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("patient_diagnoses")
        .insert({
          patient_id: patientId,
          therapist_id: profile.id,
          diagnosis_code: diagnosisForm.diagnosis_code || null,
          diagnosis_name: diagnosisForm.diagnosis_name,
          diagnosis_date: diagnosisForm.diagnosis_date,
          status: diagnosisForm.status,
          notes: diagnosisForm.notes || null
        });
      
      if (error) throw error;
      toast.success("Diagnóstico adicionado com sucesso");
      setIsDiagnosisDialogOpen(false);
      resetDiagnosisForm();
      fetchPatientData();
    } catch (error) {
      console.error("Erro ao salvar diagnóstico:", error);
      toast.error("Erro ao salvar diagnóstico");
    }
  };

  const handleUpdateDiagnosisStatus = async (diagnosisId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("patient_diagnoses")
        .update({ status: newStatus })
        .eq("id", diagnosisId);
      
      if (error) throw error;
      toast.success("Status atualizado");
      fetchPatientData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const openEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
    setRecordForm({
      session_date: record.session_date,
      chief_complaint: record.chief_complaint || "",
      session_notes: record.session_notes,
      objectives: record.objectives || "",
      interventions: record.interventions || "",
      patient_response: record.patient_response || "",
      homework: record.homework || "",
      next_session_plan: record.next_session_plan || ""
    });
    setIsRecordDialogOpen(true);
  };

  const resetRecordForm = () => {
    setRecordForm({
      session_date: format(new Date(), "yyyy-MM-dd"),
      chief_complaint: "",
      session_notes: "",
      objectives: "",
      interventions: "",
      patient_response: "",
      homework: "",
      next_session_plan: ""
    });
  };

  const resetDiagnosisForm = () => {
    setDiagnosisForm({
      diagnosis_code: "",
      diagnosis_name: "",
      diagnosis_date: format(new Date(), "yyyy-MM-dd"),
      status: "active",
      notes: ""
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "destructive",
      monitoring: "default",
      resolved: "secondary"
    };
    const labels: Record<string, string> = {
      active: "Ativo",
      monitoring: "Em acompanhamento",
      resolved: "Resolvido"
    };
    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  if (authLoading || profileLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Paciente não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Prontuário Eletrônico</h1>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {patient.full_name}
              </span>
              {patient.date_of_birth && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(patient.date_of_birth), "dd/MM/yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{records.length}</p>
                  <p className="text-sm text-muted-foreground">Registros de Sessão</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <Stethoscope className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{diagnoses.filter(d => d.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Diagnósticos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/50 rounded-full">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {records.length > 0 
                      ? format(new Date(records[0].session_date), "dd/MM", { locale: ptBR })
                      : "-"
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Última Sessão</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="records" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">Notas de Evolução</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnósticos</TabsTrigger>
          </TabsList>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Histórico de Sessões</h2>
              <Dialog open={isRecordDialogOpen} onOpenChange={(open) => {
                setIsRecordDialogOpen(open);
                if (!open) {
                  setEditingRecord(null);
                  resetRecordForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Nota
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRecord ? "Editar Nota de Evolução" : "Nova Nota de Evolução"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="session_date">Data da Sessão</Label>
                      <Input
                        id="session_date"
                        type="date"
                        value={recordForm.session_date}
                        onChange={(e) => setRecordForm({ ...recordForm, session_date: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="chief_complaint">Queixa Principal</Label>
                      <Textarea
                        id="chief_complaint"
                        placeholder="Descreva a queixa principal do paciente..."
                        value={recordForm.chief_complaint}
                        onChange={(e) => setRecordForm({ ...recordForm, chief_complaint: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="session_notes">Notas da Sessão *</Label>
                      <Textarea
                        id="session_notes"
                        placeholder="Descreva o que aconteceu na sessão..."
                        value={recordForm.session_notes}
                        onChange={(e) => setRecordForm({ ...recordForm, session_notes: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="objectives">Objetivos Trabalhados</Label>
                      <Textarea
                        id="objectives"
                        placeholder="Quais objetivos foram trabalhados..."
                        value={recordForm.objectives}
                        onChange={(e) => setRecordForm({ ...recordForm, objectives: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="interventions">Intervenções Realizadas</Label>
                      <Textarea
                        id="interventions"
                        placeholder="Quais técnicas ou intervenções foram utilizadas..."
                        value={recordForm.interventions}
                        onChange={(e) => setRecordForm({ ...recordForm, interventions: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="patient_response">Resposta do Paciente</Label>
                      <Textarea
                        id="patient_response"
                        placeholder="Como o paciente respondeu às intervenções..."
                        value={recordForm.patient_response}
                        onChange={(e) => setRecordForm({ ...recordForm, patient_response: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="homework">Tarefa de Casa</Label>
                      <Textarea
                        id="homework"
                        placeholder="Atividades para casa..."
                        value={recordForm.homework}
                        onChange={(e) => setRecordForm({ ...recordForm, homework: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="next_session_plan">Plano para Próxima Sessão</Label>
                      <Textarea
                        id="next_session_plan"
                        placeholder="O que será trabalhado na próxima sessão..."
                        value={recordForm.next_session_plan}
                        onChange={(e) => setRecordForm({ ...recordForm, next_session_plan: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveRecord}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {records.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum registro de sessão encontrado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Nova Nota" para adicionar o primeiro registro
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          {format(new Date(record.session_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => openEditRecord(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        Última atualização: {format(new Date(record.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {record.chief_complaint && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Queixa Principal</p>
                          <p className="text-sm">{record.chief_complaint}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Notas da Sessão</p>
                        <p className="text-sm whitespace-pre-wrap">{record.session_notes}</p>
                      </div>
                      
                      {record.objectives && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Objetivos</p>
                          <p className="text-sm">{record.objectives}</p>
                        </div>
                      )}
                      
                      {record.interventions && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Intervenções</p>
                          <p className="text-sm">{record.interventions}</p>
                        </div>
                      )}
                      
                      {record.patient_response && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Resposta do Paciente</p>
                          <p className="text-sm">{record.patient_response}</p>
                        </div>
                      )}
                      
                      {record.homework && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tarefa de Casa</p>
                          <p className="text-sm">{record.homework}</p>
                        </div>
                      )}
                      
                      {record.next_session_plan && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Plano Próxima Sessão</p>
                          <p className="text-sm">{record.next_session_plan}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Diagnoses Tab */}
          <TabsContent value="diagnoses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Hipóteses Diagnósticas</h2>
              <Dialog open={isDiagnosisDialogOpen} onOpenChange={setIsDiagnosisDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Diagnóstico
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Diagnóstico</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="diagnosis_code">Código (CID/DSM)</Label>
                      <Input
                        id="diagnosis_code"
                        placeholder="Ex: F84.0, F90.0..."
                        value={diagnosisForm.diagnosis_code}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, diagnosis_code: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="diagnosis_name">Nome do Diagnóstico *</Label>
                      <Input
                        id="diagnosis_name"
                        placeholder="Ex: Transtorno do Espectro Autista"
                        value={diagnosisForm.diagnosis_name}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, diagnosis_name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="diagnosis_date">Data do Diagnóstico</Label>
                      <Input
                        id="diagnosis_date"
                        type="date"
                        value={diagnosisForm.diagnosis_date}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, diagnosis_date: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={diagnosisForm.status}
                        onValueChange={(value) => setDiagnosisForm({ ...diagnosisForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="monitoring">Em acompanhamento</SelectItem>
                          <SelectItem value="resolved">Resolvido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        placeholder="Observações adicionais..."
                        value={diagnosisForm.notes}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDiagnosisDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveDiagnosis}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {diagnoses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum diagnóstico registrado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Novo Diagnóstico" para adicionar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {diagnoses.map((diagnosis) => (
                  <Card key={diagnosis.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{diagnosis.diagnosis_name}</CardTitle>
                          {diagnosis.diagnosis_code && (
                            <CardDescription className="font-mono">{diagnosis.diagnosis_code}</CardDescription>
                          )}
                        </div>
                        {getStatusBadge(diagnosis.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Diagnosticado em: {format(new Date(diagnosis.diagnosis_date), "dd/MM/yyyy")}
                      </p>
                      {diagnosis.notes && (
                        <p className="text-sm">{diagnosis.notes}</p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Select
                          value={diagnosis.status}
                          onValueChange={(value) => handleUpdateDiagnosisStatus(diagnosis.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Alterar status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="monitoring">Em acompanhamento</SelectItem>
                            <SelectItem value="resolved">Resolvido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
