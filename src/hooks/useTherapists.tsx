import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { TherapistFiltersState } from "@/components/therapist/TherapistFilters";
import { addDays, setHours, setMinutes, isBefore, isAfter, startOfDay } from "date-fns";

export type TherapistWithDetails = Tables<"profiles"> & {
  availability?: Tables<"therapist_availability">[];
  specialties?: { specialty: Tables<"specialties"> }[];
  nextAvailable?: Date | null;
};

export function useTherapists(filters: TherapistFiltersState) {
  const [therapists, setTherapists] = useState<TherapistWithDetails[]>([]);
  const [specialties, setSpecialties] = useState<Tables<"specialties">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTherapists();
    fetchSpecialties();
  }, []);

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          availability:therapist_availability(*),
          specialties:therapist_specialties(specialty:specialties(*))
        `)
        .eq("profile_type", "therapist");

      if (error) throw error;

      // Calculate next available slot for each therapist
      const therapistsWithAvailability = (data || []).map((therapist) => {
        const nextAvailable = calculateNextAvailableSlot(therapist as TherapistWithDetails);
        return { ...therapist, nextAvailable } as TherapistWithDetails;
      });

      setTherapists(therapistsWithAvailability);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const { data } = await supabase
        .from("specialties")
        .select("*")
        .order("name");
      setSpecialties(data || []);
    } catch (err) {
      console.error("Error fetching specialties:", err);
    }
  };

  const calculateNextAvailableSlot = (therapist: TherapistWithDetails): Date | null => {
    if (!therapist.availability || therapist.availability.length === 0) {
      return null;
    }

    const now = new Date();
    const maxDays = 30; // Look up to 30 days ahead

    for (let i = 0; i < maxDays; i++) {
      const checkDate = addDays(startOfDay(now), i);
      const dayOfWeek = checkDate.getDay();

      const slotsForDay = therapist.availability.filter(
        (a) => a.day_of_week === dayOfWeek && a.is_active
      );

      for (const slot of slotsForDay) {
        const [startHour, startMin] = slot.start_time.split(":").map(Number);
        const slotTime = setMinutes(setHours(checkDate, startHour), startMin);

        // Skip if slot is in the past
        if (isAfter(slotTime, now)) {
          return slotTime;
        }
      }
    }

    return null;
  };

  // Filter therapists based on current filters
  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      // Age range filter
      if (filters.ageRange) {
        const [minStr, maxStr] = filters.ageRange.split("-");
        const filterMin = parseInt(minStr) || 0;
        const filterMax = maxStr === "+" ? 100 : parseInt(maxStr) || 100;

        const therapistMin = therapist.min_age || 0;
        const therapistMax = therapist.max_age || 100;

        // Check if ranges overlap
        if (filterMax < therapistMin || filterMin > therapistMax) {
          return false;
        }
      }

      // Specialty filter
      if (filters.specialty) {
        const hasSpecialty = therapist.specialties?.some(
          (s) => s.specialty.id === filters.specialty
        );
        if (!hasSpecialty) return false;
      }

      // Price range filter
      if (filters.priceRange && therapist.session_price) {
        const priceInReais = therapist.session_price / 100;
        const [minStr, maxStr] = filters.priceRange.split("-");
        const min = parseInt(minStr) || 0;
        const max = maxStr === "+" ? Infinity : parseInt(maxStr) || Infinity;

        if (priceInReais < min || priceInReais > max) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability && therapist.nextAvailable) {
        const now = new Date();
        const nextSlot = therapist.nextAvailable;

        switch (filters.availability) {
          case "today":
            if (
              nextSlot.getDate() !== now.getDate() ||
              nextSlot.getMonth() !== now.getMonth()
            ) {
              return false;
            }
            break;
          case "this-week":
            if (isAfter(nextSlot, addDays(now, 7))) {
              return false;
            }
            break;
          case "next-week":
            if (isAfter(nextSlot, addDays(now, 14))) {
              return false;
            }
            break;
        }
      }

      // Approach filter
      if (filters.approach) {
        if (
          !therapist.therapeutic_approach ||
          !therapist.therapeutic_approach
            .toLowerCase()
            .includes(filters.approach.toLowerCase())
        ) {
          return false;
        }
      }

      return true;
    });
  }, [therapists, filters]);

  // Get unique approaches from therapists
  const approaches = useMemo(() => {
    const uniqueApproaches = new Set<string>();
    therapists.forEach((t) => {
      if (t.therapeutic_approach) {
        uniqueApproaches.add(t.therapeutic_approach);
      }
    });
    return Array.from(uniqueApproaches).sort();
  }, [therapists]);

  return {
    therapists: filteredTherapists,
    allTherapists: therapists,
    specialties,
    approaches,
    loading,
    error,
    refetch: fetchTherapists,
  };
}
