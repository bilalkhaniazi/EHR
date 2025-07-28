import { Card, CardContent } from "../ui/card"

const Nutrition = () => {
  return( 
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
  )
}

export default Nutrition