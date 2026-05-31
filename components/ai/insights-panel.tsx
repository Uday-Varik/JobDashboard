"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import type { AnalyticsData } from "@/lib/types";

interface Props {
  analytics: AnalyticsData;
}

export function InsightsPanel({ analytics }: Props) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalApplications: analytics.totalApplications,
          responseRate: analytics.responseRate,
          stageBreakdown: analytics.stageBreakdown,
          topIndustries: [],
          avgDaysToResponse: analytics.avgDaysToResponse,
        }),
      });
      const { insights } = await res.json();
      setInsights(insights);
    } catch {
      setInsights("Failed to load insights. Check your API key.");
    }
    setLoading(false);
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Coach Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInsights}
            disabled={loading}
            className="h-7 text-xs"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : insights ? (
              <RefreshCw className="w-3 h-3" />
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{insights}</div>
        ) : (
          <div className="text-sm text-gray-400 text-center py-4">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            Click Analyze to get AI coaching based on your pipeline data.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
