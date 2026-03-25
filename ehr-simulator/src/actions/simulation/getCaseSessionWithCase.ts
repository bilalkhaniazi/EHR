"use server"

import { createServerSupabase } from "@/utils/supabase/server"
import { createServiceSupabase } from "@/utils/supabase/service"
import { verifySimulationSessionAccess } from "@/actions/simulation/verifySimulationSessionAccess"

export type CaseSessionWithCase = {
  caseId: string
}

/**
 * Resolves `sessionId` → canonical `cases.id` only when the current user is authorized
 * for that `case_sessions` row (see `verifySimulationSessionAccess`).
 */
export async function getCaseSessionWithCase(
  sessionId: string
): Promise<CaseSessionWithCase | null> {
  if (!sessionId) return null

  const userClient = await createServerSupabase()
  const {
    data: { user },
  } = await userClient.auth.getUser()
  if (!user?.id) return null

  const admin = createServiceSupabase()
  const resolved = await verifySimulationSessionAccess(
    admin,
    user.id,
    sessionId,
    user.email
  )
  if (!resolved) return null

  return { caseId: resolved.caseId }
}
