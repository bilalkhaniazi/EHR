import { Outlet } from "react-router-dom"
import ChartNavigationTabs from "./chartNavigationTabs"
import { Toaster } from "sonner"
import ChartSidebar from "./chartSidebar"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeTime, updateSimulationTime } from './timeSlice.ts';
import type { AppDispatch } from '../../app/store.ts'


const PatientChartLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    
    dispatch(initializeTime());

    const interval = setInterval(() => {
      dispatch(updateSimulationTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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