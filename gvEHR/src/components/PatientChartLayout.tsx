import { Outlet } from "react-router-dom"
import ChartNavigationTabs from "./chartNavigationTabs"
import { Toaster } from "sonner"

const PatientChartLayout = () => {
  return (
    <div className="bg-lime-100 h-screen overflow-hidden flex flex-col">
      <Toaster position="top-right" />
      <div className="h-16 flex-shrink-0"></div>
      <ChartNavigationTabs />

      <div className="flex flex-col h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default PatientChartLayout