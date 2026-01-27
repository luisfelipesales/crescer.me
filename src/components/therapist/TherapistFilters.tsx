import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export interface TherapistFiltersState {
  ageRange: string;
  specialty: string;
  priceRange: string;
  availability: string;
  approach: string;
}

interface TherapistFiltersProps {
  filters: TherapistFiltersState;
  onFiltersChange: (filters: TherapistFiltersState) => void;
  specialties: Tables<"specialties">[];
  approaches: string[];
}

const AGE_RANGES = [
  { value: "0-6", label: "0-6 anos (Primeira infância)" },
  { value: "7-12", label: "7-12 anos (Infância)" },
  { value: "13-17", label: "13-17 anos (Adolescência)" },
  { value: "18+", label: "18+ anos (Adultos)" },
];

const PRICE_RANGES = [
  { value: "0-150", label: "Até R$ 150" },
  { value: "150-250", label: "R$ 150 - R$ 250" },
  { value: "250-400", label: "R$ 250 - R$ 400" },
  { value: "400+", label: "Acima de R$ 400" },
];

const AVAILABILITY_OPTIONS = [
  { value: "today", label: "Hoje" },
  { value: "this-week", label: "Esta semana" },
  { value: "next-week", label: "Próxima semana" },
];

export function TherapistFilters({
  filters,
  onFiltersChange,
  specialties,
  approaches,
}: TherapistFiltersProps) {
  const handleChange = (key: keyof TherapistFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      ageRange: "",
      specialty: "",
      priceRange: "",
      availability: "",
      approach: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Age Range */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.ageRange}
            onValueChange={(v) => handleChange("ageRange", v)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-card">
              <SelectValue placeholder="Faixa etária" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {AGE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialty/Concern */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.specialty}
            onValueChange={(v) => handleChange("specialty", v)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="Queixa / Especialidade" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {specialties.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.priceRange}
            onValueChange={(v) => handleChange("priceRange", v)}
          >
            <SelectTrigger className="w-full sm:w-[160px] bg-card">
              <SelectValue placeholder="Preço" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.availability}
            onValueChange={(v) => handleChange("availability", v)}
          >
            <SelectTrigger className="w-full sm:w-[160px] bg-card">
              <SelectValue placeholder="Disponibilidade" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Approach */}
        {approaches.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select
              value={filters.approach}
              onValueChange={(v) => handleChange("approach", v)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-card">
                <SelectValue placeholder="Abordagem" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {approaches.map((approach) => (
                  <SelectItem key={approach} value={approach}>
                    {approach}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
