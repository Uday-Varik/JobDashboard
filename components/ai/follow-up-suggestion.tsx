"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { Application } from "@/lib/types";

interface Props {
  application: Application;
}

export function FollowUpSuggestion({ application }: Props) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await window.fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: application.company?.name ?? "Unknown",
          role: application.role_title,
          stage: application.stage,
          appliedDate: application.applied_date,
          lastActivityDate: application.updated_at,
          contactName: application.contacts?.[0]?.name,
        }),
      });
      const { suggestion } = await res.json();
      setSuggestion(suggestion);
      setOpen(true);
    } catch {
      setSuggestion("Failed to get suggestion.");
    }
    setLoading(false);
  };

  return (
    <div className="border border-purple-100 rounded-lg bg-purple-50/50">
      <button
        onClick={() => (suggestion ? setOpen(!open) : fetch())}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-purple-700 hover:text-purple-800"
      >
        <span className="flex items-center gap-1.5">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          AI Follow-up Suggestion
        </span>
        {suggestion && (open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
      </button>
      {open && suggestion && (
        <div className="px-3 pb-3 text-sm text-gray-600 leading-relaxed border-t border-purple-100 pt-2">
          {suggestion}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetch}
            className="mt-2 h-6 text-xs text-purple-600 hover:text-purple-700 px-2"
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
