import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Minus, Plus } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Student Performance",
      url: "#",
      items: [
        {
          title: "Charting Report",
          url: "#",
        },
        {
          title: "Timing Report",
          url: "#",
        },
      ],
    }
  ],
}

const collapsibleData = {
  navMain: [
    {
      title: "Sim Design",
      url: "#",
      items: [
        {
          title: "Create Sim",
          url: "#",
        },
        {
          title: "Edit Sim",
          url: "#",
        },
      ],
    },
    {
      title: "Medications",
      url: "#",
      items: [
        {
          title: "Label Printing",
          url: "/admin/formulary",
        },
        {
          title: "Edit Medications",
          url: "#",
        },
        
      ],
    },
    {
      title: "Select Cohort",
      url: "#",
      items: [
        {
          title: "NUR 350",
          url: "#",
        },
        {
          title: "NUR 3??",
          url: "#",
        },
        {
          title: "NUR 4??",
          url: "#",
        },
        {
          title: "NUR 4??",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "?",
          url: "#",
        },
      ],
    },
  ],
}
console.log(location.pathname)

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
       className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent className="overflow-y-auto">
              <SidebarMenu className="pl-2">
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarMenu>
            {collapsibleData.navMain.map((item) => (
              <Collapsible
                key={item.title}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === item.url}
                            >
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

