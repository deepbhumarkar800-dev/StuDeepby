export const siteConfig = {
  name: "StuDeepby",
  tagline: "Learn Deep. Score Better.",
  description:
    "StuDeepby is an independent study platform for BCA students: unit-wise notes, easy understanding videos and previous year questions, organised by semester and subject.",
  creator: "Deep Bhumarkar",
  instagramHandle: "@yus.deep",
  instagramUrl: "https://www.instagram.com/yus.deep/",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  unlockSeconds: Math.min(60, Math.max(5, Number(process.env.NEXT_PUBLIC_UNLOCK_SECONDS ?? 10) || 10)),
  hasSupabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
