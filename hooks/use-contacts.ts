"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Contact } from "@/lib/types";

export function useContacts(applicationId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (applicationId) query = query.eq("application_id", applicationId);
    const { data } = await query;
    setContacts(data ?? []);
    setLoading(false);
  }, [supabase, applicationId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (values: Omit<Contact, "id" | "created_at">) => {
    await supabase.from("contacts").insert({
      ...values,
      application_id: values.application_id ?? null,
    });
    await fetchContacts();
  };

  const deleteContact = async (id: string) => {
    await supabase.from("contacts").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return { contacts, loading, addContact, deleteContact, refetch: fetchContacts };
}
