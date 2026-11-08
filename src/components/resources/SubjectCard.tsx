import Link from "next/link";
import { ArrowUpRight, BookOpenText, FileQuestion, PlayCircle } from "lucide-react";
import { Leaf } from "@/components/brand/Botanicals";
import { SampleBadge } from "@/components/ui/Badge";
import { subjectHref } from "@/lib/repo";
import type { Subject } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones = ["from-forest to-botanical", "from-botanical to-emerald", "from-forest to-emerald", "from-emerald to-sage"];

export function SubjectCard({ subject, index = 0, className }: { subject: Subject; index?: number; className?: string }) {
  const counts = subject.counts;
  return (
    <Link
      href={subjectHref(subject)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-ivory shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("relative h-28 bg-gradient-to-br text-ivory", tones[index % 4])}>
        <Leaf tone="mint" className="absolute -bottom-4 right-2 h-20 w-28 rotate-[-10deg] opacity-45 transition-transform duration-500 group-hover:rotate-[-2deg]" />
        <Leaf tone="sage" className="absolute -left-4 -top-4 h-14 w-20 rotate-[165deg] opacity-45" />
        <span className="absolute left-4 top-4 rounded-full bg-ivory px-3 py-1 text-xs font-bold text-forest">Semester {subject.semester}</span>
        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-forest transition group-hover:bg-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-bold leading-snug text-forest">{subject.name}</h3>
          {subject.isSample && <SampleBadge />}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium text-ink/75">
          <li className="flex items-center gap-1.5">
            <BookOpenText className="h-4 w-4 text-botanical" aria-hidden />
            {counts.notes} notes
          </li>
          <li className="flex items-center gap-1.5">
            <PlayCircle className="h-4 w-4 text-botanical" aria-hidden />
            {counts.videos} videos
          </li>
          <li className="flex items-center gap-1.5">
            <FileQuestion className="h-4 w-4 text-botanical" aria-hidden />
            {counts.pyqs} PYQs
          </li>
        </ul>
      </div>
    </Link>
  );
}
