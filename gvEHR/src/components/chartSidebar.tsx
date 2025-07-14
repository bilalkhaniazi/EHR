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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ChartSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Assessment Descriptions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Accordion
                type="single"
                collapsible
                className=""
              >
                <AccordionItem value="1">
                  <AccordionTrigger>CIWA-Ar</AccordionTrigger>
                  <AccordionContent className="">
                      <div className="space-y-2"> 
                          {/* {wdlDescription.map((row, index) => ( */}
                              <div key={"1"} className="text-sm">
                                  <p className="pl-2 font-semibold text-gray-800 text-wrap">Nausea & Vomitting</p> 
                                  <p className="pl-4 text-gray-600 italic text-wrap">0 - No nausea or vomitting</p>
                              </div>
                          {/* ))} */}
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
