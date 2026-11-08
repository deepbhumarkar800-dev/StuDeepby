"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenText, ChevronDown, FileQuestion, PlayCircle, Search, SlidersHorizontal } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import { ResourceModal } from "./ResourceModal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { categoriesByKind } from "@/lib/categories";
import type { Resource, ResourceKind } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "notes" | "videos" | "pyqs";
const tabKind: Record<Tab, ResourceKind> = { notes: "notes", videos: "video", pyqs: "pyq" };
const kindTab: Record<ResourceKind, Tab> = { notes: "notes", video: "videos", pyq: "pyqs" };

const tabs: { id: Tab; label: string; short: string; icon: typeof BookOpenText }[] = [
  { id: "notes", label: "Notes", short: "Notes", icon: BookOpenText },
  { id: "videos", label: "Easy understanding videos", short: "Videos", icon: PlayCircle },
  { id: "pyqs", label: "Previous year questions", short: "PYQs", icon: FileQuestion },
];

type Sort = "newest" | "oldest" | "title" | "popular";
const PAGE_SIZE = 6;

interface Props {
  subjectName: string;
  resources: Resource[];
  initialTab: Tab;
  initialOpenId?: string;
}

export function ResourceExplorer({ subjectName, resources, initialTab, initialOpenId }: Props) {
  const initialResource = resources.find((r) => r.id === initialOpenId) ?? null;
  const [tab, setTab] = useState<Tab>(initialResource ? kindTab[initialResource.kind] : initialTab);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(initialResource?.id ?? null);

  useEffect(() => setPage(1), [tab, query, category, sort]);

  function changeTab(next: Tab) {
    setTab(next);
    setCategory("all");
    window.history.replaceState(null, "", `?tab=${next}`);
  }

  const counts = useMemo(
    () => ({
      notes: resources.filter((r) => r.kind === "notes").length,
      videos: resources.filter((r) => r.kind === "video").length,
      pyqs: resources.filter((r) => r.kind === "pyq").length,
    }),
    [resources],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = resources.filter(
      (r) =>
        r.kind === tabKind[tab] &&
        (category === "all" || r.category === category) &&
        (!term || `${r.title} ${r.category}`.toLowerCase().includes(term)),
    );
    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        break;
      case "oldest":
        sorted.sort((a, b) => a.addedAt.localeCompare(b.addedAt));
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
        break;
      case "popular":
        sorted.sort((a, b) => b.downloads - a.downloads);
        break;
    }
    return sorted;
  }, [resources, tab, category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selected = resources.find((r) => r.id === openId) ?? null;
  const filtersActive = query !== "" || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div>
      <div role="tablist" aria-label="Resource type" className="glass grid grid-cols-3 gap-1.5 rounded-[1.75rem] p-1.5">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls="resource-panel"
              onClick={() => changeTab(t.id)}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[1.35rem] px-2 py-2 font-heading text-[13px] font-semibold transition sm:flex-row sm:gap-2 sm:text-sm",
                active ? "bg-forest text-ivory shadow-soft" : "text-forest hover:bg-palemint",
              )}
            >
              <t.icon className="h-4 w-4" aria-hidden />
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className={cn("rounded-full px-1.5 text-[11px] font-bold", active ? "bg-ivory/20" : "bg-mint")}>{counts[t.id]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Search resources</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-botanical" aria-hidden />
          <input className="field pl-10" placeholder="Search this tab" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <Select label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...categoriesByKind[tabKind[tab]].map((c): [string, string] => [c, c])]} />
        <Select
          label="Sort by"
          value={sort}
          onChange={(v) => setSort(v as Sort)}
          options={[["newest", "Newest first"], ["oldest", "Oldest first"], ["title", "Title A to Z"], ["popular", "Most downloaded"]]}
        />
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-ink/75" aria-live="polite">
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Showing {visible.length} of {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      <div id="resource-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-4">
        {visible.length === 0 ? (
          <EmptyState
            title={filtersActive ? "Nothing matches these filters" : "Nothing here yet"}
            action={filtersActive ? <Button variant="secondary" onClick={clearFilters}>Clear filters</Button> : undefined}
          >
            {filtersActive ? "Try a different word or clear the filters to see everything in this tab." : "Resources for this tab will appear as soon as they are published."}
          </EmptyState>
        ) : (
          <ul className={cn("grid gap-4", tab === "videos" ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>
            {visible.map((r) => (
              <li key={r.id}>
                <ResourceCard resource={r} onOpen={(res) => setOpenId(res.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <Pagination page={safePage} pageCount={pageCount} onChange={(p) => { setPage(p); document.getElementById("resource-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
      </div>

      <ResourceModal
        resource={selected}
        subjectName={subjectName}
        allResources={resources}
        onClose={() => setOpenId(null)}
        onOpen={(r) => setOpenId(r.id)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-botanical" aria-hidden />
      <select className="field appearance-none pr-10" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
