import { format } from "date-fns";
import type { MedCardColumns } from "../page.jsx";
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./marData.jsx"
import { Checkbox } from "@/components/ui/checkbox";
import { renderMedCardDetails, renderMedTitleRow } from "./marHelpers";

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

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange({ id: order.id, checked });
  };

  // using columns passed from main mar component, add relevant administration data (given, held, refused...)
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

  // most recent time of any administration instance where patient actually consumed the med (given, patient administered)
  const findLastAdminTime = () => {
    if (!administrations || administrations.length === 0) {
      return "Never";
    }
    const filteredAdmins = administrations.filter((admin: MedAdministrationInstance) => admin.status === "Given")
    if (filteredAdmins.length !== 0) {
      const lastAdmin = filteredAdmins.reduce((latest, current) => {
        return current.adminTimeMinuteOffset > latest.adminTimeMinuteOffset ? current : latest; 
      })
      const lastAdminTime = new Date(sessionStartTime + lastAdmin.adminTimeMinuteOffset * 60 * 1000);

      return format(lastAdminTime, 'HHmm')
    }
    return "Never"
  }


  return (
    <div className="w-full border bg-white rounded-2xl p-0 overflow-hidden flex-shrink-0">
      <div className="grid grid-cols-2 ">
        <div className="py-3 px-4 flex flex-col justify-between">  
          <div className="pb-1 flex items-center gap-2 font-semibold">
            <Checkbox
              onCheckedChange={handleCheckboxChange}
              checked={isSelected}
              id={`checkbox-${order.id}`}
              className="" 
            />
            {renderMedTitleRow(medication, order)}
          </div>
          <div className="text-xs tracking-tight pl-6 pb-2 text-gray-500">
            {renderMedCardDetails(medication, order)}
          </div>
          <div className="pl-6">
            {order.instructions && 
              <div className="pb-2">
                <h2 className="font-light">Administration Instructions:</h2>
                <p className="pl-2 text-xs font-light text-gray-700">
                  {order.instructions}
                </p>
              </div>
            }
          </div>
          <div className="flex w-full justify-end gap-2 pr-4">
            <p className="text-sm">Last Administered:</p>
            <p className="text-sm font-light">{findLastAdminTime()}</p>
          </div>
        </div>
        <div className="grid grid-cols-6">
          {processedColumns.map((col, index) => {
            const hasAdministrations = col.associatedAdministrations.length > 0;
            return (
              <div key={`${index}-${medication.id}`} className="flex flex-col items-center border-l">
                <p className={` text-sm  ${index === 3 ? "font-bold underline" : "font-medium"}`}>{col.colHeader}</p>
                {hasAdministrations && (
                  <div className="h-full flex flex-col justify-center items-center py-2 gap-2">
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
                          className={`flex flex-col justify-center items-center py-1 px-2 rounded-lg shadow  ${statusColorClass}`}
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
    </div>
  )
}

export default MedCard