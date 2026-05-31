"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FollowUp } from "@/lib/types";

export function useFollowUps(applicationId?: string) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("follow_ups")
      .select("*, application:applications(role_title, company:companies(name))")
      .order("due_date", { ascending: true });
    if (applicationId) query = query.eq("application_id", applicationId);
    const { data } = await query;
    setFollowUps(data ?? []);
    setLoading(false);
  }, [supabase, applicationId]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const addFollowUp = async (values: {
    application_id: string;
    due_date: string;
    message?: string;
  }) => {
    await supabase.from("follow_ups").insert({ ...values, completed: false });
    await fetchFollowUps();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await supabase.from("follow_ups").update({ completed }).eq("id", id);
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, completed } : f)));
  };

  const deleteFollowUp = async (id: string) => {
    await supabase.from("follow_ups").delete().eq("id", id);
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  };

  return { followUps, loading, addFollowUp, toggleComplete, deleteFollowUp, refetch: fetchFollowUps };
}
