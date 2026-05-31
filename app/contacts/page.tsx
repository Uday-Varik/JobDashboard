"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/use-contacts";
import { useApplications } from "@/hooks/use-applications";
import { Trash2, Mail, Link2, User, Plus, Search, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ContactsPage() {
  const { contacts, loading, addContact, deleteContact } = useContacts();
  const { applications } = useApplications();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    role: string;
    notes: string;
    application_id: string | null;
  }>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    role: "",
    notes: "",
    application_id: null,
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    await addContact({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      linkedin: form.linkedin || null,
      role: form.role || null,
      notes: form.notes || null,
      application_id: form.application_id || null,
    });
    setForm({ name: "", email: "", phone: "", linkedin: "", role: "", notes: "", application_id: null });
    setSaving(false);
    setOpen(false);
  };

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Contacts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">Recruiters and hiring managers across all applications</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Contact
        </Button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 dark:text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-16">
          No contacts yet. Click "Add Contact" to get started.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Phone</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">LinkedIn</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Linked Application</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const linkedApp = applications.find((a) => a.id === c.application_id);
                return (
                  <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 dark:text-gray-500">{c.role ?? "—"}</td>
                    <td className="px-4 py-3">
                      {c.email ? (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                          <Mail className="w-3.5 h-3.5" />
                          {c.email}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {c.phone ? (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100">
                          <Phone className="w-3.5 h-3.5" />
                          {c.phone}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {c.linkedin ? (
                        <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                          <Link2 className="w-3.5 h-3.5" />
                          Profile
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 text-xs">
                      {linkedApp
                        ? `${linkedApp.company?.name ?? "?"} · ${linkedApp.role_title}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteContact(c.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 float-right">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-1">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input placeholder="Jane Smith" value={form.name} onChange={set("name")} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role / Title</Label>
                <Input placeholder="Recruiter" value={form.role} onChange={set("role")} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={set("linkedin")} />
            </div>
            <div className="space-y-1.5">
              <Label>Link to Application <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span></Label>
              <Select
                value={form.application_id}
                onValueChange={(v) => setForm((p) => ({ ...p, application_id: v === "none" ? null : v }))}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select an application..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No application —</SelectItem>
                  {applications.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.company?.name ?? "?"} · {a.role_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Met at conference, referred by..." value={form.notes} onChange={set("notes")} rows={2} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Add Contact"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
