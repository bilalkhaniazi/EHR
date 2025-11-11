"use client"
import { useState } from "react";
import MultipleTextInput from "../../components/multipleTextInput";
import { Card } from "@/components/ui/card"
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";


const HistoryForm = () => {
  // Medical, surgical, family, social (Tobacco, Alcohol, Drugs, Living Situation)
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [surgicalHistory, setSurgicalHistory] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [socialHistory, setSocialHistory] = useState<string[]>([]);
  const [livingSituation, setLivingSituation] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const router = useRouter()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    router.push("/admin/case-builder/form/notes")
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
      <Card className="h-fit relative">
        <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
          <div className="absolute top-8 right-8">
            <SubmitButton buttonText="Continue" />
          </div>
          <div className="w-full flex flex-col gap-2 p-2">
            <p className="m-2 mb-4 ml-0 text-2xl font-bold">Patient History</p>

            <div className="flex flex-col gap-4">
              <MultipleTextInput labelText="Medical History:" name="medicalHistory" value={medicalHistory} onChange={setMedicalHistory} />
              <MultipleTextInput labelText="Surgical History:" name="surgicalHistory" value={surgicalHistory} onChange={setSurgicalHistory} />
              <MultipleTextInput labelText="Allergies:" name="allergies" value={allergies} onChange={setAllergies} placeholder="Allergy" />
              <MultipleTextInput labelText="Family History:" name="familyHistory" value={familyHistory} onChange={setFamilyHistory} />
              <MultipleTextInput labelText="Social History:" name="socialHistory" value={socialHistory} onChange={setSocialHistory} />
              <MultipleTextInput labelText="Living Situation:" name="livingSituation" value={livingSituation} onChange={setLivingSituation} />
            </div>

          </div>
        </form>
      </Card>
    </div>
  )
}
export default HistoryForm