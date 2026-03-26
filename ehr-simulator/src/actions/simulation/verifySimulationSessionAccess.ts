import type { SupabaseClient } from "@supabase/supabase-js"
import { mergedDevAccessEmails } from "@/lib/devAccess"

export type ResolvedSimulationSession = {
  caseId: string
  groupId: string | null
  sectionAssignmentId: string | null
}

async function resolveCanonicalCaseId(
  admin: SupabaseClient,
  session: {
    case_id: string | null
    section_assignment_id: string | null
  }
): Promise<string | null> {
  if (session.case_id) {
    const { data } = await admin
      .from("cases")
      .select("id")
      .eq("id", session.case_id)
      .maybeSingle()
    if (data?.id) return data.id
  }

  if (session.section_assignment_id) {
    const { data: sa } = await admin
      .from("section_assignments")
      .select("case_id")
      .eq("id", session.section_assignment_id)
      .maybeSingle()

    if (sa?.case_id) {
      const { data } = await admin
        .from("cases")
        .select("id")
        .eq("id", sa.case_id)
        .maybeSingle()
      if (data?.id) return data.id
    }
  }

  return null
}

/**
 * Resolves `cases.id` for a session. When `allowDevBypass` is true (dev allowlist / admin),
 * falls back to raw FKs or any seeded case so broken rows still load while building.
 */
async function resolveAuthorizedCaseId(
  admin: SupabaseClient,
  session: {
    case_id: string | null
    section_assignment_id: string | null
  },
  allowDevBypass: boolean
): Promise<string | null> {
  const canonical = await resolveCanonicalCaseId(admin, session)
  if (canonical) return canonical
  if (!allowDevBypass) return null

  if (session.case_id) return session.case_id

  if (session.section_assignment_id) {
    const { data: sa } = await admin
      .from("section_assignments")
      .select("case_id")
      .eq("id", session.section_assignment_id)
      .maybeSingle()
    if (sa?.case_id) return sa.case_id
  }

  const { data: anyCase } = await admin
    .from("cases")
    .select("id")
    .limit(1)
    .maybeSingle()
  return anyCase?.id ?? null
}

export async function isElevatedSimulationUser(
  admin: SupabaseClient,
  userId: string,
  userEmail: string | null | undefined
): Promise<boolean> {
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (profile?.role === "admin") return true

  if (process.env.NODE_ENV !== "production" && userEmail) {
    const allowed = mergedDevAccessEmails()
    const normalized = userEmail.trim().toLowerCase()
    if (allowed.length > 0 && allowed.includes(normalized)) {
      return true
    }
  }

  return false
}

/**
 * Returns canonical `cases.id` for the session when the user is allowed to access it.
 *
 * Allowed when ANY of:
 * - Active group member: `group_members` row for `case_sessions.group_id` and `student_id = userId`
 *   (`active` true or null).
 * - Faculty of section: `case_sessions.section_assignment_id` → `section_assignments.section_id`
 *   matches `faculty_section` for `faculty_id = userId`.
 * - Admin (`public.users.role = 'admin'`) or, in non-production, email in `DEV_ADMIN_EMAILS` or
 *   `DEV_BUILDER_FULL_ACCESS_EMAILS` (see `src/lib/devAccess.ts`).
 *
 * `caseId` is taken from `case_sessions.case_id` when it references `cases`, otherwise from
 * `section_assignments.case_id` for this session's assignment (when that references `cases`).
 */
export async function verifySimulationSessionAccess(
  admin: SupabaseClient,
  userId: string,
  sessionId: string,
  userEmail?: string | null
): Promise<ResolvedSimulationSession | null> {
  if (!sessionId || !userId) return null

  const { data: session, error: sessionErr } = await admin
    .from("case_sessions")
    .select("case_id, group_id, section_assignment_id")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionErr || !session) return null

  const elevated = await isElevatedSimulationUser(admin, userId, userEmail)

  const caseId = await resolveAuthorizedCaseId(admin, session, elevated)
  if (!caseId) return null

  if (elevated) {
    return {
      caseId,
      groupId: session.group_id ?? null,
      sectionAssignmentId: session.section_assignment_id ?? null,
    }
  }

  if (session.group_id) {
    const { data: membership, error: gmErr } = await admin
      .from("group_members")
      .select("id, active")
      .eq("group_id", session.group_id)
      .eq("student_id", userId)
      .limit(1)
      .maybeSingle()

    if (!gmErr && membership && membership.active !== false) {
      return {
        caseId,
        groupId: session.group_id,
        sectionAssignmentId: session.section_assignment_id ?? null,
      }
    }
  }

  if (session.section_assignment_id) {
    const { data: sa, error: saErr } = await admin
      .from("section_assignments")
      .select("section_id")
      .eq("id", session.section_assignment_id)
      .maybeSingle()

    if (!saErr && sa?.section_id) {
      const { data: facultyLink, error: fsErr } = await admin
        .from("faculty_section")
        .select("id, active")
        .eq("section_id", sa.section_id)
        .eq("faculty_id", userId)
        .limit(1)
        .maybeSingle()

      if (!fsErr && facultyLink && facultyLink.active !== false) {
        return {
          caseId,
          groupId: session.group_id ?? null,
          sectionAssignmentId: session.section_assignment_id,
        }
      }
    }
  }

  return null
}
