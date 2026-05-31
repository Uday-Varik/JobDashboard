"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AnalyticsData } from "@/lib/types";

export function FunnelChart({ data }: { data: AnalyticsData }) {
  const stages = data.stageBreakdown.filter((s) =>
    ["applied", "phone_screen", "technical", "final_round", "offer"].includes(s.stage)
  );
  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pipeline Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.stage} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-medium">{stage.label}</span>
              <span className="text-gray-400 dark:text-gray-500">{stage.count}</span>
            </div>
            <Progress value={(stage.count / max) * 100} className="h-1.5" />
          </div>
        ))}
        {data.conversionRates.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Conversion Rates</p>
            {data.conversionRates.map((r) => (
              <div key={`${r.from}-${r.to}`} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{r.from} → {r.to}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{r.rate}%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
