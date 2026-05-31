"use client";

import { StatsCards } from "@/components/analytics/stats-cards";
import { VolumeChart } from "@/components/analytics/volume-chart";
import { FunnelChart } from "@/components/analytics/funnel-chart";
import { InsightsPanel } from "@/components/ai/insights-panel";
import { useApplications } from "@/hooks/use-applications";
import { useAnalytics } from "@/hooks/use-analytics";
import { useFollowUps } from "@/hooks/use-follow-ups";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, AlertCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { applications, loading } = useApplications();
  const analytics = useAnalytics(applications);
  const { followUps } = useFollowUps();

  const upcoming = followUps
    .filter((f) => !f.completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your job search at a glance</p>
      </div>

      <StatsCards data={analytics} />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <VolumeChart applications={applications} />
        </div>
        <FunnelChart data={analytics} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InsightsPanel analytics={analytics} />

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-amber-500" />
              Upcoming Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No pending follow-ups</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((f) => {
                  const overdue = isPast(new Date(f.due_date)) && !isToday(new Date(f.due_date));
                  return (
                    <div
                      key={f.id}
                      className={cn(
                        "flex items-start justify-between p-2.5 rounded-lg border text-sm",
                        overdue ? "border-red-200 bg-red-50" : "border-gray-200"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {(f.application as { company?: { name?: string }; role_title?: string } | undefined)?.company?.name ?? "—"} ·{" "}
                          {(f.application as { role_title?: string } | undefined)?.role_title ?? "—"}
                        </p>
                        {f.message && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{f.message}</p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end gap-1">
                        <span className={cn("text-xs font-medium", overdue ? "text-red-600" : "text-gray-500")}>
                          {isToday(new Date(f.due_date))
                            ? "Today"
                            : format(new Date(f.due_date), "MMM d")}
                        </span>
                        {overdue && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
                <Link
                  href="/follow-ups"
                  className="block text-center text-xs text-blue-600 hover:underline pt-1"
                >
                  View all follow-ups
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
