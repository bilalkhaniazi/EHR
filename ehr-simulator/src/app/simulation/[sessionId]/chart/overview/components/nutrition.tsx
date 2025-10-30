import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"

const Nutrition = () => {

  return( 
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="N" secondLetter="utrition" />
      <CardContent className="grid gap-2 px-4">
        <div className="flex pl-2 gap-3">
          <p className="text-md  font-light tracking-tight">Diet:</p>
          <p className=" text-md tracking-tight">Carb Contolled</p>
        </div>
        <div className="flex pl-2 gap-3">
          <p className="text-md font-light tracking-tight text-nowrap">Fluid Restriction:</p>
          <p className=" text-md tracking-tight">None</p>
        </div>

        
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}

export default Nutrition