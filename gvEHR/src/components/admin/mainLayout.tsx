import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import Header from "./header";
import { AdminSidebar } from "./adminSidebar";

const MainLayout = () => {
  return (
    <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col [--header-height:calc(--spacing(16))]">
      <SidebarProvider className="flex flex-col">
        <Header />

        <div className="flex w-full flex-1">
          <AdminSidebar />          
          <SidebarInset>
            <div className="flex flex-1 h-full">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default MainLayout