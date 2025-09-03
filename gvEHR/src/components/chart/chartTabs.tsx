import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, NotebookText, Pill, TestTubeDiagonal, User, Users } from "lucide-react";
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

export default function ChartTabs() {
  return (
      <Tabs defaultValue={tabs[0].value} className="w-fit pl-10 mt-auto ">
        <TabsList className="w-full h-8 p-0 bg-lime-600 justify-start rounded-none">
          {[
            ...tabs.map((tab) => (
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
          )), 
            <NavLink
              key={"patientSelect"}
              to={"#"}
              className="rounded-none h-full flex items-center "
            >
              <TabsTrigger
                value={"sdf"}
                className="rounded-none bg-gray-200 p-3 data-[state=active]:h-10 data-[state=active]:px-4  data-[state=active]:shadow-black/20 ring-none outline-none border border-gray-300 border-b-gray-00 data-[state=active]:bg-gray-100 -mb-[2px] rounded-t-lg flex items-center" // Added flex for alignment
              >
                {<Users />}
              </TabsTrigger>
            </NavLink>
          ]}
        </TabsList>
      </Tabs>
  );
}
