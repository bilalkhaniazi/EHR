import { Tooltip } from "@radix-ui/react-tooltip"
import { Card, CardContent } from "../ui/card"
import { Info } from "lucide-react"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const RecurringOrders = () => {
  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
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
                R 
              </span>
            </span>
            <span className="-ml-3 relative">ecurring Orders</span>
          </h1>      
      </div>     

      <CardContent className="grid gap-4 px-8">
        <div className="flex flex-col w-full items-start gap-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">Nursing</p>
            {/* Mark nursing orders as routine to display here */}
            <div className="flex pl-2 gap-3 items-center">
              <p className="text-xs text-neutral-500 tracking-tight">Vital Signs Monitoring (q4h)</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} color="#737373" />
                  </TooltipTrigger>
                  <TooltipContent className="w-fit">
                    <p className="max-w-120  text-wrap">Monitor BP, HR, RR, Temp, SpO₂ every 4 hours. Notify provider for Temp {`>`} 38.0°C (100.4°F), Systolic BP {`>`} 160 mmHg or {`>`} 100 mmHg, HR {`>`} 110 bpm or {`<`} 50 bpm.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex pl-2 gap-3 items-center">
              <p className="text-xs text-neutral-500 tracking-tight">Right Great Toe Wound Care</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} color="#737373" />
                  </TooltipTrigger>
                  <TooltipContent className="w-fit">
                    <p className="max-w-120  text-wrap">Daily dressing change with normal saline (NS) wound cleansing and application of sterile dry dressing. Apply topical antimicrobial per wound care protocol. Monitor for signs of infection (increased redness, drainage, odor.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-start gap-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">Labs</p>
            {/* Mark nursing orders as routine to display here */}
            <div className="flex pl-2 gap-3 items-center">
              <p className="text-xs text-neutral-500 tracking-tight">CBC</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} color="#737373" />
                  </TooltipTrigger>
                  <TooltipContent className="w-fit">
                    <p className="max-w-120  text-wrap">Collect Complete Blood Count (CBC).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex pl-2 gap-3 items-center">
              <p className="text-xs text-neutral-500 tracking-tight">Blood Glucose Monitoring</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} color="#737373" />
                  </TooltipTrigger>
                  <TooltipContent className="w-fit">
                    <p className="max-w-120 text-wrap">Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose {`<`} 70 mg/dL or {`>`} 300 mg/dL.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-4"></div>
    </Card>
  )
}

export default RecurringOrders