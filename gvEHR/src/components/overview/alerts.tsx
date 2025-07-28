import { Card, CardContent } from "../ui/card"

const Alerts = () => {
  return (
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
              <p className="font-medium">
                High Risk for Falls - 
                <span className="pl-1 font-normal text-neutral-700">
                  Morse score {`>`} 45
                </span>
              </p>
            </div>
            <div className="bg-yellow-200 p-2 rounded-r-lg rounded-bl-lg">
              <p className="font-medium">Skin Integrity Risk</p>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="absolute bottom-0 bg-yellow-200 w-full h-4"></div>
    </Card>
  )
}

export default Alerts