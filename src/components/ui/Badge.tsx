import { cn } from "@/lib/utils";

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border border-dashed border-sage bg-cream px-2 py-0.5 text-[11px] font-semibold text-forest", className)}>
      Sample
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-forest", className)}>
      {children}
    </span>
  );
}
