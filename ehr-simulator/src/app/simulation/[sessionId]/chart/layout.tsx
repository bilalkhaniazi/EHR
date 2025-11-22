"use client";

import ChartTabs from "./components/chartTabs"
import { Toaster } from "sonner"
import ChartSidebar from "@/app/simulation/[sessionId]/chart/components/chartSidebar"
import Header from "@/app/simulation/[sessionId]/chart/components/header"

type ChartLayoutProps = {
  children: React.ReactNode;
};

const ChartLayout = ({ children }: ChartLayoutProps) => {

  return (
    <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col [--header-height:calc(--spacing(16))]">
      <Toaster position="top-right" />
      <Header tabs={<ChartTabs />} />
      <div className="flex w-full h-full">
        <ChartSidebar />
        <div className="flex flex-col w-full h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ChartLayout