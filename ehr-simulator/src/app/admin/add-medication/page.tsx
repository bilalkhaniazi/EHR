'use client'
import { AllMedicationTypes } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { OralMedForm } from "./components/oral-med-form"
// import { IvMedForm } from "./components/ivMedForm"
import { OralMedication } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import { IvMedication } from "@/app/simulation/[sessionId]/chart/mar/components/marData"
import BaseMedicationFields from "./components/base-med-form"

const medTypes = [
  { label: 'Continous IV Fluids', value: 'Continous IV Fluids' },
  { label: 'Sliding Scale Insulin', value: 'Sliding Scale Insulin' },
  { label: 'IV Medication in Diluent', value: 'IV Medication in Diluent' },
  { label: 'Oral', value: 'Oral' },
]




const MedicationEntry = () => {
  const [route, setRoute] = useState('')
  const [genericName, setGenericName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [dose, setDose] = useState('')
  const [doseUnit, setDoseUnit] = useState('')

  const [data, setData] = useState()
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoute(event.target.value)
  }
  const onCreateMed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const inputValue = e.target.value
    setter(inputValue)

  }


  return (
    <div className="w-full p-4">
      <Label htmlFor="route" className='text-sm pb-1'>Route</Label>
      <select id="route" value={route} onChange={handleSelect} className="border border-gray-200 h-9 rounded-md px-2 shadow-xs  text-xs">
        <option value="" selected hidden disabled>Select route...</option>
        <option value="PO">Oral (PO)</option>
        <option value="IV">Intravenous (IV)</option>
        <option value="SC">Subcutaneous (SC)</option>
        <option value="IM">Intramuscular (IM)</option>
      </select>
      {/* <BaseMedicationFields genericName={genericName} brandName={brandName} dose={dose} doseUnit={doseUnit} genericNameSetter={setGenericName} brandNameSetter={setBrandName} doseSetter={setDose}  /> */}
      {route === 'PO' && <OralMedForm onSubmit={onCreateMed} />}
      {/* {route === 'IV' && <IvMedForm onSubmit={onCreateMed} />} */}

    </div>
  )
}

export default MedicationEntry