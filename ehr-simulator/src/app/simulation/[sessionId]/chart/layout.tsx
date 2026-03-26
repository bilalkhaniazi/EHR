"use client";

import ChartTabs from "./components/chartTabs"
import { Toaster } from "sonner"
import ChartSidebar from "@/app/simulation/[sessionId]/chart/components/chartSidebar"
import Header from "@/app/simulation/[sessionId]/chart/components/header"
import { SimulationTimeProvider } from "./context/SimulationTimeContext"

type ChartLayoutProps = {
  children: React.ReactNode;
};

const ChartLayout = ({ children }: ChartLayoutProps) => {

  return (
    <SimulationTimeProvider>
      <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col [--header-height:calc(--spacing(16))]">
        <Toaster position="top-right" />
        <Header tabs={<ChartTabs />} />
        <div className="flex w-full min-h-0 flex-1">
          <ChartSidebar />
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </div>
        </div>
      </div>
    </SimulationTimeProvider>
  )
}

export default ChartLayout