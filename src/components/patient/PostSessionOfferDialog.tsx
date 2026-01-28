import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle,
  Receipt,
  Bell,
  Users,
  Package,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { logError } from "@/lib/errorLogger";

interface PostSessionOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: {
    id: string;
    appointment_id: string;
    therapist_id: string;
    therapist_name: string;
    session_price: number; // em centavos
  };
  patientId: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function PostSessionOfferDialog({
  open,
  onOpenChange,
  offer,
  patientId,
  onAccept,
  onDecline,
}: PostSessionOfferDialogProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const PACKAGE_SIZE = 4;
  const DISCOUNT_PERCENT = 10;
  const pricePerSession = offer.session_price;
  const originalTotal = pricePerSession * PACKAGE_SIZE;
  const discountedTotal = originalTotal * (1 - DISCOUNT_PERCENT / 100);
  const savings = originalTotal - discountedTotal;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handleAcceptPackage = async () => {
    setLoading(true);
    try {
      // Criar o pacote de sessões
      const { error: packageError } = await supabase
        .from("session_packages")
        .insert({
          patient_id: patientId,
          therapist_id: offer.therapist_id,
          total_sessions: PACKAGE_SIZE,
          used_sessions: 0,
          price_per_session: Math.round(pricePerSession * (1 - DISCOUNT_PERCENT / 100)),
          discount_percent: DISCOUNT_PERCENT,
          status: "active",
        });

      if (packageError) throw packageError;

      // Atualizar a oferta como aceita
      const { error: offerError } = await supabase
        .from("post_session_offers")
        .update({
          status: "accepted",
          responded_at: new Date().toISOString(),
        })
        .eq("id", offer.id);

      if (offerError) throw offerError;

      toast.success("Pacote adquirido com sucesso! 🎉");
      onOpenChange(false);
      onAccept?.();
      
      // Redirecionar para agendar próxima sessão
      navigate(`/agendar?therapist=${offer.therapist_id}`);
    } catch (error) {
      logError("PostSessionOfferDialog.handleAcceptPackage", error);
      toast.error("Erro ao adquirir pacote. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueSingle = async () => {
    setLoading(true);
    try {
      // Atualizar a oferta como recusada
      const { error } = await supabase
        .from("post_session_offers")
        .update({
          status: "declined",
          responded_at: new Date().toISOString(),
        })
        .eq("id", offer.id);

      if (error) throw error;

      onOpenChange(false);
      onDecline?.();
      
      // Redirecionar para agendar próxima sessão avulsa
      navigate(`/agendar?therapist=${offer.therapist_id}`);
    } catch (error) {
      logError("PostSessionOfferDialog.handleContinueSingle", error);
      toast.error("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Calendar, text: "Agendamento e remarcação simples" },
    { icon: Receipt, text: "Pagamento, recibos e histórico organizados" },
    { icon: Bell, text: "Lembretes automáticos" },
    { icon: Users, text: "Suporte da equipe Crescer" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-success" />
            Sessão concluída!
          </DialogTitle>
          <DialogDescription>
            Quer dar continuidade com mais facilidade?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package offer */}
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Pacote {PACKAGE_SIZE} sessões
                </span>
              </div>
              <Badge className="bg-success text-success-foreground">
                {DISCOUNT_PERCENT}% OFF
              </Badge>
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Valor original:</span>
                <span className="text-muted-foreground line-through">
                  {formatPrice(originalTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Com desconto:</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(discountedTotal)}
                </span>
              </div>
              <p className="text-sm text-success">
                Economize {formatPrice(savings)}!
              </p>
            </div>

            <Button
              onClick={handleAcceptPackage}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              Comprar Pacote {PACKAGE_SIZE}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Pode parcelar em até 4x
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Por que manter pelo Crescer?
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <benefit.icon className="h-4 w-4 text-primary" />
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Continue single */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={handleContinueSingle}
              disabled={loading}
              className="w-full"
            >
              Continuar avulso
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Agendar próxima sessão com {offer.therapist_name}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
