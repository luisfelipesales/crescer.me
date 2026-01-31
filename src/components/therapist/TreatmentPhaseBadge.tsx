import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  Search, 
  Heart, 
  Shield, 
  GraduationCap 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TreatmentPhase = 
  | "triagem" 
  | "avaliacao" 
  | "tratamento_ativo" 
  | "manutencao" 
  | "alta";

interface TreatmentPhaseBadgeProps {
  phase: TreatmentPhase;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const phaseConfig: Record<TreatmentPhase, {
  label: string;
  icon: typeof ClipboardList;
  className: string;
}> = {
  triagem: {
    label: "Triagem",
    icon: ClipboardList,
    className: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  },
  avaliacao: {
    label: "Avaliação",
    icon: Search,
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  tratamento_ativo: {
    label: "Tratamento Ativo",
    icon: Heart,
    className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
  },
  manutencao: {
    label: "Manutenção",
    icon: Shield,
    className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  alta: {
    label: "Alta",
    icon: GraduationCap,
    className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
  },
};

export function TreatmentPhaseBadge({ 
  phase, 
  size = "sm",
  showIcon = true 
}: TreatmentPhaseBadgeProps) {
  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        config.className,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      )}
    >
      {showIcon && <Icon className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      {config.label}
    </Badge>
  );
}

export function getPhaseLabel(phase: TreatmentPhase): string {
  return phaseConfig[phase].label;
}

export function getNextPhase(currentPhase: TreatmentPhase): TreatmentPhase | null {
  const phaseOrder: TreatmentPhase[] = [
    "triagem",
    "avaliacao",
    "tratamento_ativo",
    "manutencao",
    "alta"
  ];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  if (currentIndex < phaseOrder.length - 1) {
    return phaseOrder[currentIndex + 1];
  }
  return null;
}

export function getPreviousPhase(currentPhase: TreatmentPhase): TreatmentPhase | null {
  const phaseOrder: TreatmentPhase[] = [
    "triagem",
    "avaliacao",
    "tratamento_ativo",
    "manutencao",
    "alta"
  ];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  if (currentIndex > 0) {
    return phaseOrder[currentIndex - 1];
  }
  return null;
}

export const allPhases: TreatmentPhase[] = [
  "triagem",
  "avaliacao",
  "tratamento_ativo",
  "manutencao",
  "alta"
];
