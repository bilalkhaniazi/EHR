'use client'
import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { allMedications, AllMedicationTypes, MedicationOrder } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import Combobox from "@/components/ui/combobox"
import MedCardForm from "./components/medCardForm"
import SubmitButton from "../../components/submitButton"
import { useRouter } from "next/navigation"

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

type NewOrderData = Partial<MedicationOrder> & { medicationId: string };


const MedicationOrderForm = () => {
  const [selectedMed, setSelectedMed] = useState('')
  const [selectedMeds, setSelectedMeds] = useState<AllMedicationTypes[]>([]) // when user selects a medication, add the medication object to the array here
  const [orders, setOrders] = useState<NewOrderData[]>([])
  const router = useRouter()


  const handleAddMedication = (newMedId: string) => {
    setSelectedMed(newMedId)
    if (newMedId) {
      const newMedObject = allMedications.find(med => med.id === newMedId)
      if (newMedObject) {
        const isAlreadyAdded = selectedMeds.some(med => med.id === newMedId)
        if (!isAlreadyAdded) {
          setSelectedMeds(prev => [...prev, newMedObject])
          setOrders(prev => [...prev, { medicationId: newMedObject.id }])
        }
      }
    }
  }

  const handleRemoveMedication = (index: number) => {
    setSelectedMeds(prev => prev.filter((_, i) => i !== index))
    setOrders(prev => prev.filter((_, i) => i !== index))

  }

  const handleOrderChange = (index: number, field: keyof NewOrderData, value: string) => {
    setOrders(currentOrders =>
      currentOrders.map((order, i) => {
        if (i === index) {

          // Handle fields that should be numbers
          if (field === 'dose' || field === 'infusionRate') {
            const regex = /^[0-9]*\.?[0-9]*$/; // Allows decimals, "1.", ".5"

            if (value === '' || regex.test(value)) {
              return { ...order, [field]: value };
            }
            // If invalid (e.g., "1.5.2" or "abc"), just return the old state
            return order;
          }

          // Handle all other string fields
          return { ...order, [field]: value };
        }
        return order;
      })
    );
  };
  const comboboxData = useMemo(() => {
    return getComboboxData(allMedications);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    router.push('/admin/case-builder/form/medication-administrations')
  }

  return (
    <div className="flex flex-col h-screen relative bg-white gap-6 pt-4 pb-0 overflow-y-auto">
      <form className="fixed top-8 right-8 z-10" onSubmit={handleSubmit} >
        <input name='medOrderData' type='hidden' value={JSON.stringify(orders)} />
        <SubmitButton buttonText="Continue" />
      </form>

      <div className="w-full px-4 space-y-4">
        <h1 className="text-3xl p-y-2 font-medium">Medication Orders</h1>
        <div>
          <Label>Medication</Label>
          <Combobox value={selectedMed} onValueChange={handleAddMedication} data={comboboxData} displayText="Select medication" />
        </div>
      </div>
      <div className="w-full flex flex-col gap-6 h-[calc(100vh-8rem)] overflow-y-auto border-t p-4 shadow-inner">
        {selectedMeds.length > 0 ?
          <>
            {selectedMeds.map((med, index) => {
              return (
                <MedCardForm
                  key={med.id}
                  medication={med}
                  handleMedicationRemoval={handleRemoveMedication}
                  index={index}
                  orderData={orders[index]}
                  onOrderChange={handleOrderChange}
                />
              )
            })}


          </> :
          <p className="text-gray-400 pl-4">Select a medication to get started</p>
        }

      </div>
    </div>
  )
}

export default MedicationOrderForm