'use client'

import { Home, Settings, User, BookOpenText, Hospital, Presentation } from "lucide-react";
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
import { usePathname } from "next/navigation";
import Link from "next/link";

const adminRoutes = [
  {
    title: "Admin Dashbord",
    url: "/admin",
    icom: Home,
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icom: BookOpenText,
  },
  {
    title: "Cases",
    url: "/admin/cases",
    icom: Hospital,
  },
  {
    title: "Active Simulations (WIP)",
    url: "/",
    icom: Presentation,
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

  const { loading } = useUser();
  const pathname = usePathname();
  const isCurrentPath = (url: string) => pathname === url;

  if (loading) return null;

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminRoutes.map((route) => (
              <SidebarMenuItem key={route.url}>
                <SidebarMenuButton
                  asChild
                  className={`${isCurrentPath(route.url) && "bg-secondary"}`}>
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

        <SidebarGroup />
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {defaultRoutes.map((route) => (
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
