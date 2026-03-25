"use server"

import { createServerSupabase } from "@/utils/supabase/server"
import { createServiceSupabase } from "@/utils/supabase/service"
import { isElevatedSimulationUser } from "@/actions/simulation/verifySimulationSessionAccess"

export type SimulationSessionListItem = { id: string }

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
    return [...sessionIdSet].map((id) => ({ id }))
  }

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

  return [...sessionIdSet].map((id) => ({ id }))
}
