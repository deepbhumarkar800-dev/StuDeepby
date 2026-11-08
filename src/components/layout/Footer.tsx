import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Leaf } from "@/components/brand/Botanicals";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/courses", label: "Courses" },
      { href: "/courses/bca", label: "BCA" },
      { href: "/courses/bca/sgbau", label: "SGBAU semesters" },
    ],
  },
  {
    title: "StuDeepby",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/copyright", label: "Copyright" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 px-3 pb-3 sm:px-6">
      <div className="panel on-dark relative mx-auto max-w-6xl overflow-hidden rounded-[2rem]">
        <Leaf tone="emerald" className="pointer-events-none absolute -right-8 -top-6 h-32 w-48 rotate-[15deg] opacity-40" />
        <div className="relative z-10 grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-4 font-display text-lg leading-snug text-mint">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/85">
              StuDeepby is an independent educational platform. It is not an official website of any university.
            </p>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ivory px-5 font-heading text-sm font-semibold text-forest transition hover:bg-white"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              {siteConfig.instagramHandle}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="font-heading text-sm font-bold text-mint">{c.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-ivory/90 underline-offset-4 hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-2 border-t border-ivory/20 px-6 py-4 text-xs text-ivory/80 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} StuDeepby. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-2">
            Created by {siteConfig.creator}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-ivory underline underline-offset-4"
            >
              <Instagram className="h-3.5 w-3.5" aria-hidden />
              {siteConfig.instagramHandle}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
