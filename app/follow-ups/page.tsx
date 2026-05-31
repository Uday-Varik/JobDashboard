"use client";

import { useFollowUps } from "@/hooks/use-follow-ups";
import { format, isPast, isToday } from "date-fns";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FollowUpsPage() {
  const { followUps, loading, toggleComplete } = useFollowUps();

  const pending = followUps.filter((f) => !f.completed);
  const completed = followUps.filter((f) => f.completed);
  const overdue = pending.filter(
    (f) => isPast(new Date(f.due_date)) && !isToday(new Date(f.due_date))
  );

  const renderList = (items: typeof followUps) => {
    if (items.length === 0) {
      return <p className="text-sm text-gray-400 text-center py-10">None here</p>;
    }
    return (
      <div className="space-y-2">
        {items.map((f) => {
          const overdue = isPast(new Date(f.due_date)) && !isToday(new Date(f.due_date)) && !f.completed;
          const app = f.application as { company?: { name?: string }; role_title?: string } | undefined;
          return (
            <div
              key={f.id}
              className={cn(
                "flex items-start justify-between p-4 rounded-xl border",
                f.completed
                  ? "bg-gray-50 border-gray-200 opacity-60"
                  : overdue
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={f.completed}
                  onChange={(e) => toggleComplete(f.id, e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <div>
                  <p className={cn("text-sm font-medium text-gray-900", f.completed && "line-through text-gray-400")}>
                    {app?.company?.name ?? "—"} · {app?.role_title ?? "—"}
                  </p>
                  {f.message && (
                    <p className="text-xs text-gray-500 mt-0.5">{f.message}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs ml-4 flex-shrink-0">
                {overdue && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                {f.completed && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                <span className={cn("font-medium", overdue ? "text-red-600" : "text-gray-500")}>
                  {isToday(new Date(f.due_date)) ? "Today" : format(new Date(f.due_date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Follow-ups</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {overdue.length > 0 && (
            <span className="text-red-600 font-medium">{overdue.length} overdue · </span>
          )}
          {pending.length} pending
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">{renderList(pending)}</TabsContent>
          <TabsContent value="completed">{renderList(completed)}</TabsContent>
        </Tabs>
      )}
    </div>
  );
}
