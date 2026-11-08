/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenText, ExternalLink, FileQuestion, Play } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { Thumb } from "@/components/brand/Thumb";
import { UnlockPanel } from "./UnlockPanel";
import { getYoutubeId, youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";
import type { Resource } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  resource: Resource | null;
  subjectName: string;
  allResources: Resource[];
  onClose: () => void;
  onOpen: (r: Resource) => void;
}

export function ResourceModal({ resource, subjectName, allResources, onClose, onOpen }: Props) {
  return (
    <Modal open={!!resource} onClose={onClose} title={resource?.title ?? "Resource"}>
      {resource && <Body key={resource.id} resource={resource} subjectName={subjectName} allResources={allResources} onOpen={onOpen} />}
    </Modal>
  );
}

function Body({ resource, subjectName, allResources, onOpen }: Omit<Props, "onClose" | "resource"> & { resource: Resource }) {
  const [playing, setPlaying] = useState(false);
  const isVideo = resource.kind === "video";
  const ytId = getYoutubeId(resource.youtubeUrl);

  const related = isVideo
    ? allResources.filter((r) => r.kind === "notes" && r.unit !== undefined && r.unit === resource.unit).slice(0, 3)
    : [];

  return (
    <div>
      {isVideo ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-[2rem] bg-forest">
          {ytId && playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`${youtubeEmbedUrl(ytId)}&autoplay=1`}
              title={resource.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <>
              <Thumb hue={resource.hue} kind="video" className="absolute inset-0 [&>div>span]:hidden" imageUrl={ytId ? youtubeThumbUrl(ytId) : null} />
              <div className="absolute inset-0 grid place-items-center bg-forest/25">
                {ytId ? (
                  <button
                    onClick={() => setPlaying(true)}
                    aria-label="Play video"
                    className="grid h-16 w-16 place-items-center rounded-full bg-ivory text-forest shadow-lift transition hover:scale-105 active:scale-95"
                  >
                    <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
                  </button>
                ) : (
                  <span className="rounded-full bg-forest px-4 py-2 font-heading text-sm font-semibold text-ivory">Video link coming soon</span>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="panel on-dark rounded-t-[2rem] px-6 pb-6 pt-8">
          <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-ivory text-forest">
            {resource.kind === "pyq" ? <FileQuestion className="h-7 w-7" aria-hidden /> : <BookOpenText className="h-7 w-7" aria-hidden />}
          </span>
        </div>
      )}

      <div className="space-y-5 p-6 sm:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{resource.category}</Pill>
            {resource.isSample && <Pill className="border-dashed border-sage bg-cream">Sample content</Pill>}
          </div>
          <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-forest">{resource.title}</h2>
          <p className="mt-1 text-sm font-medium text-botanical">{subjectName}</p>
          {resource.description && <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{resource.description}</p>}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {resource.unit && <Detail label="Unit" value={String(resource.unit)} />}
          {resource.year && <Detail label="Exam year" value={String(resource.year)} />}
          {resource.pages && <Detail label="Pages" value={String(resource.pages)} />}
          {!isVideo && <Detail label="Downloads" value={String(resource.downloads)} />}
          <Detail label="Added" value={formatDate(resource.addedAt)} />
        </dl>

        {isVideo ? (
          ytId && (
            <ButtonLink href={`https://www.youtube.com/watch?v=${ytId}`} external variant="secondary">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Open on YouTube
            </ButtonLink>
          )
        ) : (
          <UnlockPanel resourceId={resource.id} />
        )}

        {related.length > 0 && (
          <div>
            <h3 className="font-heading text-sm font-bold text-forest">Related notes</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => onOpen(r)}
                    className="min-h-[44px] rounded-full border border-line bg-ivory px-4 text-sm font-semibold text-forest transition hover:bg-palemint"
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-ink/65">
          Problem with this resource?{" "}
          <Link href="/contact" className="font-semibold text-botanical underline">
            Tell us
          </Link>
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-cream/60 px-3 py-2.5">
      <dt className="text-xs font-medium text-ink/65">{label}</dt>
      <dd className="font-heading font-bold text-forest">{value}</dd>
    </div>
  );
}
