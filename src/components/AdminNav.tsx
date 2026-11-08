"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Inbox, LayoutDashboard, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/subjects", label: "Subjects", icon: Library },
  { href: "/admin/resources", label: "Files", icon: FolderOpen },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="grid grid-cols-4 gap-1.5 rounded-[1.75rem] border border-line bg-ivory p-1.5 shadow-soft">
      {items.map((i) => {
        const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[1.35rem] px-1 font-heading text-[12px] font-semibold transition sm:flex-row sm:gap-2 sm:text-sm",
              active ? "bg-forest text-ivory" : "text-forest hover:bg-palemint",
            )}
          >
            <i.icon className="h-4 w-4" aria-hidden />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
