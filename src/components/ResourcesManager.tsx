"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { categoriesByKind, kindLabel } from "@/lib/categories";
import { getYoutubeId } from "@/lib/youtube";
import type { ResourceKind } from "@/lib/types";
import { IconBtn } from "./SubjectsManager";
import { refreshPublicSite } from "./revalidate";

interface SubjectOption {
  id: string;
  semester: number;
  name: string;
}

interface Row {
  id: string;
  subject_id: string;
  kind: ResourceKind;
  category: string;
  title: string;
  description: string;
  unit: number | null;
  year: number | null;
  pages: number | null;
  youtube_url: string | null;
  file_path: string | null;
  published: boolean;
  download_count: number;
}

interface FormState {
  id: string | null; // null = new
  kind: ResourceKind;
  category: string;
  title: string;
  description: string;
  unit: string;
  year: string;
  pages: string;
  youtubeUrl: string;
  published: boolean;
  file: File | null;
}

const MAX_BYTES = 20 * 1024 * 1024;

const emptyForm = (kind: ResourceKind = "notes"): FormState => ({
  id: null,
  kind,
  category: categoriesByKind[kind][0],
  title: "",
  description: "",
  unit: "",
  year: "",
  pages: "",
  youtubeUrl: "",
  published: true,
  file: null,
});

const toInt = (v: string) => (v.trim() === "" ? null : Number.parseInt(v, 10));

