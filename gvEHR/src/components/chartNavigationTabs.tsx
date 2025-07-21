import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, NotebookText, Pill, TestTubeDiagonal, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    name: "Overview",
    value: "Overview",
    path: "",
    icon: ''
  },
  {
    name: "Labs",
    value: "Labs",
    icon: <TestTubeDiagonal />,
    path: '/patient/:id/labs'

  },
  {
    name: "Avatar",
    value: "Avatar",
    icon: <User />,
    path: '/patient/:id/'
  },
  {
    name: "Orders",
    value: "Orders",
    icon: <Clipboard />,
    path: "/patient/:id/orders" 

  },
  {
    name: "MAR",
    value: "MAR",
    icon: <Pill />,
    path: "" 

  },
  {
    name: "Notes",
    value: "Notes",
    icon: <NotebookText />,
    path: "/patient/:id/notes", 
  },
  {
    name: "FlexSheets",
    value: "FlexSheets",
    icon: "",
    path: '/patient/:id/charting'

  },
];

export default function ChartNavigationTabs() {
  return (
    <div className="border-b w-full">
    <Tabs defaultValue={tabs[6].value} className="w-fit ml-4">
      <TabsList className="w-full h-10 p-0 bg-lime-100 justify-start rounded-none">
        {tabs.map((tab) => (
          <NavLink
            key={tab.value}
            to={tab.path}
            className="rounded-none h-full flex items-center" // Added flex for alignment
          >
            <TabsTrigger
              value={tab.value}
              className="rounded-none bg-gray-200/90 p-4 h-full data-[state=active]:shadow-black/20 ring-none outline-none border border-gray-300/80 border-b-gray-300 data-[state=active]:border-gray-300 data-[state=active]:border-b-gray-100 data-[state=active]:bg-gray-100 -mb-[2px] rounded-t-lg flex items-center" // Added flex for alignment
            >
              {tab.icon} {/* Render the icon here */}
              <p className="text-lg font-normal">{tab.name}</p>
            </TabsTrigger>
          </NavLink>
        ))}
      </TabsList>
    </Tabs>
    </div>
  );
}
