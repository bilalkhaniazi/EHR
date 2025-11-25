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

const MedCard = ({ medication, administrations, order, columns, sessionStartTime, onSelectionChange, isSelected }: MedCardProps) => {

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
    <div className="relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex shrink-0 flex-col md:flex-row">
      <Checkbox
        onCheckedChange={handleCheckboxChange}
        checked={isSelected}
        id={`checkbox-${order.id}`}
        className="absolute top-4 left-3"
      />
      <div className="px-4 py-3 md:w-80 lg:w-110 2xl:w-140 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30 flex flex-col justify-between">
        <div >
          <div className="pl-6">
            <h4 className="font-bold text-slate-900 text-md xl:text-md pb-1">
              {renderMedTitleRow(medication, order)}
            </h4>
          </div>
          <div className="text-[12px] text-slate-500 space-y-1 pl-4 mb-3 ml-2">
            {renderMedCardDetails(medication, order)}
          </div>
          {order.instructions && (
            <div className="text-sm font-light bg-white text-slate-800 p-2 rounded border border-slate-200 mb-3">
              <span className="font-medium">Administration Instructions:</span> {order.instructions}
            </div>
          )}

        </div>
        <div className="flex w-full justify-end gap-2 pr-4">
          <p className="text-sm">Last Administered:</p>
          <p className="text-sm font-light">{findLastAdminTime()}</p>
        </div>
      </div>

      {/* Right Grid Panel */}
      <div className="flex-1 grid grid-cols-6 divide-x divide-slate-100 overflow-x-auto">
        {processedColumns.map((col, colIndex) => {
          const isCurrentHour = colIndex === 3;

          return (
            <div key={colIndex} className={`flex flex-col min-w-[60px] ${isCurrentHour ? 'bg-blue-50/30' : ''}`}>
              <div className={`text-xs text-center py-0.5 font-mono uppercase tracking-wider border-b border-slate-100 ${isCurrentHour ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                {col.colHeader}
              </div>

              <div className="flex-1 p-2 space-y-2 flex flex-col items-center justify-center min-h-[80px]">
                {col.associatedAdministrations?.map((admin, index) => {
                  const adminTime = new Date(sessionStartTime + admin.adminTimeMinuteOffset * 60 * 1000);

                  // Status Colors
                  let statusStyle = "bg-slate-100 text-slate-600 border-slate-200";
                  if (admin.status === "Given") statusStyle = "bg-green-100 text-green-700 border-green-200";
                  if (admin.status === "Held") statusStyle = "bg-amber-100 text-amber-700 border-amber-200";
                  if (admin.status === "Refused") statusStyle = "bg-red-100 text-red-700 border-red-200";

                  return (
                    <div key={`${admin.id}-${index}`} className={`w-fit text-center p-1 rounded border text-xs ${statusStyle}`}>
                      <div className="font-bold">{format(adminTime, 'HH:mm')}</div>
                      <div className="text-xs">{admin.status}</div>

                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MedCard