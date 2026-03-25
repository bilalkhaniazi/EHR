import Link from "next/link"
import { Button } from "@/components/ui/button"
import { listMySimulationSessions } from "@/actions/simulation/listMySimulationSessions"

export default async function StartSimulationPage() {
  const sessions = await listMySimulationSessions()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-lime-100">
      <h1 className="text-4xl font-bold">
        Flex<span className="font-normal">Chart</span>
      </h1>
      {sessions.length === 0 ? (
        <p className="max-w-md text-center text-neutral-700">
          No simulation sessions are available for your account. Join a course group or contact your instructor.
        </p>
      ) : (
        <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-4">
          {sessions.map((s) => (
            <li key={s.id}>
              <Button asChild variant="default" className="w-full min-w-[280px]">
                <Link href={`/simulation/${s.id}/chart/overview`}>
                  Open simulation session
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
