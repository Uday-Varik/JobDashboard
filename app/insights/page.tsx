"use client";

import { useApplications } from "@/hooks/use-applications";
import { useAnalytics } from "@/hooks/use-analytics";
import { InsightsPanel } from "@/components/ai/insights-panel";
import { FunnelChart } from "@/components/analytics/funnel-chart";
import { VolumeChart } from "@/components/analytics/volume-chart";
import { StatsCards } from "@/components/analytics/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InsightsPage() {
  const { applications, loading } = useApplications();
  const analytics = useAnalytics(applications);

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">AI Insights</h1>
        <p className="text-sm text-gray-500 mt-0.5">Data-driven coaching from your job search pipeline</p>
      </div>

      <StatsCards data={analytics} />

      <div className="grid grid-cols-2 gap-4">
        <VolumeChart applications={applications} />
        <FunnelChart data={analytics} />
      </div>

      <InsightsPanel analytics={analytics} />

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {STAGES.map((stage) => {
              const count = analytics.stageBreakdown.find((s) => s.stage === stage.id)?.count ?? 0;
              return (
                <div key={stage.id} className={cn("rounded-lg p-3 border text-center", stage.color)}>
                  <p className="text-lg font-semibold">{count}</p>
                  <p className="text-xs mt-0.5 opacity-80">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
