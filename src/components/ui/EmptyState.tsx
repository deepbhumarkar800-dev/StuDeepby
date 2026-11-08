import { Sprout } from "lucide-react";

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-sage/70 bg-ivory/80 px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-mint text-forest">
        <Sprout className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="font-heading text-lg font-bold text-forest">{title}</h3>
      {children && <p className="mx-auto mt-2 max-w-md text-[15px] text-ink/75">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
