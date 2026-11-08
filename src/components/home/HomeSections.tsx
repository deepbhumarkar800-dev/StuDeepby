import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  FileQuestion,
  Instagram,
  Layers,
  PlayCircle,
  ShieldCheck,
  Sprout,
  Download,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SampleBadge } from "@/components/ui/Badge";
import { Flower, Leaf, Sprig } from "@/components/brand/Botanicals";
import { SubjectCard } from "@/components/resources/SubjectCard";
import { ResourceLink } from "@/components/resources/ResourceCard";
import { getAllSubjects, getPopularSubjects, getRecentResources, semesterNumbers } from "@/lib/repo";
import { siteConfig } from "@/lib/site";

function SectionTitle({ title, children, id }: { title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h2 id={id} className="font-display text-2xl font-bold leading-tight text-forest sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-[15px] leading-relaxed text-ink/80 sm:text-base">{children}</p>}
    </div>
  );
}

/* ---------- BCA showcase: the real navigation path, so numbering is meaningful ---------- */
export async function CourseShowcase() {
  const subjects = await getAllSubjects();
  const path = ["Course", "University", "Semester", "Subject", "Resources"];
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="course-title">
      <SectionTitle id="course-title" title="Start with your semester">
        BCA is live first, at Sant Gadge Baba Amravati University. More courses and universities can be added later.
      </SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <div className="panel on-dark relative h-full rounded-[2rem] p-6 sm:p-9">
            <Leaf tone="emerald" className="pointer-events-none absolute -bottom-3 right-4 h-20 w-32 rotate-[-8deg] opacity-35" />
            <div className="relative z-10">
              <p className="font-heading text-sm font-semibold text-mint">SGBAU</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-silver sm:text-[2rem]">BCA, Bachelor of Computer Applications</h3>
              <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                {semesterNumbers.map((n) => {
                  const count = subjects.filter((s) => s.semester === n).length;
                  return (
                    <Link
                      key={n}
                      href={`/courses/bca/sgbau/${n}`}
                      className="group flex min-h-[84px] flex-col justify-between rounded-2xl border border-ivory/30 bg-ivory/10 p-3 transition hover:-translate-y-0.5 hover:bg-ivory hover:text-forest sm:p-4"
                    >
                      <span className="font-heading text-sm font-bold">Semester {n}</span>
                      <span className="text-xs opacity-85">{count === 0 ? "Coming soon" : `${count} subjects`}</span>
                    </Link>
                  );
                })}
              </div>
              <ButtonLink href="/courses/bca/sgbau" variant="light" className="mt-6">
                See all semesters
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass h-full rounded-[2rem] p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-forest">How to find anything</h3>
            <ol className="relative mt-5 space-y-4 border-l-2 border-dashed border-sage/70 pl-6">
              {path.map((step, i) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[2.15rem] grid h-7 w-7 place-items-center rounded-full bg-forest font-heading text-xs font-bold text-ivory">{i + 1}</span>
                  <span className="font-heading text-[15px] font-semibold text-forest">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-ink/75">Or skip the steps and use the subject search above.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Why StuDeepby ---------- */
export function WhyUs() {
  const points = [
    { icon: Layers, title: "Everything in one place", text: "Notes, videos and past papers for a subject sit side by side." },
    { icon: Download, title: "Free to download", text: "No account and no payment. Just follow on Instagram to unlock a PDF." },
    { icon: ShieldCheck, title: "Safe and simple", text: "Files are stored privately and handed out through short-lived download links." },
  ];
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="why-title">
      <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-line bg-palemint p-7 sm:p-10">
            <Sprig className="pointer-events-none absolute -right-4 bottom-0 h-56 opacity-80" />
            <h2 id="why-title" className="relative font-display text-2xl font-bold leading-tight text-forest sm:text-3xl">
              Built around how BCA students actually study
            </h2>
            <p className="relative mt-4 max-w-sm text-[15px] leading-relaxed text-ink/80">
              Short on time before exams? Start from your semester, pick the subject, and go straight to the unit you need.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-[1.75rem] border border-line bg-ivory p-5 shadow-soft sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-mint">
                  <p.icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-heading text-[17px] font-bold text-forest">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Notes / Videos / PYQs: layered panels echoing the reference ---------- */
export function FeaturePanels() {
  const items = [
    {
      icon: BookOpenText,
      title: "Notes",
      lines: ["Unit-wise, short and detailed notes", "Handwritten notes and important questions", "Download as PDF"],
      cta: "Browse notes",
      tab: "notes",
      offset: "",
    },
    {
      icon: PlayCircle,
      title: "Videos",
      lines: ["Topic-wise easy understanding lessons", "Watch the exact topic you are stuck on", "Related notes beside each lesson"],
      cta: "Watch lessons",
      tab: "videos",
      offset: "lg:mt-10",
    },
    {
      icon: FileQuestion,
      title: "PYQs",
      lines: ["Previous year question papers", "Solved papers and unit-wise questions", "Most repeated questions"],
      cta: "Practise papers",
      tab: "pyqs",
      offset: "lg:mt-20",
    },
  ];
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="features-title">
      <SectionTitle id="features-title" title="Three ways to study each subject">
        Every subject has the same three sections, so you always know where to look.
      </SectionTitle>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1} className={f.offset}>
            <article className="panel on-dark h-full rounded-[2rem] p-6 sm:p-7">
              <div className="relative z-10 flex h-full flex-col">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-mint ring-4 ring-ivory/25">
                  <f.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-silver">{f.title}</h3>
                <ul className="mt-4 flex-1 space-y-2.5 text-[15px] text-ivory/95">
                  {f.lines.map((l) => (
                    <li key={l} className="flex gap-2.5">
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden />
                      {l}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/courses/bca/sgbau" variant="outlineLight" size="sm" className="mt-6 self-start">
                  {f.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Popular subjects ---------- */
export async function PopularSubjects() {
  const popular = await getPopularSubjects(6);
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="popular-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle id="popular-title" title="Popular subjects" />
        <Link href="/courses/bca/sgbau" className="mb-8 rounded-full px-3 py-2 font-heading text-sm font-semibold text-botanical underline-offset-4 hover:underline">
          All subjects
        </Link>
      </div>
      <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {popular.map((s, i) => (
          <li key={s.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <SubjectCard subject={s} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Recent + Free resource lists ---------- */
export async function RecentResources() {
  const recent = await getRecentResources(6);
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="recent-title">
      <SectionTitle id="recent-title" title="Recently added">
        The newest notes, lessons and papers.
      </SectionTitle>
      <ul className="grid gap-3 md:grid-cols-2">
        {recent.map((r) => (
          <li key={r.id}>
            <ResourceLink resource={r} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Testimonials (clearly sample) ---------- */
export function Testimonials() {
  const quotes = [
    { text: "Finding the right unit used to take me half an hour. Now it takes a minute.", who: "Sample student, Semester 2" },
    { text: "The videos explain the topic in plain words, and the notes sit right next to them.", who: "Sample student, Semester 4" },
    { text: "Past papers organised by year helped me see which questions keep repeating.", who: "Sample student, Semester 6" },
  ];
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="voices-title">
      <SectionTitle id="voices-title" title="What students will say">
        These are sample quotes that show the layout. They will be replaced with real student feedback.
      </SectionTitle>
      <ul className="grid gap-4 md:grid-cols-3">
        {quotes.map((q, i) => (
          <li key={q.who} className={i === 1 ? "md:-mt-4" : ""}>
            <figure className="flex h-full flex-col justify-between rounded-[1.75rem] border border-line bg-ivory p-6 shadow-soft">
              <blockquote className="font-heading text-[15px] font-medium leading-relaxed text-forest">&ldquo;{q.text}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center justify-between gap-2 text-sm text-ink/75">
                {q.who}
                <SampleBadge />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Closing call to action ---------- */
export function CtaBand() {
  return (
    <section className="container-x mt-20 sm:mt-28" aria-labelledby="cta-title">
      <div className="panel on-dark relative rounded-[2.25rem] px-6 py-10 sm:px-12 sm:py-14">
        <Flower className="pointer-events-none absolute -right-6 -top-10 h-36 w-36 rotate-[20deg] sm:h-48 sm:w-48" />
        <div className="relative z-10 max-w-xl">
          <h2 id="cta-title" className="font-display text-2xl font-bold leading-tight text-silver sm:text-4xl">
            Pick your semester. Start studying.
          </h2>
          <p className="mt-3 text-[15px] text-ivory/90 sm:text-base">Everything is free to download. A follow on Instagram helps StuDeepby grow.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/courses" variant="light" size="lg">
              Browse courses
            </ButtonLink>
            <ButtonLink href={siteConfig.instagramUrl} external variant="outlineLight" size="lg">
              <Instagram className="h-4 w-4" aria-hidden />
              Follow {siteConfig.instagramHandle}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
