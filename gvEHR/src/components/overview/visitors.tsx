import { Phone } from "lucide-react"
import { Card, CardContent  } from "../ui/card"

const Visitors = () => {
  return(
    <Card className="relative pt-2 overflow-hidden h-fit gap-3">
        <div className="px-2">
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
        </div>     
     
        <CardContent className="grid gap-4 px-8">
          <div className="flex flex-col w-full items-start gap-1">
              <p className="text-md font-medium leading-none">Sofia Allen</p>
              <div className="flex pl-2 gap-3">
                <p className="text-sm text-neutral-500 tracking-tight">Relationship:</p>
                <p className="text-neutral-500 text-sm">Spouse</p>
              </div>
            <div className="flex items-center pl-2 gap-2">
              <Phone size={14} color="#737373" />
              <p className="text-sm text-neutral-500 tracking-tight">(616) 555-1234</p>
            </div>
          </div>

          <div className="flex flex-col w-full items-start gap-1">
              <p className="text-md font-medium leading-none">Samuel Allen</p>
              <div className="flex pl-2 gap-3">
                <p className="text-sm text-neutral-500 tracking-tight">Relationship:</p>
                <p className="text-neutral-500 text-sm">Son</p>
              </div>
            <div className="flex items-center pl-2 gap-2">
              <Phone size={14} color="#737373" />
              <p className="text-sm text-neutral-500 tracking-tight">(616) 555-1234</p>
            </div>
          </div>
        </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-4"></div>

    </Card>
  )
}

export default Visitors
