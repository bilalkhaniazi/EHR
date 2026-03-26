"use server"

import { createServerSupabase } from "@/utils/supabase/server"
import { createServiceSupabase } from "@/utils/supabase/service"
import { isElevatedSimulationUser } from "@/actions/simulation/verifySimulationSessionAccess"

export type SimulationSessionListItem = {
  id: string
  title: string
  subtitle: string
}

type CourseEmbed = { code: string | null } | null
type SectionEmbed = {
  name: string | null
  courses: CourseEmbed | CourseEmbed[] | null
} | null
type GroupEmbed = {
  name: string | null
  sections: SectionEmbed | SectionEmbed[] | null
} | null
type CaseEmbed = { name: string | null } | null
type SectionAssignmentEmbed = {
  sim_time: string | null
  sections: SectionEmbed | SectionEmbed[] | null
  cases: CaseEmbed | CaseEmbed[] | null
} | null

type CaseSessionEnrichedRow = {
  id: string
  groups: GroupEmbed | GroupEmbed[] | null
  section_assignments: SectionAssignmentEmbed | SectionAssignmentEmbed[] | null
  cases: CaseEmbed | CaseEmbed[] | null
}

function asOne<T>(x: T | T[] | null | undefined): T | null {
  if (x == null) return null
  return Array.isArray(x) ? (x[0] ?? null) : x
}

function caseNameFromEmbeds(row: CaseSessionEnrichedRow): string {
  const direct = asOne(row.cases)
  const fromSa = asOne(asOne(row.section_assignments)?.cases)
  return direct?.name ?? fromSa?.name ?? "Unknown case"
}

function buildSubtitle(row: CaseSessionEnrichedRow): { subtitle: string; sortKey: string } {
  const g = asOne(row.groups)
  const secG = asOne(g?.sections)
  const courseG = asOne(secG?.courses)

  const sa = asOne(row.section_assignments)
  const secA = asOne(sa?.sections)
  const courseA = asOne(secA?.courses)

  const courseCode = courseG?.code ?? courseA?.code ?? null
  const sectionName = secG?.name ?? secA?.name ?? null
  const groupName = g?.name ?? null

  const simTime = sa?.sim_time ?? null
  const simLabel = simTime
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(simTime))
    : null

  const contextParts = [courseCode, sectionName, groupName].filter(Boolean) as string[]
  let subtitle = contextParts.join(" · ")
  if (simLabel) {
    subtitle = subtitle ? `${subtitle} · ${simLabel}` : simLabel
  }
  if (!subtitle) subtitle = "Open chart"

  return { subtitle, sortKey: simTime ?? "\uffff" }
}

function rowToListItem(row: CaseSessionEnrichedRow): SimulationSessionListItem & {
  sortKey: string
} {
  const title = caseNameFromEmbeds(row)
  const { subtitle, sortKey } = buildSubtitle(row)
  return { id: row.id, title, subtitle, sortKey }
}

async function fetchEnrichedSessions(
  admin: ReturnType<typeof createServiceSupabase>,
  sessionIds: string[]
): Promise<SimulationSessionListItem[]> {
  if (sessionIds.length === 0) return []

  const { data, error } = await admin
    .from("case_sessions")
    .select(
      `
      id,
      groups (
        name,
        sections (
          name,
          courses ( code )
        )
      ),
      section_assignments (
        sim_time,
        sections (
          name,
          courses ( code )
        ),
        cases ( name )
      ),
      cases ( name )
    `
    )
    .in("id", sessionIds)

  if (error) {
    console.error("listMySimulationSessions enrich error:", error)
    return sessionIds.map((id) => ({
      id,
      title: "Simulation session",
      subtitle: `Session ${id.slice(0, 8)}…`,
    }))
  }

  const rows = (data ?? []) as CaseSessionEnrichedRow[]
  const byId = new Map(rows.map((r) => [r.id, r]))
  const items = sessionIds.map((id) => {
    const r = byId.get(id)
    return r
      ? rowToListItem(r)
      : {
          id,
          title: "Simulation session",
          subtitle: "Details unavailable",
          sortKey: "\uffff",
        }
  })

  items.sort((a, b) => {
    const t = a.sortKey.localeCompare(b.sortKey)
    if (t !== 0) return t
    const u = a.title.localeCompare(b.title)
    if (u !== 0) return u
    return a.subtitle.localeCompare(b.subtitle)
  })

  return items.map(({ id, title, subtitle }) => ({ id, title, subtitle }))
}

/**
 * `case_sessions.id` values the current user may open (student: group membership;
 * faculty: `faculty_section` for the assignment's section;
 * admin or dev allowlist: all sessions).
 */
export async function listMySimulationSessions(): Promise<
  SimulationSessionListItem[]
> {
  const userClient = await createServerSupabase()
  const {
    data: { user },
  } = await userClient.auth.getUser()
  if (!user?.id) return []

  const admin = createServiceSupabase()
  const userId = user.id
  const sessionIdSet = new Set<string>()

  if (await isElevatedSimulationUser(admin, userId, user.email)) {
    const { data: allSessions } = await admin.from("case_sessions").select("id")
    for (const row of allSessions ?? []) {
      if (row?.id) sessionIdSet.add(row.id)
    }
  } else {
    const { data: memberships } = await admin
      .from("group_members")
      .select("group_id, active")
      .eq("student_id", userId)

    const groupIds = [
      ...new Set(
        (memberships ?? [])
          .filter((m) => m.group_id && m.active !== false)
          .map((m) => m.group_id as string)
      ),
    ]

    if (groupIds.length > 0) {
      const { data: byGroup } = await admin
        .from("case_sessions")
        .select("id")
        .in("group_id", groupIds)

      for (const row of byGroup ?? []) {
        if (row?.id) sessionIdSet.add(row.id)
      }
    }

    const { data: facultyLinks } = await admin
      .from("faculty_section")
      .select("section_id, active")
      .eq("faculty_id", userId)

    const sectionIds = [
      ...new Set(
        (facultyLinks ?? [])
          .filter((f) => f.section_id && f.active !== false)
          .map((f) => f.section_id as string)
      ),
    ]

    if (sectionIds.length > 0) {
      const { data: assignments } = await admin
        .from("section_assignments")
        .select("id")
        .in("section_id", sectionIds)

      const assignmentIds = (assignments ?? [])
        .map((a) => a.id)
        .filter(Boolean) as string[]

      if (assignmentIds.length > 0) {
        const { data: byAssignment } = await admin
          .from("case_sessions")
          .select("id")
          .in("section_assignment_id", assignmentIds)

        for (const row of byAssignment ?? []) {
          if (row?.id) sessionIdSet.add(row.id)
        }
      }
    }
  }

  const ids = [...sessionIdSet]
  return fetchEnrichedSessions(admin, ids)
}
