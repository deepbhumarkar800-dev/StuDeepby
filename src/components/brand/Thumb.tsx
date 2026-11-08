/* eslint-disable @next/next/no-img-element */
import { BookOpenText, FileQuestion, Play } from "lucide-react";
import { Leaf } from "./Botanicals";
import { cn } from "@/lib/utils";
import type { ResourceKind } from "@/lib/types";

const gradients = [
  "from-forest via-botanical to-emerald",
  "from-botanical via-emerald to-sage",
  "from-forest via-emerald to-sage",
  "from-botanical via-forest to-emerald",
];

export function Thumb({ hue, kind, className, imageUrl }: { hue: number; kind: ResourceKind; className?: string; imageUrl?: string | null }) {
  const Icon = kind === "video" ? Play : kind === "pyq" ? FileQuestion : BookOpenText;
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br text-ivory", gradients[hue % 4], className)} aria-hidden>
      {imageUrl ? (
        <img src={imageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <Leaf tone="mint" className="absolute -bottom-3 -right-4 h-20 w-28 rotate-[-12deg] opacity-40" />
          <Leaf tone="sage" className="absolute -left-5 -top-3 h-14 w-20 rotate-[160deg] opacity-40" />
        </>
      )}
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ivory/90 text-forest shadow-soft">
          <Icon className="h-5 w-5" fill={kind === "video" ? "currentColor" : "none"} />
        </span>
      </div>
    </div>
  );
}
