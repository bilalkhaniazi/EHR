import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import AdminHeader from "./adminHeader";
import { AdminSidebar } from "./adminSidebar";

const AdminLayout = () => {
  return (
    <div className="bg-lime-600 h-screen w-full overflow-hidden flex flex-col [--header-height:calc(--spacing(16))]">
      <SidebarProvider className="flex flex-col">
        <AdminHeader />

        <div className="flex w-full flex-1">
          <AdminSidebar />          
          <SidebarInset>
            <div className="flex flex-1">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>




    
  );
}

export default AdminLayout