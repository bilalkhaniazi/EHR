'use client'
import Combobox from "@/components/ui/combobox"
import SubmitButton from "../../components/submitButton"
import { MedicationOrder, medicationOrders, allMedications, MedAdministrationInstance, AdministrationStatus } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import MedAdministrationFormCard from "./components/medAdministrationFormCard"
import { format } from "date-fns"
import { MedCardColumns } from "@/app/simulation/[sessionId]/chart/mar/page"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"


function getComboboxData(orders: MedicationOrder[]) {
  return medicationOrders.map(order => {
    const linkedMed = allMedications.find(med => med.id === order.medicationId)
    if (!linkedMed) {
      return {
        value: "error",
        label: "linked medication not found"
      }
    }
    const brandName = linkedMed.brandName || '';
    const route = `[${linkedMed.route}]`;

    const medLabel = `${linkedMed.genericName}  ${brandName}  ${order.dose} ${linkedMed.strengthUnit}  ${route}`;
    return {
      value: order.id,
      label: medLabel
    }
  })
}

const createColumns = () => {
  const columnAnchorTime = new Date()
  columnAnchorTime.setMinutes(0, 0, 0)

  const columnCount = 6
  const displayColumns = [] as MedCardColumns[]

  // create 6 columns, 2 future hours, one current hour, and three past hours
  for (let i = 0; i < columnCount; i++) {
    const colStartTime = new Date(columnAnchorTime.getTime() - ((i - 2) * 60 * 60 * 1000));
    const colEndTime = new Date(colStartTime.getTime() + (60 * 60 * 1000) - 1);
    const colHeader = format(colStartTime, 'HH00');

    displayColumns.unshift({
      startTime: colStartTime,
      endTime: colEndTime,
      colHeader: colHeader
    })
  }
  return displayColumns
}
type NewMedAdministrationInstance = Partial<MedAdministrationInstance>

