import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import type { MedCardColumns } from "./Mar";
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./marData"

interface MedCardProps {
  medication: AllMedicationTypes;
  administrations: MedAdministrationInstance[];
  order: MedicationOrder;
  columns: MedCardColumns[];
}

const MedCard = ({medication, administrations, order, columns}: MedCardProps) => {
  const renderMedCardDetails = () => {
    switch (medication.route) {
      case "PO":
        
        return (
          <div className="flex gap-2 h-5">
            <span className="text-nowrap">{order.doseValue} x {order.doseUnit}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{order.frequency}</span>
            <Separator className="bg-gray-300" orientation="vertical"/>
            <span className="text-nowrap">{order.indication}</span>
          </div>
        )
      case "IV": 
      return (
        <div className="flex gap-2 h-5">
          <span className="text-nowrap">{order.doseValue} x {order.doseUnit}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.frequency}</span>
          <Separator className="bg-gray-300" orientation="vertical"/>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    }
  }

  return (
    <Card className="w-full p-0 overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="py-4">  
          <CardHeader className="">
            <CardTitle className="pb-1 flex gap-2 h-6">
              <span>{medication.genericName}</span>
              {medication.brandName && (
                <span>({medication.brandName})</span>
              )}
              <span>{order.doseValue * medication.strength}{medication.strengthUnit}</span>
            </CardTitle>
            <CardDescription className="text-xs tracking-tight pb-2">
              {renderMedCardDetails()}
            </CardDescription>
          </CardHeader>
        <CardContent className="">
          {order.instructions && 
            <>
              <h2 className="font-light">Administration Instructions:</h2>
              <p className="pl-2 text-xs font-light text-gray-700">
                {order.instructions}
              </p>
            </>
          }
         
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