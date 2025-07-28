import { Card, CardContent } from "../ui/card"
import { Separator } from "../ui/separator"

const ActiveProblems = () => {
  return (
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
  )
}

export default ActiveProblems