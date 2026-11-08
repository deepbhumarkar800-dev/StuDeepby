"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";

export interface SearchItem {
  name: string;
  semester: number;
  href: string;
}

/** The pill search bar from the reference design, used to jump straight to a subject. */
export function SubjectSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items.filter((i) => i.name.toLowerCase().includes(term)).slice(0, 5);
  }, [q, items]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) router.push(results[0].href);
  }

  return (
    <section className="container-x relative z-30 mt-10 sm:mt-14" aria-label="Find a subject">
      <div className="relative mx-auto max-w-3xl">
        {/* connector line from the hero panel, as in the reference layout */}
        <div aria-hidden className="absolute -top-10 left-1/2 hidden h-10 w-0.5 -translate-x-1/2 bg-forest/60 sm:block" />
        <div aria-hidden className="absolute -top-11 left-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-forest sm:block" />

        <form onSubmit={onSubmit} role="search" className="panel on-dark flex items-center gap-2 rounded-full p-2 pl-5 sm:gap-3 sm:pl-6">
          <label htmlFor="subject-search" className="relative z-10 hidden shrink-0 font-heading text-sm font-semibold sm:block">
            Find a subject
          </label>
          <div className="relative z-10 flex min-h-[48px] flex-1 items-center gap-2 rounded-full bg-gradient-to-b from-white to-mint/80 px-4 text-forest">
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            <input
              id="subject-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type a subject name"
              aria-controls={listId}
              autoComplete="off"
              className="w-full min-w-0 bg-transparent text-[15px] text-forest outline-none placeholder:text-forest/60"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="rounded-full p-1 hover:bg-forest/10">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            aria-label="Go to first match"
            disabled={results.length === 0}
            className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ivory text-forest transition hover:bg-white disabled:opacity-50"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </form>

        <div id={listId} aria-live="polite">
          {q.trim() && (
            <div className="glass mt-3 overflow-hidden rounded-3xl shadow-lift">
              {results.length > 0 ? (
                <ul>
                  {results.map((r) => (
                    <li key={r.href} className="border-b border-line last:border-0">
                      <Link href={r.href} className="flex min-h-[52px] items-center justify-between gap-3 px-5 py-3 hover:bg-palemint">
                        <span className="font-heading text-[15px] font-semibold text-forest">{r.name}</span>
                        <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-forest">Semester {r.semester}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-ink/75">
                  No subject matches &ldquo;{q.trim()}&rdquo; yet. Try a shorter word, or{" "}
                  <Link href="/courses/bca/sgbau" className="font-semibold text-botanical underline">
                    browse by semester
                  </Link>
                  .
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
