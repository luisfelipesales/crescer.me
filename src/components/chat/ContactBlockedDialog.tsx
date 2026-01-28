import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Calendar,
  Receipt,
  Bell,
  Users,
  MessageSquare,
} from "lucide-react";

interface ContactBlockedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockedType: "phone" | "email" | "url" | "social" | null;
}

export function ContactBlockedDialog({
  open,
  onOpenChange,
  blockedType,
}: ContactBlockedDialogProps) {
  const getTypeLabel = () => {
    switch (blockedType) {
      case "phone":
        return "número de telefone";
      case "email":
        return "endereço de e-mail";
      case "url":
        return "link externo";
      case "social":
        return "contato de rede social";
      default:
        return "informação de contato";
    }
  };

  const benefits = [
    { icon: Shield, text: "Segurança garantida para você e seu terapeuta" },
    { icon: Calendar, text: "Agendamento e remarcação fácil pela plataforma" },
    { icon: Receipt, text: "Pagamentos e recibos organizados" },
    { icon: Bell, text: "Lembretes automáticos de consultas" },
    { icon: Users, text: "Suporte da equipe Crescer em caso de problemas" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Contato externo detectado
          </DialogTitle>
          <DialogDescription>
            Detectamos um {getTypeLabel()} na sua mensagem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-foreground">
            Para sua segurança e para manter o suporte do Crescer, contatos
            diretos não podem ser compartilhados pelo chat.
          </p>

          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="mb-3 text-sm font-medium text-foreground">
              Por que manter pelo Crescer?
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <benefit.icon className="h-4 w-4 text-primary" />
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Fora da plataforma, não conseguimos garantir suporte, organização e
            registro administrativo do atendimento.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
