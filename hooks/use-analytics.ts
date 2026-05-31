"use client";

import { useMemo } from "react";
import { format, subWeeks, startOfWeek } from "date-fns";
import type { Application, AnalyticsData, ApplicationStage } from "@/lib/types";
import { STAGES, ACTIVE_STAGES } from "@/lib/types";

export function useAnalytics(applications: Application[]): AnalyticsData {
  return useMemo(() => {
    const total = applications.length;
    const responded = applications.filter((a) =>
      ["phone_screen", "technical", "final_round", "offer", "rejected"].includes(a.stage)
    ).length;
    const offers = applications.filter((a) => a.stage === "offer").length;
    const active = applications.filter((a) => ACTIVE_STAGES.includes(a.stage)).length;

    const responseRate = total > 0 ? (responded / total) * 100 : 0;
    const offerRate = total > 0 ? (offers / total) * 100 : 0;

    const stageBreakdown = STAGES.map((s) => ({
      stage: s.id as ApplicationStage,
      label: s.label,
      count: applications.filter((a) => a.stage === s.id).length,
    }));

    // Weekly volume for last 8 weeks
    const weeklyVolume = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 7 - i));
      const weekEnd = subWeeks(new Date(), 6 - i);
      const count = applications.filter((a) => {
        if (!a.applied_date && !a.created_at) return false;
        const date = new Date(a.applied_date ?? a.created_at);
        return date >= weekStart && date < weekEnd;
      }).length;
      return { week: format(weekStart, "MMM d"), count };
    });

    // Stage conversion rates
    const orderedStages: ApplicationStage[] = [
      "applied", "phone_screen", "technical", "final_round", "offer",
    ];
    const conversionRates = orderedStages.slice(0, -1).map((stage, i) => {
      const fromCount = applications.filter((a) =>
        orderedStages.slice(i).some((s) => s === a.stage)
      ).length;
      const toCount = applications.filter((a) =>
        orderedStages.slice(i + 1).some((s) => s === a.stage)
      ).length;
      return {
        from: STAGES.find((s) => s.id === stage)?.label ?? stage,
        to: STAGES.find((s) => s.id === orderedStages[i + 1])?.label ?? orderedStages[i + 1],
        rate: fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0,
      };
    });

    return {
      totalApplications: total,
      activeApplications: active,
      responseRate,
      offerRate,
      avgDaysToResponse: 0,
      stageBreakdown,
      weeklyVolume,
      conversionRates,
    };
  }, [applications]);
}
