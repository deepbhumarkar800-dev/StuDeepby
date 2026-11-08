"use client";

import { useMemo, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/utils";
import { IconBtn } from "./SubjectsManager";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function MessagesManager({ initial }: { initial: MessageRow[] }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const { toast } = useToast();
  const [rows, setRows] = useState(initial);

  async function markRead(id: string) {
    const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", id);
    if (error) return toast("Could not update.", "error");
    setRows((r) => r.map((x) => (x.id === id ? { ...x, is_read: true } : x)));
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast("Could not delete.", "error");
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-forest">Messages</h1>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sage bg-cream/70 px-4 py-6 text-center text-sm text-ink/80">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => (
            <li key={m.id} className={`rounded-[1.5rem] border p-4 shadow-soft ${m.is_read ? "border-line bg-ivory" : "border-botanical/50 bg-palemint"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading font-bold text-forest">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="break-all text-sm font-medium text-botanical underline">{m.email}</a>
                  <p className="text-xs text-ink/65">{formatDate(m.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  {!m.is_read && (
                    <IconBtn label="Mark as read" onClick={() => markRead(m.id)}>
                      <Check className="h-4 w-4" />
                    </IconBtn>
                  )}
                  <IconBtn label="Delete message" danger onClick={() => remove(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-[15px] text-ink/85">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
