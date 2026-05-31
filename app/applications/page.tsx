"use client";

import { useState } from "react";
import { useApplications } from "@/hooks/use-applications";
import { ApplicationForm } from "@/components/applications/application-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ExternalLink, Trash2 } from "lucide-react";
import { STAGES } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ApplicationStage } from "@/lib/types";

export default function ApplicationsPage() {
  const { applications, loading, createApplication, deleteApplication } = useApplications();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all");

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.company?.name?.toLowerCase().includes(q) ||
      a.role_title.toLowerCase().includes(q);
    const matchesStage = stageFilter === "all" || a.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCreate = async (values: Parameters<typeof createApplication>[0]) => {
    await createApplication(values);
    setOpen(false);
  };

  const stageMeta = Object.fromEntries(STAGES.map((s) => [s.id, s]));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{applications.length} total</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Application
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search company or role..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setStageFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition-colors",
              stageFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All
          </button>
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStageFilter(s.id)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                stageFilter === s.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-16">No applications found</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Stage</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Priority</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Applied</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Salary</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const stage = stageMeta[app.stage];
                return (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {app.company?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.role_title}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded border", stage?.color)}>
                        {stage?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium capitalize", {
                        "text-red-600": app.priority === "high",
                        "text-amber-600": app.priority === "medium",
                        "text-gray-400": app.priority === "low",
                      })}>
                        {app.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {app.applied_date ? format(new Date(app.applied_date), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {app.salary_min
                        ? `$${Math.round(app.salary_min / 1000)}k${app.salary_max ? `–$${Math.round(app.salary_max / 1000)}k` : "+"}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/applications/${app.id}`} className="text-gray-400 hover:text-gray-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
