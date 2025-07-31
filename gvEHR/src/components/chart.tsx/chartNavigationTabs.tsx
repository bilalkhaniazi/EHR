import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, NotebookText, Pill, Stethoscope, TestTubeDiagonal, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    name: "Overview",
    value: "Overview",
    path: "/",
    icon: ''
  },
  {
    name: "Labs",
    value: "Labs",
    icon: <TestTubeDiagonal />,
    path: '/labs'

  },
  {
    name: "Avatar",
    value: "Avatar",
    icon: <User />,
    path: '/'
  },
  {
    name: "Orders",
    value: "Orders",
    icon: <Clipboard />,
    path: "/orders" 

  },
  {
    name: "MAR",
    value: "MAR",
    icon: <Pill />,
    path: "/mar" 

  },
  {
    name: "Notes",
    value: "Notes",
    icon: <NotebookText />,
    path: "/notes", 
  },
  {
    name: "FlexSheets",
    value: "FlexSheets",
    icon: "",
    path: '/charting'

  },
];

export default function ChartNavigationTabs() {
  return (
    <div className="flex items-end border-b w-full h-16 flex-shrink-0">
      <div className="flex h-full justify-center items-center pl-8 gap-2">
        <Stethoscope color="white" size={26} strokeWidth={2.5}/>
        <h1 className="text-3xl font-bold text-white">
          Flex
          <span className="font-normal">Chart</span>
        </h1>
      </div>
      <Tabs defaultValue={tabs[0].value} className="w-fit pl-28">
        <TabsList className="w-full h-8 p-0 bg-lime-600 justify-start rounded-none">
          {tabs.map((tab) => (
            <NavLink
              key={tab.value}
              to={tab.path}
              className="rounded-none h-full flex items-center "
            >
              <TabsTrigger
                value={tab.value}
                className="rounded-none bg-gray-200 p-3 data-[state=active]:h-10 data-[state=active]:px-4  data-[state=active]:shadow-black/20 ring-none outline-none border border-gray-300 border-b-gray-00 data-[state=active]:bg-gray-100 -mb-[2px] rounded-t-lg flex items-center" // Added flex for alignment
              >
                {tab.icon}
                <p className="text-md font-normal tracking-tight">{tab.name}</p>
              </TabsTrigger>
            </NavLink>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
