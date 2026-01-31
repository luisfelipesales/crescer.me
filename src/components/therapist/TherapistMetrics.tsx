import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign,
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TherapistMetricsProps {
  therapistId: string;
}

interface MonthlyData {
  month: string;
  receita: number;
  sessoes: number;
}

interface SessionStats {
  completed: number;
  cancelled: number;
  noShow: number;
  pending: number;
}

export function TherapistMetrics({ therapistId }: TherapistMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    completed: 0,
    cancelled: 0,
    noShow: 0,
    pending: 0
  });
  const [retentionRate, setRetentionRate] = useState(0);
  const [avgSessionsPerPatient, setAvgSessionsPerPatient] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (therapistId) {
      fetchMetrics();
    }
  }, [therapistId]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Fetch appointments for the last 6 months
      const sixMonthsAgo = subMonths(new Date(), 6);
      
      const { data: appointments } = await supabase
        .from("appointments")
        .select("*")
        .eq("therapist_id", therapistId)
        .gte("scheduled_at", sixMonthsAgo.toISOString());

      if (appointments) {
        // Calculate session stats
        const stats: SessionStats = {
          completed: appointments.filter(a => a.status === "completed").length,
          cancelled: appointments.filter(a => a.status === "cancelled").length,
          noShow: 0, // Would need session_logs to track this
          pending: appointments.filter(a => a.status === "pending" || a.status === "confirmed").length
        };
        setSessionStats(stats);

        // Calculate monthly data
        const monthlyMap = new Map<string, { receita: number; sessoes: number }>();
        
        for (let i = 5; i >= 0; i--) {
          const month = subMonths(new Date(), i);
          const monthKey = format(month, "MMM", { locale: ptBR });
          monthlyMap.set(monthKey, { receita: 0, sessoes: 0 });
        }

        // Get therapist's session price
        const { data: profile } = await supabase
          .from("profiles")
          .select("session_price")
          .eq("id", therapistId)
          .single();

        const sessionPrice = profile?.session_price || 150;

        appointments
          .filter(a => a.status === "completed")
          .forEach(appointment => {
            const monthKey = format(new Date(appointment.scheduled_at), "MMM", { locale: ptBR });
            const current = monthlyMap.get(monthKey);
            if (current) {
              monthlyMap.set(monthKey, {
                receita: current.receita + sessionPrice,
                sessoes: current.sessoes + 1
              });
            }
          });

        const monthlyDataArray = Array.from(monthlyMap.entries()).map(([month, data]) => ({
          month,
          receita: data.receita,
          sessoes: data.sessoes
        }));
        setMonthlyData(monthlyDataArray);

        // Calculate unique patients
        const uniquePatients = new Set(appointments.map(a => a.patient_id));
        setTotalPatients(uniquePatients.size);

        // Calculate retention rate (patients with 2+ sessions)
        const patientSessionCount = new Map<string, number>();
        appointments
          .filter(a => a.status === "completed")
          .forEach(a => {
            patientSessionCount.set(a.patient_id, (patientSessionCount.get(a.patient_id) || 0) + 1);
          });

        const returningPatients = Array.from(patientSessionCount.values()).filter(count => count >= 2).length;
        const totalPatientsWithSessions = patientSessionCount.size;
        const retention = totalPatientsWithSessions > 0 
          ? Math.round((returningPatients / totalPatientsWithSessions) * 100) 
          : 0;
        setRetentionRate(retention);

        // Average sessions per patient
        const totalSessions = stats.completed;
        const avgSessions = totalPatientsWithSessions > 0 
          ? (totalSessions / totalPatientsWithSessions).toFixed(1) 
          : "0";
        setAvgSessionsPerPatient(parseFloat(avgSessions));

        // Total revenue
        const revenue = stats.completed * sessionPrice;
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: "Concluídas", value: sessionStats.completed, color: "hsl(var(--primary))" },
    { name: "Canceladas", value: sessionStats.cancelled, color: "hsl(var(--destructive))" },
    { name: "Pendentes", value: sessionStats.pending, color: "hsl(var(--muted-foreground))" },
  ].filter(d => d.value > 0);

  const chartConfig = {
    receita: {
      label: "Receita",
      color: "hsl(var(--primary))",
    },
    sessoes: {
      label: "Sessões",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSessions = sessionStats.completed + sessionStats.cancelled + sessionStats.pending;
  const completionRate = totalSessions > 0 
    ? Math.round((sessionStats.completed / totalSessions) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita (6 meses)</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalRevenue.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1 text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Continuidade</p>
                <p className="text-2xl font-bold text-foreground">{retentionRate}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              {retentionRate >= 60 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">Excelente</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-amber-500" />
                  <span className="text-amber-500">Pode melhorar</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">pacientes retornam</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pacientes Atendidos</p>
                <p className="text-2xl font-bold text-foreground">{totalPatients}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">
                Média de {avgSessionsPerPatient} sessões/paciente
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">
                {sessionStats.completed} de {totalSessions} sessões
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Mensal</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                  className="text-xs"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Receita"]}
                />
                <Bar 
                  dataKey="receita" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sessions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessões por Mês</CardTitle>
            <CardDescription>Evolução de atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [value, "Sessões"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessoes" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Session Status Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Sessões</CardTitle>
            <CardDescription>Por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer config={chartConfig} className="h-[250px] w-[250px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo de Desempenho</CardTitle>
            <CardDescription>Indicadores principais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Sessões Concluídas</span>
              </div>
              <span className="text-xl font-bold">{sessionStats.completed}</span>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Sessões Canceladas</span>
              </div>
              <span className="text-xl font-bold">{sessionStats.cancelled}</span>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Sessões Pendentes</span>
              </div>
              <span className="text-xl font-bold">{sessionStats.pending}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Média por Paciente</span>
              </div>
              <span className="text-xl font-bold">{avgSessionsPerPatient} sessões</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
