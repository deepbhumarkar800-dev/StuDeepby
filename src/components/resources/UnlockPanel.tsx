"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, Instagram, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

type Phase = "ask" | "waiting" | "finishing" | "done" | "error";

/**
 * "Follow to unlock" step. Opens Instagram, then a loading bar that only moves
 * while this page is visible. Instagram follows cannot be verified by a website,
 * so this is a friendly request, and the download unlocks either way.
 */
export function UnlockPanel({ resourceId }: { resourceId: string }) {
  const wait = siteConfig.unlockSeconds;
  const [phase, setPhase] = useState<Phase>("ask");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const tokenRef = useRef<string | null>(null);

  async function start() {
    setPhase("waiting");
    setElapsed(0);
    setError("");
    // Open Instagram straight from the tap so the browser does not block it.
    window.open(siteConfig.instagramUrl, "_blank", "noopener,noreferrer");
    try {
      const res = await fetch("/api/download/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) throw new Error(data.error ?? "Something went wrong.");
      tokenRef.current = data.token;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  }

  // The bar only advances while the page is on screen (i.e. after coming back from Instagram).
  useEffect(() => {
    if (phase !== "waiting") return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible" && tokenRef.current) setElapsed((e) => e + 0.25);
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "waiting" && elapsed >= wait) void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, phase]);

  async function finish() {
    setPhase("finishing");
    try {
      const res = await fetch("/api/download/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenRef.current }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      setUrl(data.url);
      setPhase("done");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  }

  const pct = Math.min(100, Math.round((elapsed / wait) * 100));

  return (
    <div className="rounded-3xl border border-line bg-palemint p-5" aria-live="polite">
      {phase === "ask" && (
        <>
          <p className="font-heading font-bold text-forest">Follow to unlock this PDF</p>
          <p className="mt-1 text-sm text-ink/80">
            Please follow {siteConfig.instagramHandle} on Instagram to support StuDeepby. Tap the button, then come back to this page and your download unlocks in a few seconds.
          </p>
          <Button onClick={start} size="lg" className="mt-4 w-full sm:w-auto">
            <Instagram className="h-4 w-4" aria-hidden />
            Follow on Instagram
          </Button>
        </>
      )}

      {(phase === "waiting" || phase === "finishing") && (
        <>
          <p className="flex items-center gap-2 font-heading font-bold text-forest">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {phase === "finishing" ? "Preparing your PDF..." : "Unlocking your PDF..."}
          </p>
          <p className="mt-1 text-sm text-ink/80">
            {elapsed === 0 ? `Followed? Come back to this page and the bar will start moving.` : "Stay on this page for a moment."}
          </p>
          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-mint"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Unlocking"
          >
            <div className="h-full rounded-full bg-botanical transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        </>
      )}

      {phase === "done" && (
        <>
          <p className="flex items-center gap-2 font-heading font-bold text-forest">
            <CheckCircle2 className="h-5 w-5 text-botanical" aria-hidden />
            Unlocked. Your download is starting.
          </p>
          <p className="mt-1 text-sm text-ink/80">Thank you for following! If nothing happens, use the button below. The link works for one minute.</p>
          <a
            href={url}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-botanical px-6 font-heading text-[15px] font-semibold text-ivory transition hover:bg-forest"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
        </>
      )}

      {phase === "error" && (
        <>
          <p className="flex items-center gap-2 font-heading font-bold text-forest">
            <TriangleAlert className="h-5 w-5" aria-hidden />
            Could not unlock
          </p>
          <p role="alert" className="mt-1 text-sm text-ink/80">{error}</p>
          <Button onClick={() => setPhase("ask")} variant="secondary" className="mt-4">
            Try again
          </Button>
        </>
      )}
    </div>
  );
}
