import { Outlet } from "react-router-dom";
import Header from "./components/chart.tsx/Header";

export default function Layout() {
    return (
    <div className="h-screen flex flex-col">
        <Header />
        <Outlet />
    </div>
    
    )
}