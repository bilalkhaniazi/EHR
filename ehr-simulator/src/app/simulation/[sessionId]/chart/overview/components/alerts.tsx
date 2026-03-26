"use client"

import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const Alerts = () => {
  const { safetyAlerts } = useSimulationTime()
  const alertNames = safetyAlerts
    .map((row) => row.safety_alerts?.name ?? "")
    .filter(Boolean)
  return (
    <Card className="relative col-span-2 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-yellow-200" firstLetter="A" secondLetter="lerts" />
      <CardContent className="">
        {alertNames.length === 0 ? (
          <p className="text-sm text-slate-600">No safety alerts documented.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {alertNames.map((alert) => (
              <div key={alert} className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
                <p className="font-medium">{alert}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-yellow-200 w-full h-3"></div>
    </Card>
  )
}

export default Alerts