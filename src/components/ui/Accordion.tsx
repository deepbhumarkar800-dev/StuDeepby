"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-2xl border border-line bg-ivory">
            <h3>
              <button
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left font-heading text-[15px] font-semibold text-forest"
                aria-expanded={isOpen}
                aria-controls={`acc-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink/80">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
