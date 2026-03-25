import { redirect } from "next/navigation"

export default async function PresimRedirectPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  redirect(`/simulation/${sessionId}/chart/overview`)
}
