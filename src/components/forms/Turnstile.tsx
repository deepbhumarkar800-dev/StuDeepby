"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Cloudflare Turnstile widget. The token must ALSO be checked on the server (done in the API routes). */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = siteConfig.turnstileSiteKey;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    function mount() {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    }

    if (window.turnstile) mount();
    else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-dashed border-sage bg-cream/70 px-4 py-3 text-sm text-ink/80">
        <ShieldCheck className="h-5 w-5 shrink-0 text-botanical" aria-hidden />
        CAPTCHA is not switched on (no Turnstile key set).
      </p>
    );
  }
  return <div ref={ref} className="min-h-[65px]" />;
}
