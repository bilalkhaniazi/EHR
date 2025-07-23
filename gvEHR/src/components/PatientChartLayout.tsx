import { Outlet } from "react-router-dom"
import ChartNavigationTabs from "./chartNavigationTabs"
import { Toaster } from "sonner"
import ChartSidebar from "./chartSidebar"

const PatientChartLayout = () => {
  return (
    <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col">
      <Toaster position="top-right" />
      <ChartNavigationTabs />

      <div className="flex w-full h-full">
        <ChartSidebar />
        <div className="flex flex-col w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default PatientChartLayout