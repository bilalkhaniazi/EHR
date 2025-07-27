import {
  Card,
  CardContent,
} from "../ui/card"
import { Separator } from "../ui/separator"

const OverviewPage = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-auto">
      <div className="grid grid-cols-3 gap-4 p-4 ">

        <Card className="relative col-span-2 p-0 overflow-hidden">
          <div className="px-2 pt-2 pb-6">
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

        <Card className="relative col-span-1 p-0 overflow-hidden">
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
      <div className="col-span-1 row-span-2  h-40 bg-red-500"></div>
      <div className="col-span-1 h-40 bg-red-500"></div>
      <div className="col-span-1 h-40 bg-red-500"></div>
      <div className="col-span-1 h-40 bg-red-500"></div>
      <div className="col-span-1 h-40 bg-red-500"></div>


    </div>
    </div>
  )
}

export default OverviewPage