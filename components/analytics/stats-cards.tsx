"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Inbox, CheckCircle, Send } from "lucide-react";
import type { AnalyticsData } from "@/lib/types";

export function StatsCards({ data }: { data: AnalyticsData }) {
  const stats = [
    {
      label: "Total Applications",
      value: data.totalApplications,
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Pipeline",
      value: data.activeApplications,
      icon: Inbox,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Response Rate",
      value: `${data.responseRate.toFixed(0)}%`,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Offer Rate",
      value: `${data.offerRate.toFixed(0)}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
