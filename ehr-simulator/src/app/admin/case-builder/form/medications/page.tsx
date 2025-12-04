'use client'
import { useMemo, useState } from "react"
import {
  Pill,
  Search,
  Tablets
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { allMedications, AllMedicationTypes, MedicationOrder } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import Combobox from "@/components/ui/combobox"
import MedCardForm from "./components/medCardForm"
import SubmitButton from "../../components/submitButton"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/context/FormContext"

function getComboboxData(medications: AllMedicationTypes[]) {
  return medications.map(med => {
    const brandName = med.brandName ? `(${med.brandName})` : '';
    const strength = `${med.strength}${med.strengthUnit}`
    const route = `[${med.route}]`;

    const medLabel = `${med.genericName}  ${brandName}  ${strength}  ${route}`;
    return {
      value: med.id,
      label: medLabel
    }
  })
}

export type NewOrderData = Partial<MedicationOrder>;

export default function MedicationOrderForm() {
  const router = useRouter()

  const [selectedMed, setSelectedMed] = useState('')
  const [selectedMeds, setSelectedMeds] = useState<AllMedicationTypes[]>([])
  const [medOrders, setOrders] = useState<NewOrderData[]>([])
  const { onDataChange } = useFormContext()

  const handleAddMedication = (newMedId: string) => {
    setSelectedMed(newMedId)
    if (newMedId) {
      const newMedObject = allMedications.find(med => med.id === newMedId)
      if (newMedObject) {
        const isAlreadyAdded = selectedMeds.some(med => med.id === newMedId)
        if (!isAlreadyAdded) {
          setSelectedMeds(prev => [newMedObject, ...prev])
          setOrders(prev => [{ medicationId: newMedObject.id }, ...prev])
        }
        setSelectedMed('')
      }
    }
  }
  console.log(medOrders)
  const handleRemoveMedication = (index: number) => {
    setSelectedMeds(prev => prev.filter((_, i) => i !== index))
    setOrders(prev => prev.filter((_, i) => i !== index))
  }

  const handleOrderChange = (index: number, field: keyof NewOrderData, value: string | boolean) => {
    setOrders(currentOrders =>
      currentOrders.map((order, i) => {
        if (i === index) {
          if (typeof value === 'string' && (field === 'dose' || field === 'infusionRate')) {
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (value === '' || regex.test(value)) {
              return { ...order, [field]: value };
            }
            return order;
          }
          return { ...order, [field]: value };
        }
        return order;
      })
    );
  };

  const comboboxData = useMemo(() => {
    return getComboboxData(allMedications);
  }, []);

  const handleSubmit = () => {
    onDataChange('medOrders', medOrders)
    console.log(medOrders)
    router.push('/admin/case-builder/form/medication-administrations')
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 overflow-hidden">

      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="text-slate-400" />
            Medication Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 8 of 9: Create Medication Orders</p>
        </div>

        <div>
          <SubmitButton onClick={handleSubmit} buttonText="Save and Continue" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Search Formulary
            </Label>
            <div className="max-w-2xl">
              <Combobox
                value={selectedMed}
                onValueChange={handleAddMedication}
                data={comboboxData}
                displayText="Type to search medications..."
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 pl-1">
              Selecting a medication will automatically add it to the order list below.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                Active Orders
              </h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                {selectedMeds.length} Added
              </span>
            </div>

            {selectedMeds.length > 0 ? (
              <div className="grid gap-4">
                {selectedMeds.map((med, index) => (
                  <div key={`${med.id}-${index}`} className="animate-in slide-in-from-top-2 duration-300">
                    <MedCardForm
                      medication={med}
                      handleMedicationRemoval={handleRemoveMedication}
                      index={index}
                      orderData={medOrders[index]}
                      onOrderChange={handleOrderChange}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Tablets className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium text-slate-600">No medications added.</p>
                <p className="text-sm max-w-sm text-center mt-1">
                  Search for a medication above to begin configuring doses, routes, and frequencies.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}