const MedicationAdministrations = () => {
  const [medAdministrations, setMedAdministrations] = useState<MedAdministrationInstance[]>([])
  const [selectedOrder, setSelectedOrder] = useState<MedicationOrder>()
  const [selectedOrders, setSelectedOrders] = useState<MedicationOrder[]>([])
  const [administratorId, setAdministratorId] = useState('')
  const [status, setStatus] = useState<AdministrationStatus>('Given')
  const [isInPast, setIsInPast] = useState<boolean | 'indeterminate'>(false)
  const [dose, setDose] = useState(0)
  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);
  const comboboxData = getComboboxData(medicationOrders)
  const [startTime, setStartTime] = useState(new Date())

  const linkedMed = selectedOrder
    ? allMedications.find(med => med.id === selectedOrder.medicationId)
    : undefined

  const handleAddMedAdministration = () => {
    if (!selectedOrder) return;

    // Add to administrations
    const newMedAdministration: MedAdministrationInstance = {
      id: crypto.randomUUID(),
      medicationOrderId: selectedOrder.id,
      administratorId: administratorId,
      adminTimeMinuteOffset: isInPast ? -1 * timeOffset : timeOffset,
      status: status,
      administeredDose: dose
    }
    setMedAdministrations(prev => [...prev, newMedAdministration])

    // Add order to selectedOrders if not already there
    setSelectedOrders(prev => {
      if (!prev.find(order => order.id === selectedOrder.id)) {
        return [...prev, selectedOrder]
      }
      return prev
    })
  }
  const timeOffset = ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0)

  const handleDoseChange = (dose: string) => {
    if (dose === '' || /^[0-9]*$/.test(dose)) {
      setDose(Number(dose))
    }
  }
  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (x: number | '') => void
  ) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setter('');
      return
    }
    const numValue = parseFloat(inputValue);

    if (!isNaN(numValue) && numValue >= 0) {
      setter(numValue);
    }
  };

  const handleMedicationOrderChange = (orderId: string) => {
    const fullOrder = medicationOrders.find(order => order.id === orderId);
    setSelectedOrder(fullOrder);
    // Set default dose to order's dose
    if (fullOrder) {
      setDose(fullOrder.dose)
    }
  }
  const handleDeleteAdministration = (adminId: string) => {
    setMedAdministrations(prev => {
      const updatedAdmins = prev.filter(admin => admin.id !== adminId);

      const ordersWithAdmins = new Set(updatedAdmins.map(a => a.medicationOrderId));
      setSelectedOrders(currentOrders => currentOrders.filter(order => ordersWithAdmins.has(order.id)));

      return updatedAdmins;
    });
  }

  const handleSubmit = () => {
    console.log("Final Orders:", medAdministrations);
  }

  const displayColumns = createColumns()
  return (
    <div className="flex flex-col h-screen relative bg-white gap-6 p-4 overflow-y-auto">
      <form className="fixed top-8 right-8" onSubmit={handleSubmit} >
        <input name='medOrderData' type='hidden' value={JSON.stringify(medAdministrations)} />
        <SubmitButton buttonText="Continue" />
      </form>

      <h1 className="text-3xl p-y-2 font-medium">Medication Administrations</h1>
      <div>
        <Label>Medication Order</Label>
        <Combobox value={selectedOrder?.id || ''} onValueChange={handleMedicationOrderChange} data={comboboxData} displayText="Select order..." />
      </div>

      <div className="flex gap-8 items-end">
        <fieldset className="flex flex-col gap-2 border border-gray-200 rounded-lg p-2 pt-4 w-fit shadow-xs">
          <legend>Time Offset</legend>
          <div className="flex items-start gap-3 pl-2">
            <Checkbox checked={isInPast} onCheckedChange={setIsInPast} />
            <Label htmlFor="toggle">In the past?</Label>
          </div>
          <div className="flex gap-10 pt-1">
            <div>
              <Label htmlFor='days' className="text-xs">Days</Label>
              <Input id='days' value={days} onChange={(e) => handleTimeChange(e, setDays)} className="w-12 p-0.5 text-center" />
            </div>
            <div>
              <Label htmlFor='hours' className="text-xs">Hours</Label>
              <Input id='hours' value={hours} onChange={(e) => handleTimeChange(e, setHours)} className="w-12 p-0.5 text-center" />
            </div>
            <div>
              <Label htmlFor='minutes' className="text-xs">Minutes</Label>
              <Input id='minutes' value={minutes} onChange={(e) => handleTimeChange(e, setMinutes)} className="w-12 p-0.5 text-center" />
            </div>
          </div>
        </fieldset>
        <div className="w-40 space-y-1">
          <Label>Administered Dose</Label>
          <div className="flex items-end">
            <Input onChange={(e) => handleDoseChange(e.target.value)} value={dose} className="text-sm w-24 border px-3 py-2 rounded-r-none shadow-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200" />
            <div className="h-9 bg-gray-50 border border-l-0 rounded-r-xl border-gray-200 p-2 shadow-xs">
              <p className="text-sm">{linkedMed?.strengthUnit}</p>
            </div>
          </div>
        </div>
        <div className="w-fit space-y-1">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdministrationStatus)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="Given">Given</option>
            <option value="Held">Held</option>
            <option value="Missed">Missed</option>
            <option value="Refused">Refused</option>
            <option value="Due">Due</option>
          </select>
        </div>
        <div className="w-60 space-y-1">
          <Label>Administrator Name</Label>
          <Input
            value={administratorId}
            onChange={(e) => setAdministratorId(e.target.value)}
            placeholder="Enter administrator name"
          />
        </div>
      </div>

      <div className="">
        <Button
          type="button"
          onClick={handleAddMedAdministration}
          disabled={!selectedOrder}
          className="w-42"
        >
          Add Administration
        </Button>
      </div>

      <div className="w-full flex flex-col gap-6">
        {medAdministrations.length > 0 &&
          <h1 className="text-2xl font-medium tracking-tight">Medication Administration Record</h1>
        }

        {selectedOrders.map((order, index) => {
          const linkedMed = allMedications.find((med, index) => med.id === order.medicationId)
          const linkedAdministrations = medAdministrations.filter(admin => admin.medicationOrderId === order.id)
          if (!linkedMed || !linkedAdministrations) return
          console.log(linkedAdministrations)
          return (
            <div key={`${order.id}-${index}`}>
              <MedAdministrationFormCard
                order={order}
                medication={linkedMed}
                columns={displayColumns}
                administrations={linkedAdministrations}
                sessionStartTime={startTime.getTime()}
                onDeleteAdministration={handleDeleteAdministration}
              />
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default MedicationAdministrations