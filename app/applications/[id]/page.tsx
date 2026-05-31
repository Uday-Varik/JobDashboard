"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FollowUpSuggestion } from "@/components/ai/follow-up-suggestion";
import { STAGES } from "@/lib/types";
import type { Application, ApplicationStage, Contact, Note, FollowUp } from "@/lib/types";
import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2, ExternalLink, User, StickyNote, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLinkedin, setContactLinkedin] = useState("");
  const [contactRole, setContactRole] = useState("");

  // Note form
  const [noteContent, setNoteContent] = useState("");

  // Follow-up form
  const [fuDate, setFuDate] = useState("");
  const [fuMessage, setFuMessage] = useState("");

  const updateStage = async (stage: ApplicationStage) => {
    await supabase.from("applications").update({ stage }).eq("id", id);
    setApp((prev) => prev ? { ...prev, stage } : prev);
  };

  const fetchApp = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*, company:companies(*), contacts(*), notes(*), follow_ups(*)")
      .eq("id", id)
      .single();
    setApp(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  const addContact = async () => {
    if (!contactName) return;
    await supabase.from("contacts").insert({
      application_id: id,
      name: contactName,
      email: contactEmail || null,
      phone: contactPhone || null,
      linkedin: contactLinkedin || null,
      role: contactRole || null,
    });
    setContactName(""); setContactEmail(""); setContactPhone(""); setContactLinkedin(""); setContactRole("");
    await fetchApp();
  };

  const deleteContact = async (cid: string) => {
    await supabase.from("contacts").delete().eq("id", cid);
    await fetchApp();
  };

  const addNote = async () => {
    if (!noteContent) return;
    await supabase.from("notes").insert({ application_id: id, content: noteContent });
    setNoteContent("");
    await fetchApp();
  };

  const addFollowUp = async () => {
    if (!fuDate) return;
    await supabase.from("follow_ups").insert({
      application_id: id,
      due_date: fuDate,
      message: fuMessage || null,
      completed: false,
    });
    setFuDate(""); setFuMessage("");
    await fetchApp();
  };

  const toggleFollowUp = async (fid: string, completed: boolean) => {
    await supabase.from("follow_ups").update({ completed }).eq("id", fid);
    await fetchApp();
  };

  if (loading) return <div className="p-8 text-sm text-gray-400 dark:text-gray-500">Loading...</div>;
  if (!app) return <div className="p-8 text-sm text-red-500">Application not found.</div>;

  const stage = STAGES.find((s) => s.id === app.stage);

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{app.role_title}</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">{app.company?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={app.stage} onValueChange={(v) => updateStage(v as ApplicationStage)}>
            <SelectTrigger className={cn("h-7 text-xs font-medium border rounded px-2 w-auto gap-1.5", stage?.color)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Job Post
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
        {app.applied_date && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Applied</p>
            <p className="text-gray-900 dark:text-gray-100 font-medium mt-0.5">{format(new Date(app.applied_date), "MMM d, yyyy")}</p>
          </div>
        )}
        {(app.salary_min || app.salary_max) && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Salary</p>
            <p className="text-gray-900 dark:text-gray-100 font-medium mt-0.5">
              {app.salary_min ? `$${(app.salary_min / 1000).toFixed(0)}k` : ""}
              {app.salary_max ? `–$${(app.salary_max / 1000).toFixed(0)}k` : ""}
            </p>
          </div>
        )}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Priority</p>
          <p className={cn("font-medium mt-0.5 capitalize", {
            "text-red-600 dark:text-red-400": app.priority === "high",
            "text-amber-600": app.priority === "medium",
            "text-gray-500 dark:text-gray-400 dark:text-gray-500": app.priority === "low",
          })}>{app.priority}</p>
        </div>
      </div>

      {app.description && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{app.description}</p>
        </div>
      )}

      <FollowUpSuggestion application={app} />

      <Separator className="my-6" />

      {/* Contacts */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mb-3">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          Contacts
        </h2>
        <div className="space-y-2 mb-3">
          {(app.contacts ?? []).map((c: Contact) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                <div className="flex gap-2 mt-0.5 flex-wrap">
                  {c.role && <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{c.role}</span>}
                  {c.email && <a href={`mailto:${c.email}`} className="text-xs text-blue-600 hover:underline">{c.email}</a>}
                  {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">{c.phone}</a>}
                  {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">LinkedIn</a>}
                </div>
              </div>
              <button onClick={() => deleteContact(c.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          <Input placeholder="Name *" value={contactName} onChange={(e) => setContactName(e.target.value)} className="text-sm h-8" />
          <Input placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="text-sm h-8" />
          <Input placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="text-sm h-8" />
          <Input placeholder="LinkedIn URL" value={contactLinkedin} onChange={(e) => setContactLinkedin(e.target.value)} className="text-sm h-8" />
          <div className="flex gap-2">
            <Input placeholder="Role" value={contactRole} onChange={(e) => setContactRole(e.target.value)} className="text-sm h-8" />
            <Button size="sm" onClick={addContact} className="h-8 px-3 flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Notes */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mb-3">
          <StickyNote className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          Activity Notes
        </h2>
        <div className="space-y-2 mb-3">
          {(app.notes ?? []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((n: Note) => (
            <div key={n.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{format(new Date(n.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{n.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a note..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button size="sm" onClick={addNote} className="self-end h-8 px-3">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Follow-ups */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mb-3">
          <CalendarClock className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          Follow-ups
        </h2>
        <div className="space-y-2 mb-3">
          {(app.follow_ups ?? []).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map((f: FollowUp) => (
            <div
              key={f.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                f.completed ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60" : "bg-amber-50 dark:bg-amber-950 border-amber-200"
              )}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={f.completed}
                  onChange={(e) => toggleFollowUp(f.id, e.target.checked)}
                  className="rounded"
                />
                <div>
                  <p className={cn("text-sm font-medium", f.completed && "line-through text-gray-500 dark:text-gray-400 dark:text-gray-500")}>
                    {format(new Date(f.due_date), "MMM d, yyyy")}
                  </p>
                  {f.message && <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{f.message}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={fuDate}
            onChange={(e) => setFuDate(e.target.value)}
            className="text-sm h-8 w-40"
          />
          <Input
            placeholder="Reminder note..."
            value={fuMessage}
            onChange={(e) => setFuMessage(e.target.value)}
            className="text-sm h-8 flex-1"
          />
          <Button size="sm" onClick={addFollowUp} className="h-8 px-3">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
