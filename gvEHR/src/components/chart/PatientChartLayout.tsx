import { Outlet } from "react-router-dom"
import ChartTabs from "./chartTabs.tsx"
import { Toaster } from "sonner"
import ChartSidebar from "./chartSidebar"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeTime, updateSimulationTime } from './timeSlice.ts';
import type { AppDispatch } from '../../app/store.ts'
import Header from "../admin/header.tsx";


const PatientChartLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Main component of the entire chart, time is kept here
  // timer sets the sessionStartTime once and updates the simulation time for components that need it (FlexSheet, Overview Cards, Labs)
  // probably better ways of doing this
  useEffect(() => {
    dispatch(initializeTime());

    const interval = setInterval(() => {
      dispatch(updateSimulationTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col [--header-height:calc(--spacing(16))]">
      <Toaster position="top-right" />
      <Header tabs={<ChartTabs />} />
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