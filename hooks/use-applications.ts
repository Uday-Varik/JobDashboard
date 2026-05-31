"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Application, ApplicationStage } from "@/lib/types";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*, company:companies(*), contacts(*), notes(*), follow_ups(*)")
      .order("updated_at", { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (values: {
    companyName: string;
    roleTitle: string;
    stage: ApplicationStage;
    appliedDate?: string;
    salaryMin?: number;
    salaryMax?: number;
    jobUrl?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    let companyId: string;

    const { data: existing } = await supabase
      .from("companies")
      .select("id")
      .ilike("name", values.companyName)
      .single();

    if (existing) {
      companyId = existing.id;
    } else {
      const { data: newCompany } = await supabase
        .from("companies")
        .insert({ name: values.companyName })
        .select("id")
        .single();
      companyId = newCompany!.id;
    }

    await supabase.from("applications").insert({
      company_id: companyId,
      role_title: values.roleTitle,
      stage: values.stage,
      applied_date: values.appliedDate,
      salary_min: values.salaryMin,
      salary_max: values.salaryMax,
      job_url: values.jobUrl,
      description: values.description,
      priority: values.priority ?? "medium",
    });

    await fetchApplications();
  };

  const updateStage = async (id: string, stage: ApplicationStage) => {
    await supabase.from("applications").update({ stage }).eq("id", id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage } : a))
    );
  };

  const deleteApplication = async (id: string) => {
    await supabase.from("applications").delete().eq("id", id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  return { applications, loading, fetchApplications, createApplication, updateStage, deleteApplication };
}
