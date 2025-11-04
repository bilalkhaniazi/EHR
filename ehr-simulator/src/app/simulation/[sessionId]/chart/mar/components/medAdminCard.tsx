import { format } from "date-fns";
import { medActionSelections, type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData"
import MedAdminCardSelector from "./medAdminCardSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renderMedTitleRow, renderMedCardDetails, isSlidingScaleInsulin } from "./marHelpers";

interface MedAdminCardProps {
  medication: AllMedicationTypes;
  administrations: MedAdministrationInstance[];
  order: MedicationOrder;
  sessionStartTime: number;
  realWorldNow: Date;
  onStatusChange: (status: string) => void;
  currentStatus: string
  onDoseChange: (administeredDose: Number) => void;
  currentDose: number
}

// helper function to get the last few times the med was given
const getPreviousAdministrations = (administrations: MedAdministrationInstance[], prevAdmins: number) => {
    if (!administrations || administrations.length === 0) {
      return [{ medicationOrderId: "", administratorId: "", adminTimeMinuteOffset: 0, status: "Held" } as MedAdministrationInstance];
    }
    const filteredAdmins = administrations.filter(admin => admin.status === "Given")
    
    if (filteredAdmins.length === 0) {
      return [{ medicationOrderId: "", administratorId: "", adminTimeMinuteOffset: 0, status: "Held" } as MedAdministrationInstance]
    }
    filteredAdmins.sort((a, b) => a.adminTimeMinuteOffset - b.adminTimeMinuteOffset);
    return filteredAdmins.slice(-prevAdmins)
  }

  


const MedAdminCard = ({
  medication,
  administrations,
  order,
  sessionStartTime,
  onStatusChange,
  currentStatus,
  onDoseChange,
  currentDose,
  realWorldNow
}: MedAdminCardProps) => {

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus)
  }
  const handleDoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^[0-9]*$/.test(value)) {
      onDoseChange(Number(e.target.value))
    }
  } 
  
  type MedAdminStatus = MedAdministrationInstance["status"];
  const getStatusColor = (status: MedAdminStatus) => {
    const colorMap = {
      Given: "bg-lime-200 text-lime-800",
      Missed: "bg-red-200 text-red-800",
      Held: "bg-yellow-200 text-yellow-800",
      Due: "bg-blue-200 text-blue-800",
      Refused: "bg-gray-300 text-gray-800",
    };
    return colorMap[status as MedAdminStatus] || "bg-gray-200 text-gray-800";
  };

  const threePrevAdministrations = getPreviousAdministrations(administrations, 3);

  const isSlidingScaleInsulinMed = isSlidingScaleInsulin(medication)

  return (
    <div className="border bg-white rounded-2xl w-full p-0 overflow-hidden flex-shrink-0">
      <div className="grid grid-cols-2">
        <div className=" flex flex-col justify-between py-3 pl-6 space-y-4">  
          <div className="space-y-1">
            {renderMedTitleRow(medication, order)}
            <div className="text-xs tracking-tight pb-2 text-gray-500">
              {renderMedCardDetails(medication, order)}
            </div>
          </div>

          <div>
            {order.instructions && 
              <div className="">
                <h2 className="font-light">Administration Instructions:</h2>
                <p className="pl-2 text-xs font-light text-gray-700">
                  {order.instructions}
                </p>
              </div>
            }
          </div>

          {(isSlidingScaleInsulinMed) && (
            <div className="overflow-hidden rounded-lg border w-fit">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      BG Range (mg/dL)
                    </th>
                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Correction Units
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {medication.bgDosing.map((dose, index) => (
                    <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                      <td className="whitespace-nowrap px-2 py-1 text-xs text-gray-800 font-mono">{dose.bgRange}</td>
                      <td className="whitespace-nowrap px-2 py-1 text-xs text-gray-800 font-mono">{dose.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <h2 className="font-light pb-1">Previous Administrations:</h2>
            <div className="flex gap-4 pl-2">
              {threePrevAdministrations.map((administration, index) => {
                // if no administrations recorded for this medication
                if (!administration.medicationOrderId) {
                  return (
                    <p key={index} className="text-sm p-2 bg-gray-100 rounded-lg">Never</p>
                  )
                }
                const adminDateTime = new Date(sessionStartTime + administration.adminTimeMinuteOffset * 60 * 1000);
                const displayTime = format(adminDateTime, 'HHmm')
                return (
                  <div key={`${index}-${administration.medicationOrderId}`} className={`grid justify-center place-items-center rounded-md p-1 ${getStatusColor(administration.status)}`}>
                    <p className="text-xs tracking-tight text-gray-700">{displayTime}</p>
                    <p className="text-xs font-light text-gray-700">{administration.status}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 py-4 px-2 gap-y-2">
          <MedAdminCardSelector 
            options={medActionSelections}
            value={currentStatus}
            onValueChange={handleStatusChange} 
            label="Action"
          />
          <div className="w-full space-y-1">
            <Label>Route</Label>
            <p className="text-sm w-fit border px-3 py-2 rounded-lg shadow-xs">
              {medication.route}
            </p>
          </div>
          <div className="w-full space-y-1">
            <Label>Dose</Label>
            <div className="flex items-end">
              <Input  onChange={(e) => handleDoseChange(e)} value={currentDose} className="text-sm w-16 border px-3 py-2 rounded-r-none shadow-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200" />
              <div className="h-9 bg-gray-50 border border-l-0 rounded-r-xl border-gray-200 p-2 shadow-xs">
                <p className="text-sm">{medication.strengthUnit}</p>
              </div>
            </div> 
          </div>
          {medication.route === "IV" && medication.infusionRate &&
            <div className="w-full space-y-1">
              <Label>Rate</Label>
              <p className="text-sm w-fit border px-3 py-2 rounded-lg shadow-xs">
                {`${medication.infusionRate}${medication.infusionRateUnit}`}
              </p>
            </div>
          }
          <div className="w-full space-y-1">
            <Label>Date</Label>
            <p className="text-sm w-fit border px-3 py-2 rounded-lg shadow-xs">
              {format(sessionStartTime, 'P')}
            </p>
          </div>
          <div className="w-full space-y-1">
            <Label>Time</Label>
            <p className="text-sm w-fit border px-3 py-2 rounded-lg shadow-xs">
              {format(realWorldNow, 'HHmm')}
            </p>
          </div>
          <div className="w-full space-y-1">
            <Label>Comments</Label>
            <Input className="text-sm w-full" />
          </div>
        </div>      
      </div>
    </div>
  )
}

export default MedAdminCard