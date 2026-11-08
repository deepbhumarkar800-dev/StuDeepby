"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/forms/Field";
import { Turnstile } from "@/components/forms/Turnstile";
import { siteConfig } from "@/lib/site";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const onToken = useCallback((t: string) => setToken(t), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (siteConfig.turnstileSiteKey && !token) {
      setError("Please complete the security check.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken: token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Email" name="email" type="email" value={email} onChange={setEmail} autoComplete="username" />
      <Field label="Password" name="password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
      <Turnstile onToken={onToken} />
      {error && (
        <p role="alert" className="text-sm font-medium text-[#9b3b2f]">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={busy || !email || !password}>
        {busy ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
