import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Download, DollarSign, Calendar, FileText } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface TherapistPayoutsProps {
  therapistId: string;
}

export function TherapistPayouts({ therapistId }: TherapistPayoutsProps) {
  const [payouts, setPayouts] = useState<Tables<"therapist_payouts">[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pending: 0,
    sessionsThisMonth: 0,
  });

  useEffect(() => {
    if (therapistId) {
      fetchPayouts();
      fetchStats();
    }
  }, [therapistId]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("therapist_payouts")
        .select("*")
        .eq("therapist_id", therapistId)
        .order("created_at", { ascending: false });

      setPayouts(data || []);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get completed sessions this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: sessionsCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("therapist_id", therapistId)
        .eq("status", "completed")
        .gte("scheduled_at", startOfMonth.toISOString());

      // Calculate earnings from payouts
      const { data: payoutData } = await supabase
        .from("therapist_payouts")
        .select("amount, status")
        .eq("therapist_id", therapistId);

      const totalEarned =
        payoutData
          ?.filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + p.amount, 0) || 0;

      const pending =
        payoutData
          ?.filter((p) => p.status === "pending")
          .reduce((sum, p) => sum + p.amount, 0) || 0;

      setStats({
        totalEarned,
        pending,
        sessionsThisMonth: sessionsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processando</Badge>;
      case "paid":
        return <Badge className="bg-green-500">Pago</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total recebido</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(stats.totalEarned)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendente</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(stats.pending)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessões este mês</p>
              <p className="text-xl font-bold text-foreground">
                {stats.sessionsThisMonth}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts list */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Repasses</CardTitle>
          <CardDescription>
            Seus repasses e recibos disponíveis para download
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground">Nenhum repasse ainda</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Seus repasses aparecerão aqui após as sessões serem concluídas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(payout.amount)}
                      </p>
                      {getStatusBadge(payout.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Período:{" "}
                      {format(new Date(payout.period_start), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}{" "}
                      -{" "}
                      {format(new Date(payout.period_end), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    {payout.paid_at && (
                      <p className="text-xs text-muted-foreground">
                        Pago em:{" "}
                        {format(new Date(payout.paid_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    )}
                  </div>

                  {payout.receipt_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={payout.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Baixar recibo
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
