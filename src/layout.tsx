import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function Layout() {
    return (
    <div className="h-screen flex flex-col">
        <Header />
        {/* <Sidebar /> */}
        <Outlet />
    </div>
    
    )
}