export function ResourcesManager({ subjects }: { subjects: SubjectOption[] }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const { toast } = useToast();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!subjectId) return;
    setLoading(true);
    const { data, error } = await supabase.from("resources").select("*").eq("subject_id", subjectId).order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast("Could not load files.", "error");
    setRows((data ?? []) as Row[]);
  }, [supabase, subjectId, toast]);

  useEffect(() => {
    setForm(null);
    void load();
  }, [load]);

  function startEdit(r: Row) {
    setForm({
      id: r.id,
      kind: r.kind,
      category: r.category,
      title: r.title,
      description: r.description ?? "",
      unit: r.unit?.toString() ?? "",
      year: r.year?.toString() ?? "",
      pages: r.pages?.toString() ?? "",
      youtubeUrl: r.youtube_url ?? "",
      published: r.published,
      file: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function validatePdf(file: File): Promise<string | null> {
    if (file.size > MAX_BYTES) return "PDF is too big. Maximum is 20 MB.";
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return "Only PDF files are allowed.";
    const head = await file.slice(0, 5).text();
    if (head !== "%PDF-") return "This file does not look like a real PDF.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !subjectId) return;
    const title = form.title.trim();
    if (title.length < 2) return toast("Enter a title.", "error");

    const isVideo = form.kind === "video";
    let youtubeUrl: string | null = null;
    if (isVideo) {
      const id = getYoutubeId(form.youtubeUrl);
      if (!id) return toast("Paste a valid YouTube link.", "error");
      youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
    } else if (!form.id && !form.file) {
      return toast("Choose a PDF file to upload.", "error");
    }

    setBusy(true);
    let newPath: string | null = null;
    let newSize: number | null = null;
    const existing = form.id ? rows.find((r) => r.id === form.id) : undefined;

    if (!isVideo && form.file) {
      const problem = await validatePdf(form.file);
      if (problem) {
        setBusy(false);
        return toast(problem, "error");
      }
      newPath = `${subjectId}/${crypto.randomUUID()}.pdf`;
      newSize = form.file.size;
      const up = await supabase.storage.from("notes").upload(newPath, form.file, { contentType: "application/pdf", upsert: false });
      if (up.error) {
        setBusy(false);
        return toast("Upload failed. Check your internet and try again.", "error");
      }
    }

    const payload = {
      subject_id: subjectId,
      kind: form.kind,
      category: form.category,
      title,
      description: form.description.trim(),
      unit: toInt(form.unit),
      year: toInt(form.year),
      pages: toInt(form.pages),
      youtube_url: isVideo ? youtubeUrl : null,
      published: form.published,
      ...(isVideo ? { file_path: null, file_size: null } : newPath ? { file_path: newPath, file_size: newSize } : {}),
    };

    const res = form.id ? await supabase.from("resources").update(payload).eq("id", form.id) : await supabase.from("resources").insert(payload);
    if (res.error) {
      if (newPath) await supabase.storage.from("notes").remove([newPath]);
      setBusy(false);
      return toast("Could not save. Check the numbers (unit, year, pages) and try again.", "error");
    }
    // replaced PDF or switched to a video: remove the old file
    if (existing?.file_path && (newPath || isVideo)) await supabase.storage.from("notes").remove([existing.file_path]);

    setBusy(false);
    toast(form.id ? "Saved." : "Added.", "success");
    setForm(null);
    await load();
    void refreshPublicSite();
  }

  async function togglePublished(r: Row) {
    const { error } = await supabase.from("resources").update({ published: !r.published }).eq("id", r.id);
    if (error) return toast("Could not update.", "error");
    setRows((all) => all.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)));
    void refreshPublicSite();
  }

  async function remove(r: Row) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    if (r.file_path) await supabase.storage.from("notes").remove([r.file_path]);
    const { error } = await supabase.from("resources").delete().eq("id", r.id);
    if (error) return toast("Could not delete.", "error");
    setRows((all) => all.filter((x) => x.id !== r.id));
    toast("Deleted.", "success");
    void refreshPublicSite();
  }

  if (subjects.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-bold text-forest">Files and videos</h1>
        <p className="rounded-2xl border border-dashed border-sage bg-cream/70 px-4 py-6 text-center text-sm text-ink/80">Add a subject first, then come back here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-forest">Files and videos</h1>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-forest">Subject</span>
        <select className="field" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              Sem {s.semester}: {s.name}
            </option>
          ))}
        </select>
      </label>

      {!form && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setForm(emptyForm("notes"))}>
            <Plus className="h-4 w-4" aria-hidden /> Add notes
          </Button>
          <Button variant="secondary" onClick={() => setForm(emptyForm("pyq"))}>
            <Plus className="h-4 w-4" aria-hidden /> Add PYQ
          </Button>
          <Button variant="secondary" onClick={() => setForm(emptyForm("video"))}>
            <Plus className="h-4 w-4" aria-hidden /> Add YouTube video
          </Button>
        </div>
      )}

      {form && (
        <form onSubmit={onSubmit} className="space-y-3 rounded-[1.75rem] border border-botanical/40 bg-ivory p-5 shadow-lift">
          <h2 className="font-heading text-lg font-bold text-forest">
            {form.id ? "Edit" : "Add"} {kindLabel[form.kind]}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">Type</span>
              <select
                className="field"
                value={form.kind}
                disabled={Boolean(form.id)}
                onChange={(e) => {
                  const kind = e.target.value as ResourceKind;
                  setForm({ ...form, kind, category: categoriesByKind[kind][0], file: null });
                }}
              >
                <option value="notes">Notes (PDF)</option>
                <option value="pyq">PYQ (PDF)</option>
                <option value="video">Video (YouTube link)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">Category</span>
              <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categoriesByKind[form.kind].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-forest">Title</span>
            <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Unit 1 notes" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-forest">Description (optional)</span>
            <textarea className="field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">Unit</span>
              <input className="field" inputMode="numeric" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value.replace(/\D/g, "") })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">Exam year</span>
              <input className="field" inputMode="numeric" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">Pages</span>
              <input className="field" inputMode="numeric" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value.replace(/\D/g, "") })} />
            </label>
          </div>

          {form.kind === "video" ? (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-forest">YouTube link</span>
              <input className="field" inputMode="url" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://youtu.be/..." />
              <span className="mt-1 block text-xs text-ink/70">Tip: upload as &ldquo;Unlisted&rdquo; on YouTube if you do not want it on your public channel.</span>
            </label>
          ) : (
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-forest">
                <UploadCloud className="h-4 w-4" aria-hidden />
                PDF file {form.id ? "(leave empty to keep the current file)" : ""}
              </span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="field file:mr-3 file:rounded-full file:border-0 file:bg-botanical file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ivory"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
              />
              <span className="mt-1 block text-xs text-ink/70">PDF only, maximum 20 MB.</span>
            </label>
          )}

          <label className="flex items-center gap-3 py-1 text-sm font-semibold text-forest">
            <input type="checkbox" className="h-5 w-5 accent-botanical" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Show on the website
          </label>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="secondary" disabled={busy} onClick={() => setForm(null)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/75">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sage bg-cream/70 px-4 py-6 text-center text-sm text-ink/80">Nothing added for this subject yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-[1.5rem] border border-line bg-ivory p-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-heading font-bold text-forest">{r.title}</p>
                  <p className="text-sm text-ink/75">
                    {kindLabel[r.kind]}, {r.category}
                    {r.kind !== "video" ? `, ${r.download_count} downloads` : ""}
                    {r.published ? "" : " (hidden)"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <IconBtn label={r.published ? "Hide" : "Show"} onClick={() => togglePublished(r)}>
                    {r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </IconBtn>
                  <IconBtn label="Edit" onClick={() => startEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="Delete" danger onClick={() => remove(r)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
