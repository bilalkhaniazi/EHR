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
        <ul className="flex max-h-[60vh] w-full max-w-lg flex-col gap-2 overflow-y-auto px-4">
          {sessions.map((s) => (
            <li key={s.id}>
              <Button
                asChild
                variant="default"
                className="h-auto min-h-11 w-full min-w-[280px] flex-col items-stretch gap-0.5 py-3 text-left whitespace-normal"
              >
                <Link
                  href={`/simulation/${s.id}/chart/overview`}
                  className="flex flex-col gap-0.5"
                  aria-label={`Open simulation: ${s.title}. ${s.subtitle}`}
                >
                  <span className="text-sm font-semibold leading-tight">{s.title}</span>
                  <span className="text-xs font-normal leading-tight text-white/85">
                    {s.subtitle}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
