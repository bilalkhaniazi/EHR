import { format } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { medActionSelections, medRouteSelections, type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData"
import MedAdminCardSelector from "./medAdminCardSelector";
import { Input } from "../ui/input";

interface MedAdminCardProps {
  medication: AllMedicationTypes;
  administrations: MedAdministrationInstance[];
  order: MedicationOrder;
  sessionStartTime: number;
  onStatusChange: (status: string) => void;
  currentStatus: string
}

// helper function to get the last few times the med was given - important from nursing standpoint
const getThreePrevAdministrations = (administrations: MedAdministrationInstance[]) => {
  if (!administrations || administrations.length === 0) {
    return [{ medicationOrderId: "", administratorId: "", adminTimeMinuteOffset: 0, status: "Held" } as MedAdministrationInstance]
  }
  administrations.sort((a, b) => a.adminTimeMinuteOffset - b.adminTimeMinuteOffset);
  return administrations.slice(-3)
}

const MedAdminCard = ({medication, administrations, order, sessionStartTime, onStatusChange, currentStatus }: MedAdminCardProps) => {
  const handleChange = (newStatus: string) => {
    onStatusChange(newStatus)
  }

  
  // very temp solution
  const pluralize = (unitsOrdered: number, unitName: string) => {
    return unitsOrdered > 1 ? unitName + 's' : unitName
  };

  const threePrevAdministrations = getThreePrevAdministrations(administrations);

  // based on med route, card display may have to be unique. Different meds types have different info
  const renderMedCardDetails = () => {
    switch (medication.route) {
      case "PO":
        
        return (
          <div className="flex gap-2 h-5 font-normal">
            <span className="text-nowrap">{medication.route}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{order.doseValue} {pluralize(order.doseValue, order.doseUnit)}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{order.frequency}</span>
            <Separator className="bg-gray-300" orientation="vertical"/>
            <span className="text-nowrap">{order.indication}</span>
          </div>
        )
      case "IV": 
      return (
        <div className="flex gap-2 h-5 font-normal">
          <span className="text-nowrap">{medication.route}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.doseValue} {pluralize(order.doseValue, order.doseUnit)}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{medication.infusionRate} {medication.infusionRateUnit}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.frequency}</span>
          <Separator className="bg-gray-300" orientation="vertical"/>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    }
  }

  return (
    <Card className="w-full p-0 overflow-hidden flex-shrink-0">
      <div className="grid grid-cols-2">
        <div className="py-4 space-y-4">  
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

          <div className="pl-6">
            {order.instructions && 
              <div className="">
                <h2 className="font-light">Administration Instructions:</h2>
                <p className="pl-2 text-xs font-light text-gray-700">
                  {order.instructions}
                </p>
              </div>
            }
          </div>

          <div className="pl-6">
            <h2 className="font-light pb-1">Previous Administrations:</h2>
            <div className="flex gap-4 pl-2">
              {threePrevAdministrations.map((admin, index) => {
                // if no administrations recorded for this medication
                if (!admin.medicationOrderId) {
                  return ""
                }
                const adminDateTime = new Date(sessionStartTime + admin.adminTimeMinuteOffset * 60 * 1000);
                const displayColor = 
                  admin.status === "Given" ? "bg-lime-200 " :
                    admin.status === "Missed" ? "bg-red-200" :
                    admin.status === "Held" ? "bg-yellow-200" :
                    admin.status === "Due" ? "bg-blue-200" :
                    "bg-gray-200";
                const displayTime = format(adminDateTime, 'HHmm')
                return (
                  <div key={`${index}-${admin.medicationOrderId}`} className={`grid justify-center place-items-center rounded-md p-1 ${displayColor}`}>
                    <p className="text-xs tracking-tight text-gray-700">{displayTime}</p>
                    <p className="text-xs font-light text-gray-700">{admin.status}</p>
                  </div>
                )
              })}
            </div>
          </div>
          
        </div>

        <div className="grid grid-cols-3 py-4">
          <MedAdminCardSelector 
            options={medActionSelections}
            value={currentStatus}
            onValueChange={handleChange} 
            label="Action"

          />
          <MedAdminCardSelector
            options={medRouteSelections}
            value={medication.route}
            label="Route"
          />
          <Input className="border h-fit" />
          {/* Other selectors and input boxes here */}
        </div>      
      </div>
    </Card>
  )
}

export default MedAdminCard