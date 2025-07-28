import Visitors from "./visitors"
import { VitalsOverview } from "./vitalsOverview"
import RecurringOrders from "./recurringOrders"
import Nutrition from "./nutrition"
import ActiveProblems from "./activeProblems"
import Alerts from "./alerts"

const OverviewPage = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-100 pt-4 px-2">
      <div className="overflow-auto h-full px-2 rounded-2xl border inset-shadow-sm">
        <div className="grid grid-cols-3 gap-3 py-2">
          <Alerts />
          <ActiveProblems />
          <VitalsOverview />
          <RecurringOrders />
          <Visitors />
          <Nutrition />
          <div className="col-span-1 h-40 bg-orange-200 rounded-lg border border-orange-400 shadow"></div>
          <div className="col-span-1 h-40 bg-orange-200 rounded-lg border border-orange-400 shadow"></div>
          <div className="col-span-1 h-40 bg-orange-200 rounded-lg border border-orange-400 shadow"></div>
          <div className="col-span-1 h-40 bg-orange-200 rounded-lg border border-orange-400 shadow"></div>
          <div className="col-span-1 h-40 bg-orange-200 rounded-lg border border-orange-400 shadow"></div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage