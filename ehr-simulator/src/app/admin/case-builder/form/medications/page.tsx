'use client'
import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { allMedications, AllMedicationTypes, MedicationOrder } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import Combobox from "@/components/ui/combobox"
import { Card } from "@/components/ui/card"
import MedCardForm from "./components/medCardForm"
import { Button } from "@/components/ui/button"

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


const MedicationEntry = () => {
  const [selectedMed, setSelectedMed] = useState('')
  const [selectedMeds, setSelectedMeds] = useState<AllMedicationTypes[]>([]) // when user selects a medication, add the medication object to the array here
  const [orders, setOrders] = useState<NewOrderData[]>([])


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

  const handleOrderChange = (index: number, field: keyof NewOrderData, value: any) => {
    setOrders(currentOrders =>
      currentOrders.map((order, i) => {
        if (i === index) {

          // Handle fields that should be numbers
          if (field === 'unitsOrdered' || field === 'infusionRate') {
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

  const handleSubmit = () => {
    console.log("Final Orders:", orders);
  }

  return (
    <div className="flex flex-col h-screen relative bg-white gap-6 p-4 overflow-y-auto">
      <Button onClick={handleSubmit} className="absolute top-8 right-8">Continue</Button>

      <h1 className="text-3xl p-y-2 font-medium">Medication Orders</h1>
      <div>
        <Label>Medication</Label>
        <Combobox value={selectedMed} onValueChange={handleAddMedication} data={comboboxData} displayText="Select medication" />
      </div>
      <div className="w-full flex flex-col gap-6">
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
      </div>
    </div>
  )
}

export default MedicationEntry