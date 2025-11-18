import { format } from "date-fns";
import type { MedCardColumns } from "@/app/simulation/[sessionId]/chart/mar/page";
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import { renderMedCardDetails, renderMedTitleRow } from "@/app/simulation/[sessionId]/chart/mar/components/marHelpers.tsx"

interface MedCardProps {
  medication: AllMedicationTypes;
  administrations: MedAdministrationInstance[];
  order: MedicationOrder;
  columns: MedCardColumns[];
  sessionStartTime: number;
  onDeleteAdministration: (adminId: string) => void;
}

const MedAdministrationFormCard = ({ medication, administrations, order, columns, sessionStartTime, onDeleteAdministration }: MedCardProps) => {
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
    <div className="relative w-full border bg-white rounded-2xl p-0 overflow-hidden flex-shrink-0 shadow">
      <div className="grid grid-cols-2 ">
        <div className="py-3 px-4 flex flex-col justify-between">
          <div className="pb-1 pl-2 flex items-center gap-2 font-semibold">
            {renderMedTitleRow(medication, order)}
          </div>
          <div className="text-xs tracking-tight pl-2 pb-2 text-gray-500">
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
          {processedColumns.map((col, colIndex) => {
            const hasAdministrations = col.associatedAdministrations.length > 0;
            return (
              <div key={`${colIndex}-${medication.id}`} className="flex flex-col items-center border-l">
                <p className={` text-sm  ${colIndex === 3 ? "font-bold underline" : "font-medium"}`}>{col.colHeader}</p>
                {hasAdministrations && (
                  <div className="h-full flex flex-col justify-center items-center py-2 gap-2">
                    {col.associatedAdministrations.map((admin, index) => {
                      const adminAbsoluteTime = new Date(sessionStartTime + admin.adminTimeMinuteOffset * 60 * 1000);
                      const displayTime = format(adminAbsoluteTime, 'HHmm')
                      let statusColorClass;
                      let statusText = admin.status;

                      switch (admin.status) {
                        case "Given":
                          statusColorClass = "bg-lime-200";
                          break;
                        case "Held":
                          statusColorClass = "bg-yellow-200";
                          break;
                        case "Missed":
                          statusColorClass = "bg-red-200";
                          break;
                        case "Due":
                          statusColorClass = "bg-sky-200";
                          break;
                        default:
                          statusColorClass = "bg-gray-200";
                          break;
                      }
                      return (
                        <div
                          key={admin.id} // Use the unique ID for the key
                          className={`relative flex flex-col justify-center items-center pt-2.5 pb-1 px-2 rounded-xl shadow-sm w-full ${statusColorClass}`}
                        >
                          <button
                            onClick={() => onDeleteAdministration(admin.id!)}
                            className="absolute top-0 right-1 text-sm font-bold leading-none w-4 h-4 flex items-center justify-center rounded-full transition-all hover:backdrop-brightness-90"
                            aria-label={`Delete administration at ${displayTime} with status ${admin.status}`}
                            title="Delete Administration"
                          >
                            &times;
                          </button>
                          <p className="text-center text-xs font-medium pt-1">{displayTime}</p>
                          <p className="text-xs font-normal pb-1">{statusText}</p>
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

export default MedAdministrationFormCard