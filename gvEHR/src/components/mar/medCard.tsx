import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import type { MedCardColumns } from "./mar";
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./marData"
import { Checkbox } from "../ui/checkbox";

interface MedCardProps {
  medication: AllMedicationTypes;
  administrations: MedAdministrationInstance[];
  order: MedicationOrder;
  columns: MedCardColumns[];
  sessionStartTime: number;
  isSelected: boolean;
  onSelectionChange: (payload: { id: string, checked: boolean }) => void;
}

const MedCard = ({medication, administrations, order, columns, sessionStartTime, onSelectionChange, isSelected}: MedCardProps) => {

  // very temp solution
  const pluralize = (unitsOrdered: number, unitName: string) => {
    return unitsOrdered > 1 ? unitName + 's' : unitName
  }

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange({ id: order.id, checked });
  };


  const processedColumns = columns.map(col => {
    const administrationsInColumn = administrations.filter(admin => {
      const adminAbsoluteTime = new Date(sessionStartTime + admin.adminTimeMinuteOffset * 60 * 1000);
      return adminAbsoluteTime >= col.startTime && adminAbsoluteTime <= col.endTime;
    })

    return {
      ...col,
      associatedAdministrations: administrationsInColumn
    }
  })

  const findLastAdminTime = () => {
    if (!administrations || administrations.length === 0) {
      return "Never";
    }
    const filteredAdmins = administrations.filter(admin => admin.status === "Given" || admin.status === 'Patient Administered')
    if (filteredAdmins.length !== 0) {
      const lastAdmin = filteredAdmins.reduce((latest, current) => {
        if (current.status === "Due" || current.status === "Held" || current.status === "Missed") {
          return latest
        } 
        return current.adminTimeMinuteOffset > latest.adminTimeMinuteOffset ? current : latest; 
      })
      const lastAdminTime = new Date(sessionStartTime + lastAdmin.adminTimeMinuteOffset * 60 * 1000);

      return format(lastAdminTime, 'HHmm')
    }
    return "Never"
  }

  const renderMedCardDetails = () => {
    switch (medication.route) {
      case "PO":
        
        return (
          <div className="flex gap-2 h-5">
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
        <div className="flex gap-2 h-5">
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
        <div className="py-4">  
          <CardHeader className="">
            <CardTitle className="pb-1 flex gap-2 h-fit">
              <Checkbox
                onCheckedChange={handleCheckboxChange}
                checked={isSelected}
                id={`checkbox-${order.id}`}
                className="" 
              />
              <div className="flex flex-wrap gap-x-2">
                <span className="text-nowrap">{medication.genericName}</span>
                {medication.brandName && (
                  <span className="text-nowrap">({medication.brandName})</span>
                )}
                <span className="text-nowrap">{medication.strength}{medication.strengthUnit}</span>
              </div>
            </CardTitle>
            <CardDescription className="text-xs tracking-tight pb-2">
              {renderMedCardDetails()}
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            {order.instructions && 
              <div className="pb-2">
                <h2 className="font-light">Administration Instructions:</h2>
                <p className="pl-2 text-xs font-light text-gray-700">
                  {order.instructions}
                </p>
              </div>
            }
          
            <div className="flex w-full justify-end gap-2">
              <p className="text-sm">Last Administered:</p>
              <p className="text-sm font-light">{findLastAdminTime()}</p>
            </div>
          </CardContent>
        </div>
        <div className="grid grid-cols-6">
          {processedColumns.map((col, index) => {
            const hasAdministrations = col.associatedAdministrations.length > 0;
            return (
              <div key={`${index}-${medication.id}`} className="flex flex-col items-center border-l">
                <p className={` text-sm  ${index === 3 ? "font-bold underline" : "font-medium"}`}>{col.colHeader}</p>
                {hasAdministrations && (
                  <div className="h-full flex flex-col justify-center items-center gap-1">
                    {col.associatedAdministrations.map(admin => {
                      const adminAbsoluteTime = new Date(sessionStartTime + admin.adminTimeMinuteOffset * 60 * 1000);
                      const displayTime = format(adminAbsoluteTime, 'HHmm')
                      const statusColorClass =
                        admin.status === "Given" ? "bg-lime-200 " :
                        admin.status === "Missed" ? "bg-red-200" :
                        admin.status === "Held" ? "bg-yellow-200" :
                        admin.status === "Due" ? "bg-blue-200" :
                        "bg-gray-200"; 
                      return (
                        <div 
                          key={`${admin.medicationOrderId}-${admin.adminTimeMinuteOffset}-${admin.status}`} 
                          className={`flex flex-col justify-center items-center py-1 px-2 rounded-lg  ${statusColorClass}`}
                        >
                          <p className="text-center text-xs font-medium">{displayTime}</p>
                          <p className="text-xs font-normal">{admin.status}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                 
              </div>
            )
          })}
        </div>      
      </div>
    </Card>
  )
}

export default MedCard