import {
  Card,
  CardContent,
} from "../ui/card"
import { Separator } from "../ui/separator"
import Visitors from "./visitors"
import { VitalsOverview, vitalsOverviewData } from "./vitalsOverview"

const OverviewPage = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-100 pt-4 px-2">
      <div className="overflow-auto h-full px-2 rounded-2xl border inset-shadow-sm">
        <div className="grid grid-cols-3 gap-3 py-2">

          <Card className="relative col-span-2 p-0 overflow-hidden h-fit">
            <div className="px-2 pt-2 pb-4">
              <h1 className="text-xl">
                <span className="relative inline-block px-3 py-1">
                  <span
                    className={`absolute inset-0 bg-yellow-200 rounded-full scale-110`}
                    style={{
                      top: '6%',
                      left: '0%',
                      minWidth: '2.5rem', 
                      minHeight: '2.2rem', 
                    }}
                  ></span>
                  <span className="relative">
                    Al 
                  </span>
                </span>
                <span className="-ml-3 relative">erts</span>
              </h1>
                  
              <CardContent className="py-3">
                <div className="flex flex-col gap-4">
                  <div className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
                    <p className="">Static text</p>
                  </div>
                  <div className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
                    <p className="">Static text</p>
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="absolute bottom-0 bg-yellow-200 w-full h-4"></div>
          </Card>

          <Card className="relative col-span-1 p-0 overflow-hidden h-fit">
            <div className="px-2 pt-2 pb-6">
              <h1 className="text-xl">
                <span className="relative inline-block px-3 py-1">
                  <span
                    className={`absolute inset-0 bg-red-200 rounded-full scale-110`}
                    style={{
                      top: '6%',
                      left: '0%',
                      minWidth: '2.5rem', 
                      minHeight: '2.2rem', 
                    }}
                  ></span>
                  <span className="relative">
                    A 
                  </span>
                </span>
                <span className="-ml-3 relative">ctive Problems</span>
              </h1>
                  
              <CardContent className="py-2 px-2">
                <div className="flex flex-col gap-">
                    <p className="">Static text</p>
                    <Separator className="bg-red-200" />
                    <p className="">Static text</p>
                    <Separator className="bg-red-200" />
                </div>
              </CardContent>
            </div>
            <div className="absolute bottom-0 bg-red-200 w-full h-4"></div>
          </Card>
          <VitalsOverview data={vitalsOverviewData} />

        
          <Card className="relative col-span-1 p-0 overflow-hidden h-fit">
            <div className="px-2 pt-2 pb-6">
              <h1 className="text-xl">
                <span className="relative inline-block px-3 py-1">
                  <span
                    className={`absolute inset-0 bg-lime-200 rounded-full scale-110`}
                    style={{
                      top: '6%',
                      left: '0%',
                      minWidth: '2.5rem', 
                      minHeight: '2.2rem', 
                    }}
                  ></span>
                  <span className="relative">
                    C 
                  </span>
                </span>
                <span className="-ml-3 relative">ontacts</span>
              </h1>
                  
              <CardContent className="py-2">
                <div className="flex flex-col gap-6">
                  <div className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
                    <p className="">Static text</p>
                  </div>
                  <div className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
                    <p className="">Static text</p>
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="absolute bottom-0 bg-yellow-200 w-full h-4"></div>
          </Card>
          <Visitors />

          <Card className="relative pt-2 overflow-hidden h-fit gap-3">
            <div className="px-2">
                <h1 className="text-xl">
                  <span className="relative inline-block px-3 py-1">
                    <span
                      className={`absolute inset-0 bg-sky-200 rounded-full scale-110`}
                      style={{
                        top: '6%',
                        left: '0%',
                        minWidth: '2.5rem', 
                        minHeight: '2.2rem', 
                      }}
                    ></span>
                    <span className="relative">
                      N 
                    </span>
                  </span>
                  <span className="-ml-3 relative">utrition</span>
                </h1>      
            </div>     
      
            <CardContent className="grid gap-2 px-4">
              <div className="flex pl-2 gap-3">
                <p className="text-md font-medium tracking-tight">Diet:</p>
                <p className="text-neutral-500 text-md tracking-tight">Carb Contolled</p>
              </div>
              <div className="flex pl-2 gap-3">
                <p className="text-md font-medium tracking-tight text-nowrap">Fluid Restriction:</p>
                <p className="text-neutral-500 text-md tracking-tight">None</p>
              </div>

              
            </CardContent>
            <div className="absolute bottom-0 bg-sky-200 w-full h-4"></div>
          </Card>

          <div className="col-span-1 row-span-2  h-40 bg-red-500"></div>
          <div className="col-span-1 h-40 bg-red-500"></div>
          <div className="col-span-1 h-40 bg-red-500"></div>
          <div className="col-span-1 h-40 bg-red-500"></div>
          <div className="col-span-1 h-40 bg-red-500"></div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage