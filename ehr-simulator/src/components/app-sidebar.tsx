'use client'

import { Home, Settings, User, BookOpenText, Hospital, Presentation, LogOut } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { clearDraft as clearCaseBuilderDraft } from "@/utils/drafts/caseBuilderDraft";

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
    url: "/simulation",
    icom: Presentation,
  },
]

const defaultRoutes = [
  {
    title: "Profile",
    url: "/profile",
    icom: User,
  },
  {
    title: "Settings",
    url: "/auth/login",
    icom: Settings,
  },
];

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export function AppSidebar() {

  const { loading, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isCurrentPath = (url: string) => pathname === url;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (user?.id) {
      clearCaseBuilderDraft(user.id);
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("role");
    }
    router.replace("/auth/login");
  };

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
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />

      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
