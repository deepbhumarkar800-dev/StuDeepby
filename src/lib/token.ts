import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

interface Payload {
  r: string; // resource id
  iat: number; // issued at (ms)
}

function secret(): string {
  const s = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!s || s.length < 24) throw new Error("DOWNLOAD_TOKEN_SECRET is missing or too short");
  return s;
}

const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function createToken(resourceId: string): string {
  const body = Buffer.from(JSON.stringify({ r: resourceId, iat: Date.now() } satisfies Payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    return typeof p.r === "string" && typeof p.iat === "number" ? p : null;
  } catch {
    return null;
  }
}
