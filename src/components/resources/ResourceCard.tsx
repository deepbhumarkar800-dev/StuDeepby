import Link from "next/link";
import { BookOpenText, Download, FileQuestion, FileText, PlayCircle } from "lucide-react";
import { Thumb } from "@/components/brand/Thumb";
import { getYoutubeId, youtubeThumbUrl } from "@/lib/youtube";
import type { Resource, ResourceWithSubject } from "@/lib/types";

function meta(r: Resource): string {
  const parts: string[] = [r.category];
  if (r.pages) parts.push(`${r.pages} pages`);
  return parts.join(", ");
}

function thumbOf(r: Resource) {
  const id = getYoutubeId(r.youtubeUrl);
  return id ? youtubeThumbUrl(id) : null;
}

/** Card used inside the subject explorer. Opens the detail window. */
export function ResourceCard({ resource, onOpen }: { resource: Resource; onOpen: (r: Resource) => void }) {
  if (resource.kind === "video") {
    return (
      <button
        onClick={() => onOpen(resource)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-ivory text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
      >
        <Thumb hue={resource.hue} kind="video" className="aspect-video w-full" imageUrl={thumbOf(resource)} />
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-heading text-[15px] font-bold leading-snug text-forest">{resource.title}</h3>
          <p className="text-[13px] text-ink/75">{resource.category}</p>
        </div>
      </button>
    );
  }
  const Icon = resource.kind === "pyq" ? FileQuestion : BookOpenText;
  return (
    <button
      onClick={() => onOpen(resource)}
      className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-line bg-ivory p-4 text-left shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-forest to-botanical text-ivory">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[15px] font-bold text-forest">{resource.title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink/75">
          <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{meta(resource)}</span>
        </span>
      </span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-forest">
        <Download className="h-4 w-4" aria-hidden />
      </span>
    </button>
  );
}

/** Compact row used on the homepage list. Links to the subject page and opens the resource there. */
export function ResourceLink({ resource }: { resource: ResourceWithSubject }) {
  const Icon = resource.kind === "video" ? PlayCircle : resource.kind === "pyq" ? FileQuestion : BookOpenText;
  const label = resource.kind === "video" ? "Video" : resource.kind === "pyq" ? "PYQ" : "Notes";
  return (
    <Link
      href={resource.href}
      className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-ivory p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <Thumb hue={resource.hue} kind={resource.kind} className="h-14 w-14 shrink-0 rounded-2xl [&>div>span]:h-8 [&>div>span]:w-8 [&_svg]:h-4 [&_svg]:w-4" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[15px] font-bold text-forest">{resource.title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink/75">
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {label} for {resource.subject.name}
          </span>
        </span>
      </span>
    </Link>
  );
}
