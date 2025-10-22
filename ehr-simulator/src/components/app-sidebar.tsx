'use client'

import { Home, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const adminRoutes = [
  {
    title: "Admin Dashbord",
    url: "/admin",
    icom: Home,
  },
]

const defaultRoutes = [
  {
    title: "Profile",
    url: "/",
    icom: User,
  },
  {
    title: "Settings",
    url: "/auth/login",
    icom: Settings,
  },
];

export function AppSidebar() {

  const { role, loading } = useUser();
  // TODO: FIX ME
  const isAdmin = true;
  //const isAdmin = role === "admin";

  const routes = isAdmin ? adminRoutes.concat(defaultRoutes) : defaultRoutes;


  if (loading) return null;

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.url}>
                <SidebarMenuButton asChild>
                  <Link href={route.url}>
                    <route.icom />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
