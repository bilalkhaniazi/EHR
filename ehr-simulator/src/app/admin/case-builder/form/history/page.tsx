"use client"
import { useState } from "react";
import MultiTextInput from "../../components/multiTextInput";
import { MultiSelect } from "../../components/multiSelect";
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
  const [alerts, setAlerts] = useState<string[]>([]);

  const router = useRouter()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    // router.push("/admin/case-builder/form/notes")
  }

  const nursingAlerts = [
    "Seizure Risk",
    "Aspiration Risk",
    "Bleeding Precautions",
    "Infection / Isolation Precautions",
    "NPO Status",
    "Suicide / Self-Harm Risk",
    "Violence / Aggression Risk",
    "Elopement Risk",
    "Restraint in Use / Restraint Order Active",
    "Sitter Required / Continuous Observation",
    "Hearing Impaired",
    "Vision Impaired",
    "Infection Control Flag (MDRO, MRSA, VRE, C. diff)",
    "High Fall Risk",
    "Bed / Chair Alarm On",
    "Requires Assist x2 for Mobility",
    "Uses Walker / Cane / Wheelchair",
    "Orthostatic Hypotension Risk",
    "Recent Surgery / Mobility Restriction",
    "Unsteady Gait",
    "Confused / Impulsive Behavior",
    "Call Light Within Reach Reminder",
    "Non-Weight Bearing Limb (R/L)",
    "Padded Side Rails in Place",
    "Suction and Oxygen Available at Bedside",
    "IV Access Maintained",
    "Stroke Risk / History of CVA",
    "Delirium / Cognitive Impairment Risk",
    "Head Injury Precautions",
    "Neurological Checks Ordered",
    "Increased Intracranial Pressure (ICP) Precautions",
    "IV Line / Central Line / PICC in Place",
    "Urinary Catheter in Place (CAUTI Risk)",
    "Tracheostomy / Airway Precautions",
    "Feeding Tube (NG/PEG) Precautions",
    "Wound Vac / Surgical Drain in Place",
    "Chest Tube Precautions",
    "Pacemaker / ICD Precautions",
    "Anticoagulant Therapy - Bleeding Precautions",
    "Diabetes - Hypoglycemia Risk",
    "Oxygen Therapy in Use",
    "Fluid Restriction / Sodium Restriction",
    "Pressure Injury Risk (Braden <18)",
    "Dialysis Access - No BP/IV on This Arm",
    "Immunocompromised Precautions",
    "Chemotherapy Precautions / Cytotoxic Drugs",
    "Postoperative / Fresh Surgical Site Precautions",
    "Advanced Directive on File",
    "Power of Attorney / Guardian",
    "Interpreter Required for Care",
    "Court-Ordered Observation / Police Hold",
    "Do Not Use Right Arm for Blood Draws",
    "Pediatric Safety Flag",
    "Geriatric Safety Flag"
  ];

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
              <MultiTextInput labelText="Medical History:" name="medicalHistory" value={medicalHistory} onChange={setMedicalHistory} />
              <MultiTextInput labelText="Surgical History:" name="surgicalHistory" value={surgicalHistory} onChange={setSurgicalHistory} />
              <MultiTextInput labelText="Allergies:" name="allergies" value={allergies} onChange={setAllergies} placeholder="Allergy" />

              <MultiTextInput labelText="Family History:" name="familyHistory" value={familyHistory} onChange={setFamilyHistory} />





              <MultiTextInput labelText="Social History:" name="socialHistory" value={socialHistory} onChange={setSocialHistory} />
              <MultiTextInput labelText="Living Situation:" name="livingSituation" value={livingSituation} onChange={setLivingSituation} />


              <MultiSelect labelText="Alerts:" name="alerts" value={alerts} onChange={setAlerts} options={nursingAlerts.map((alert) => ({ value: alert, label: alert }))} />

            </div>

          </div>
        </form>
      </Card>
    </div>
  )
}
export default HistoryForm