import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;
  const btn = "grid h-11 min-w-[44px] place-items-center rounded-full border border-line bg-ivory px-3 text-sm font-semibold text-forest transition hover:bg-palemint disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button className={btn} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(btn, n === page && "border-botanical bg-botanical text-ivory hover:bg-botanical")}
        >
          {n}
        </button>
      ))}
      <button className={btn} onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
