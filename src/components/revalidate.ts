/** Tells the server to refresh public pages after the admin changes something. */
export async function refreshPublicSite() {
  try {
    await fetch("/api/revalidate", { method: "POST" });
  } catch {
    /* public pages also refresh on their own within a minute */
  }
}
