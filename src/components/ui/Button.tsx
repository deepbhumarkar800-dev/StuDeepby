import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outlineLight";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold transition duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-botanical text-ivory shadow-soft ring-1 ring-emerald/60 hover:bg-forest hover:shadow-lift",
  secondary: "border border-botanical/40 bg-ivory text-forest hover:bg-palemint",
  ghost: "text-forest hover:bg-palemint",
  light: "bg-ivory text-forest hover:bg-white",
  outlineLight: "border border-ivory/70 text-ivory hover:bg-ivory/15",
};

const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-4 text-sm",
  md: "min-h-[48px] px-6 text-[15px]",
  lg: "min-h-[54px] px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
