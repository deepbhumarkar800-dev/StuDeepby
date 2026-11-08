"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass flex items-center justify-between rounded-full py-2 pl-3 pr-2 shadow-soft sm:pl-4">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 font-heading text-sm font-semibold transition",
                  isActive(l.href) ? "bg-forest text-ivory" : "text-forest hover:bg-palemint",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-botanical px-5 py-2.5 font-heading text-sm font-semibold text-ivory ring-1 ring-emerald/60 transition hover:bg-forest active:scale-[0.97]"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Follow {siteConfig.instagramHandle}
            </a>
          </div>

          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-forest text-ivory md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="panel on-dark mt-2 rounded-[1.75rem] p-3 md:hidden"
            >
              <ul className="relative z-10 space-y-1">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={cn(
                        "flex min-h-[48px] items-center rounded-2xl px-4 font-heading text-base font-semibold",
                        isActive(l.href) ? "bg-ivory text-forest" : "hover:bg-white/10",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ivory font-heading text-sm font-semibold text-forest"
                  >
                    <Instagram className="h-4 w-4" aria-hidden />
                    Follow {siteConfig.instagramHandle}
                  </a>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
