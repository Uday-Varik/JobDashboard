"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGES } from "@/lib/types";
import type { ApplicationStage } from "@/lib/types";

interface Props {
  onSubmit: (values: {
    companyName: string;
    roleTitle: string;
    stage: ApplicationStage;
    appliedDate?: string;
    salaryMin?: number;
    salaryMax?: number;
    jobUrl?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }) => Promise<void>;
  onCancel: () => void;
  defaultStage?: ApplicationStage;
}

export function ApplicationForm({ onSubmit, onCancel, defaultStage = "applied" }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    roleTitle: "",
    stage: defaultStage,
    appliedDate: "",
    salaryMin: "",
    salaryMax: "",
    jobUrl: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.roleTitle) return;
    setLoading(true);
    await onSubmit({
      companyName: form.companyName,
      roleTitle: form.roleTitle,
      stage: form.stage as ApplicationStage,
      appliedDate: form.appliedDate || undefined,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      jobUrl: form.jobUrl || undefined,
      description: form.description || undefined,
      priority: form.priority,
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Company *</Label>
          <Input placeholder="Google" value={form.companyName} onChange={set("companyName")} required />
        </div>
        <div className="space-y-1.5">
          <Label>Role *</Label>
          <Input placeholder="Senior Software Engineer" value={form.roleTitle} onChange={set("roleTitle")} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Stage</Label>
          <Select value={form.stage} onValueChange={(v) => setForm((p) => ({ ...p, stage: v as ApplicationStage }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(v) => setForm((p) => ({ ...p, priority: v as "low" | "medium" | "high" }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Applied Date</Label>
          <Input type="date" value={form.appliedDate} onChange={set("appliedDate")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Salary Min ($)</Label>
          <Input type="number" placeholder="120000" value={form.salaryMin} onChange={set("salaryMin")} />
        </div>
        <div className="space-y-1.5">
          <Label>Salary Max ($)</Label>
          <Input type="number" placeholder="160000" value={form.salaryMax} onChange={set("salaryMax")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Job URL</Label>
        <Input placeholder="https://jobs.example.com/..." value={form.jobUrl} onChange={set("jobUrl")} />
      </div>

      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea placeholder="Key requirements, notes..." value={form.description} onChange={set("description")} rows={3} />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : "Add Application"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
