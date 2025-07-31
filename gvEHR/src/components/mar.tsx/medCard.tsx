import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

const MedCard = () => {
  return (
    <Card className="w-full p-0 overflow-hidden">
      <div className="grid grid-cols-2">
        <div className=" py-4">  
          <CardHeader>
            <CardTitle>metoprolol succinate</CardTitle>
            <CardDescription className="text-xs tracking-tight pb-2">
              <div className="flex gap-2 h-5">
                <span className="text-nowrap">50mg</span>
                <Separator className="bg-gray-300" orientation="vertical" />
                <span className="text-nowrap">Tablet</span>
                <Separator className="bg-gray-300" orientation="vertical"/>
                <span className="text-nowrap">Three times daily</span>
                <Separator className="bg-gray-300" orientation="vertical"/>
                <span className="text-nowrap">Blood Pressure</span>
              </div>
            </CardDescription>
          </CardHeader>
        <CardContent className="">
          <h2 className="font-light">Administration Instructions:</h2>
          <p className="pl-2 text-xs font-light text-gray-700">
            Check HR and BP within 15 minutes of administration. Hold for ...
          </p>
          <div className="flex w-full justify-end gap-2">
            <p className="text-sm">Last Administered:</p>
            <p className="text-sm font-light">1107</p>
          </div>
        </CardContent>
        </div>


        <div className="bg-amber-500">


        </div>


      </div>
    </Card>
  )
}

export default MedCard