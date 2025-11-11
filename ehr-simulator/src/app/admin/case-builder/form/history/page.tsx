"use client"
import { useState } from "react";
import MultipleTextInput from "../../components/multipleTextInput";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import SubmitButton from "../../components/submitButton";

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.target as HTMLFormElement);
  const payload = Object.fromEntries(formData);
  console.log(payload);

  // Process data and save to patient object
  // Move to next page of the form
  // Backend shenanigans
}

const HistoryForm = () => {
  // Medical, surgical, family, social (Tobacco, Alcohol, Drugs, Living Situation)
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [surgicalHistory, setSurgicalHistory] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [tobaccoUse, setTobaccoUse] = useState<string[]>([]);
  const [alcoholUse, setAlcoholUse] = useState<string[]>([]);
  const [drugUse, setDrugUse] = useState<string[]>([]);
  const [livingSituation, setLivingSituation] = useState<string[]>([]);

  return (
    <>
      <div className="flex flex-col bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
        <Card>
          <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
            <div className="w-full flex flex-col gap-2 p-2">
              <p className="m-2 mb-4 ml-0 text-2xl font-bold">Patient History</p>

              <div className="flex flex-col gap-2">
                <MultipleTextInput labelText="Medical History:" name="medicalHistory" value={medicalHistory} onChange={setMedicalHistory} />
                <MultipleTextInput labelText="Surgical History:" name="surgicalHistory" value={surgicalHistory} onChange={setSurgicalHistory} />
                <MultipleTextInput labelText="Family History:" name="familyHistory" value={familyHistory} onChange={setFamilyHistory} />
                <MultipleTextInput labelText="Tobacco Use:" name="tobaccoUse" value={tobaccoUse} onChange={setTobaccoUse} />
                <MultipleTextInput labelText="Family History:" name="alcoholUse" value={alcoholUse} onChange={setAlcoholUse} />
                <MultipleTextInput labelText="Drug Use:" name="drugUse" value={drugUse} onChange={setDrugUse} />
                <MultipleTextInput labelText="Living Situation:" name="livingSituation" value={livingSituation} onChange={setLivingSituation} />
              </div>

              <SubmitButton href="/admin/case-builder/form/notes" buttonText="Continue" />
            </div>
          </form>
        </Card>
      </div>

    </>
  )
}
export default HistoryForm