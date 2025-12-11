'use client'
import { useState } from "react"
import {
  Pill,
  Clock,
  User,
  Plus,
  History,
  Syringe,
  ChevronDown,
} from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Combobox from "@/components/ui/combobox"
import SubmitButton from "../../components/submitButton"

import {
  MedicationOrder,
  medicationOrders,
  allMedications,
  MedAdministrationInstance,
  AdministrationStatus,
} from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import type { MedCardColumns } from "@/app/simulation/[sessionId]/chart/mar/page"
import MedAdministrationFormCard from "./components/medAdministrationFormCard"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormContext } from "@/context/FormContext"


function getComboboxData(orders: MedicationOrder[]) {
  return orders.map(order => {
    const linkedMed = allMedications.find(med => med.id === order.medicationId)
    if (!linkedMed) {
      return { value: "error", label: "Error: Linked medication not found" }
    }
    const brandName = linkedMed.brandName ? `(${linkedMed.brandName})` : '';
    const route = `[${linkedMed.route}]`;
    const medLabel = `${linkedMed.genericName} ${brandName} ${order.dose} ${linkedMed.strengthUnit} ${route}`;

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


export default function MedicationAdministrationsForm() {
  const { onDataChange, medAdministrationData } = useFormContext()

  const [medAdministrations, setMedAdministrations] = useState<MedAdministrationInstance[]>(medAdministrationData)
  const [selectedOrder, setSelectedOrder] = useState<MedicationOrder>()
  const [selectedOrders, setSelectedOrders] = useState<MedicationOrder[]>([])

  const [administratorId, setAdministratorId] = useState('')
  const [status, setStatus] = useState<AdministrationStatus>('Given')
  const [isInPast, setIsInPast] = useState<boolean>(false)
  const [dose, setDose] = useState(0)
  const [visibleInPresim, setVisibleInPresim] = useState<boolean>(true)

  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);

  const [startTime] = useState(new Date())
  const router = useRouter()

  const comboboxData = getComboboxData(medicationOrders)
  const linkedMed = selectedOrder ? allMedications.find(med => med.id === selectedOrder.medicationId) : undefined

  const handleAddMedAdministration = () => {
    if (!selectedOrder) return;

    const timeOffset = ((Number(days) || 0) * 1440) + ((Number(hours) || 0) * 60) + (Number(minutes) || 0)

    const newMedAdministration: MedAdministrationInstance = {
      id: crypto.randomUUID(),
      medicationOrderId: selectedOrder.id,
      administratorId: administratorId || "System",
      adminTimeMinuteOffset: isInPast ? -1 * timeOffset : timeOffset,
      status: status,
      administeredDose: dose,
      visibleInPresim: visibleInPresim
    }

    setMedAdministrations(prev => [...prev, newMedAdministration])

    setSelectedOrders(prev => {
      if (!prev.find(order => order.id === selectedOrder.id)) {
        return [selectedOrder, ...prev]
      }
      return prev
    })
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

  const handleDeleteAdministration = (adminId: string) => {
    setMedAdministrations(prev => {
      const updatedAdministrations = prev.filter(admin => admin.id !== adminId);
      const ordersWithAdmins = new Set(updatedAdministrations.map(a => a.medicationOrderId));
      // remove entire order if no associated administrations remain
      setSelectedOrders(currentOrders => currentOrders.filter(order => ordersWithAdmins.has(order.id)));

      return updatedAdministrations;
    });
  }

  const handleSubmit = () => {
    onDataChange('medAdministrationInstances', medAdministrations)
    console.log(medAdministrations)
    router.push('/admin/case-builder/form/review')
  }

  const handleDoseChange = (val: string) => {
    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setDose(Number(val))
    }
  }

  const displayColumns = createColumns()

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 overflow-hidden">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Syringe className="text-slate-400" />
            Medication History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 9 of 9: Document past administrations and add Due times</p>
        </div>
        <div>
          <SubmitButton onClick={handleSubmit} buttonText="Save and Continue" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8 pb-20">

          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pt-4 !pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-col gap-4">



              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Select Order</Label>
                    <Combobox
                      value={selectedOrder?.id || ''}
                      onValueChange={(id) => {
                        const order = medicationOrders.find(order => order.id === id);
                        setSelectedOrder(order);
                        if (order) setDose(order.dose);
                      }}
                      data={comboboxData}
                      displayText="Search medication orders..."
                    />
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4" /> Time Offset
                      </Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="past-mode" className={`text-xs text-slate-500`}>
                          {isInPast ? "Given before sim start" : "Due"}
                        </Label>
                        <Switch checked={isInPast} onCheckedChange={setIsInPast} id="past-mode" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <Input value={days} onChange={(e) => handleTimeChange(e, setDays)} className="bg-white text-center text-lg font-medium h-12 pr-11" />
                          <span className="absolute right-3 top-4 text-center text-[10px] text-slate-400 uppercase tracking-wider">Days</span>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-500 font-light text-2xl">:</div>
                      <div className="flex-1">
                        <div className="relative">
                          <Input value={hours} onChange={(e) => handleTimeChange(e, setHours)} className="bg-white text-center text-lg font-medium h-12 pr-12" />
                          <span className="absolute right-3 top-4 text-center text-[10px] text-slate-400 uppercase tracking-wider">Hours</span>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-500 font-light text-2xl">:</div>
                      <div className="flex-1">
                        <div className="relative">
                          <Input value={minutes} onChange={(e) => handleTimeChange(e, setMinutes)} className="bg-white text-center text-lg font-medium h-12 pr-10" />
                          <span className="absolute right-3 top-4  text-center text-[10px] text-slate-400 uppercase tracking-wider">Mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dose</Label>
                      <div className="relative">
                        <Input
                          value={dose}
                          onChange={e => handleDoseChange(e.target.value)}
                          className="pr-12 font-medium"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                          {linkedMed?.strengthUnit || 'units'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(v: AdministrationStatus) => setStatus(v)}>
                        <SelectTrigger>
                          <SelectValue />
                          <ChevronDown />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Given">Given</SelectItem>
                          <SelectItem value="Held">Held</SelectItem>
                          <SelectItem value="Missed">Missed</SelectItem>
                          <SelectItem value="Refused">Refused</SelectItem>
                          <SelectItem value="Due">Due</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Administrator</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="RN Name"
                        value={administratorId}
                        onChange={e => setAdministratorId(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border bg-white rounded-md w-fit p-2">
                    <Checkbox
                      id='presim'
                      checked={visibleInPresim}
                      onCheckedChange={(checked) => setVisibleInPresim(!!checked)}
                      className="bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label>Included in Pre-Sim?</Label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleAddMedAdministration}
                  disabled={!selectedOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-md"
                >
                  Add Record
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <History className="w-5 h-5" /> Recorded Administrations
              </h3>
              <Badge variant="secondary">{medAdministrations.length} Records</Badge>
            </div>

            <div className="space-y-6">
              {selectedOrders.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                  <Pill className="w-8 h-8 mb-2 opacity-20" />
                  <p>No administration records added yet.</p>
                </div>
              )}

              {selectedOrders.map((order, index) => {
                const linkedMed = allMedications.find(med => med.id === order.medicationId)
                const linkedAdmins = medAdministrations.filter(admin => admin.medicationOrderId === order.id)

                if (!linkedMed) return null;

                return (
                  <div key={`${order.id}-${index}`} className="animate-in slide-in-from-bottom-2 duration-500">
                    <MedAdministrationFormCard
                      order={order}
                      medication={linkedMed}
                      columns={displayColumns}
                      administrations={linkedAdmins}
                      sessionStartTime={startTime.getTime()}
                      onDeleteAdministration={handleDeleteAdministration}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


