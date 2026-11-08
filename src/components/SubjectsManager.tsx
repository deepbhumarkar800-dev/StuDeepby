"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { refreshPublicSite } from "./revalidate";

export interface SubjectRow {
  id: string;
  course_slug: string;
  university_slug: string;
  semester: number;
  slug: string;
  name: string;
  description: string;
  published: boolean;
}

interface Uni {
  slug: string;
  course_slug: string;
  short_name: string;
}

const SEMS = [1, 2, 3, 4, 5, 6];

export function SubjectsManager({ initial, universities }: { initial: SubjectRow[]; universities: Uni[] }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const { toast } = useToast();
  const [rows, setRows] = useState<SubjectRow[]>(initial);
  const [filterSem, setFilterSem] = useState(0);
  const [editing, setEditing] = useState<SubjectRow | null>(null);
  const [busy, setBusy] = useState(false);

  const uni = universities[0];
  const [name, setName] = useState("");
  const [semester, setSemester] = useState(1);
  const [description, setDescription] = useState("");

  const shown = rows.filter((r) => filterSem === 0 || r.semester === filterSem);

  async function addSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!uni) return toast("No university found. Run the SQL setup first.", "error");
    const clean = name.trim();
    const slug = slugify(clean);
    if (clean.length < 2 || !slug) return toast("Enter a subject name.", "error");
    setBusy(true);
    const { data, error } = await supabase
      .from("subjects")
      .insert({ course_slug: uni.course_slug, university_slug: uni.slug, semester, slug, name: clean, description: description.trim() })
      .select("id, course_slug, university_slug, semester, slug, name, description, published")
      .single();
    setBusy(false);
    if (error || !data) {
      toast(error?.code === "23505" ? "This subject already exists in that semester." : "Could not add subject.", "error");
      return;
    }
    setRows((r) => [...r, data as SubjectRow].sort((a, b) => a.semester - b.semester || a.name.localeCompare(b.name)));
    setName("");
    setDescription("");
    toast("Subject added.", "success");
    void refreshPublicSite();
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const clean = editing.name.trim();
    if (clean.length < 2) return toast("Enter a subject name.", "error");
    setBusy(true);
    const { error } = await supabase
      .from("subjects")
      .update({ name: clean, description: editing.description.trim(), semester: editing.semester })
      .eq("id", editing.id);
    setBusy(false);
    if (error) return toast(error.code === "23505" ? "Another subject with this web address already exists in that semester." : "Could not save.", "error");
    setRows((r) => r.map((x) => (x.id === editing.id ? { ...editing, name: clean } : x)));
    setEditing(null);
    toast("Saved.", "success");
    void refreshPublicSite();
  }

  async function togglePublished(row: SubjectRow) {
    const { error } = await supabase.from("subjects").update({ published: !row.published }).eq("id", row.id);
    if (error) return toast("Could not update.", "error");
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, published: !x.published } : x)));
    void refreshPublicSite();
  }

  async function remove(row: SubjectRow) {
    if (!window.confirm(`Delete "${row.name}"? Its files and videos will be deleted too. This cannot be undone.`)) return;
    setBusy(true);
    const { data: files } = await supabase.from("resources").select("file_path").eq("subject_id", row.id);
    const paths = (files ?? []).map((f) => f.file_path).filter((p): p is string => Boolean(p));
    if (paths.length) await supabase.storage.from("notes").remove(paths);
    const { error } = await supabase.from("subjects").delete().eq("id", row.id);
    setBusy(false);
    if (error) return toast("Could not delete.", "error");
    setRows((r) => r.filter((x) => x.id !== row.id));
    toast("Subject deleted.", "success");
    void refreshPublicSite();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-forest">Subjects</h1>

      <form onSubmit={addSubject} className="space-y-3 rounded-[1.75rem] border border-line bg-ivory p-5 shadow-soft">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-forest">
          <Plus className="h-5 w-5" aria-hidden /> Add a subject
        </h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-forest">Subject name</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Data Structures" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-forest">Semester</span>
            <select className="field" value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
              {SEMS.map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-forest">Short description (optional)</span>
          <input className="field" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">Add subject</Button>
        <p className="text-xs text-ink/70">Course: BCA, University: {uni?.short_name ?? "SGBAU"}. The web address is made from the name once and stays the same if you rename later.</p>
      </form>

      <div>
        <label className="block max-w-xs">
          <span className="mb-1 block text-sm font-semibold text-forest">Show semester</span>
          <select className="field" value={filterSem} onChange={(e) => setFilterSem(Number(e.target.value))}>
            <option value={0}>All semesters</option>
            {SEMS.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sage bg-cream/70 px-4 py-6 text-center text-sm text-ink/80">No subjects here yet. Add the first one above.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => (
            <li key={r.id} className="rounded-[1.5rem] border border-line bg-ivory p-4 shadow-soft">
              {editing?.id === r.id ? (
                <form onSubmit={saveEdit} className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-forest">Subject name</span>
                    <input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-forest">Semester</span>
                    <select className="field" value={editing.semester} onChange={(e) => setEditing({ ...editing, semester: Number(e.target.value) })}>
                      {SEMS.map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-forest">Description</span>
                    <input className="field" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={busy}>Save</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-heading font-bold text-forest">{r.name}</p>
                    <p className="text-sm text-ink/75">
                      Semester {r.semester} {r.published ? "" : "(hidden from the site)"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <IconBtn label={r.published ? "Hide subject" : "Show subject"} onClick={() => togglePublished(r)}>
                      {r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </IconBtn>
                    <IconBtn label="Rename or edit" onClick={() => setEditing(r)}>
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn label="Delete subject" danger onClick={() => remove(r)}>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function IconBtn({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-full border transition ${danger ? "border-[#9b3b2f]/40 text-[#9b3b2f] hover:bg-[#9b3b2f]/10" : "border-line text-forest hover:bg-palemint"}`}
    >
      {children}
    </button>
  );
}
