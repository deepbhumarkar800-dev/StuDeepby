"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Field } from "./Field";
import { Turnstile } from "./Turnstile";
import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const onToken = useCallback((t: string) => setToken(t), []);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address.";
    if (message.trim().length < 10) e.message = "Write at least 10 characters so we can help.";
    if (siteConfig.turnstileSiteKey && !token) e.captcha = "Please complete the security check.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstileToken: token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not send.");
      toast("Message sent. Thank you!", "success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not send.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Your name" name="name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
      <Field label="Message" name="message" value={message} onChange={setMessage} error={errors.message} multiline />
      <Turnstile onToken={onToken} />
      {errors.captcha && <p role="alert" className="text-sm font-medium text-[#9b3b2f]">{errors.captcha}</p>}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={sending}>
        <Send className="h-4 w-4" aria-hidden />
        {sending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
