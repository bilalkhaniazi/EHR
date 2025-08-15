import Visitors from "./visitors"
import { VitalsOverview } from "./vitalsOverview"
import RecurringOrders from "./recurringOrders"
import Nutrition from "./nutrition"
import ActiveProblems from "./activeProblems"
import Alerts from "./alerts"
import CareTeam from "./careTeam"
import { IntakeOutput } from "./intakeOutput"
import { SelectedLabs } from "./selectedLabs"
import MarSnapshot from "./marSnapshot"
import Demographics from "./demographics"

const OverviewPage = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-100 pt-4 px-2">
      <div className="overflow-auto h-full px-2 rounded-t-2xl border inset-shadow-sm">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 py-2">
          <Alerts />
          <ActiveProblems />
          <VitalsOverview />
          <RecurringOrders />
          <Visitors />
          <Nutrition />
          <CareTeam />
          <IntakeOutput />
          <SelectedLabs />
          <MarSnapshot />
          <Demographics />
        </div>
      </div>
    </div>
  )
}

export default OverviewPage