/**
 * Non-production dev allowlists. Unset or empty these env vars to restore normal checks.
 *
 * - `DEV_ADMIN_EMAILS` — existing escape hatch (admin UI + simulation elevation).
 * - `DEV_BUILDER_FULL_ACCESS_EMAILS` — same privileges; use while building modules, then remove.
 */

export function parseCommaSeparatedEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/** Union of dev allowlists; empty in production or when both env vars are empty. */
export function mergedDevAccessEmails(): string[] {
  if (process.env.NODE_ENV === "production") return []
  return [
    ...new Set([
      ...parseCommaSeparatedEmails(process.env.DEV_ADMIN_EMAILS),
      ...parseCommaSeparatedEmails(process.env.DEV_BUILDER_FULL_ACCESS_EMAILS),
    ]),
  ]
}
