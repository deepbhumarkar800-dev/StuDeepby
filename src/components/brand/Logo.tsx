import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-10 w-10", className)} aria-hidden>
      <rect width="64" height="64" rx="19" fill="#174D3C" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="17.5" fill="none" stroke="#B9D6BD" strokeOpacity=".45" />
      <path d="M32 51V31" stroke="#B9D6BD" strokeWidth="4" strokeLinecap="round" />
      <path d="M32 33C32 22 24 16 13 17c0 11 8 17 19 16Z" fill="#78977C" />
      <path d="M32 29c0-9 7-15 19-14 0 10-8 16-19 14Z" fill="#E4F1E4" />
      <path d="M20 51h24" stroke="#B9D6BD" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="StuDeepby home">
      <LogoMark />
      <span className={cn("font-heading text-[1.35rem] font-extrabold tracking-tight", light ? "text-ivory" : "text-forest")}>
        StuDeepby
      </span>
    </Link>
  );
}
