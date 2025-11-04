"use client"
import { useState } from "react";
import MultipleTextInput from "../../multipleTextInput";

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

    </>
  )
}
export default HistoryForm