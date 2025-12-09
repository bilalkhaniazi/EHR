"use client"
import { useState } from "react";
import {
  Home,
  AlertTriangle,
  FileClock,
  BriefcaseMedical,
  LucideIcon,
  Slice
} from "lucide-react";
import MultiTextInput from "../../components/multiTextInput";
import { MultiSelect } from "../../components/multiSelect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { FamilyHistory, FamilyHistoryData } from "./familyHistory";
import { useFormContext } from "@/context/FormContext";
import { nursingAlerts } from "@/utils/form";
import { HistoryFormData } from "@/utils/form";

const FormSection = ({
  icon: Icon,
  title,
  children,
  className = ""
}: {
  icon: LucideIcon,
  title: string,
  children: React.ReactNode,
  className?: string
}) => (
  <div className={`space-y-4 ${className}`}>
    <div className="flex items-center gap-2 text-slate-800 border-b pb-2 border-slate-100">
      <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
        <Icon size={18} />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="pl-1">
      {children}
    </div>
  </div>
);

const HistoryForm = () => {
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [surgicalHistory, setSurgicalHistory] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState<FamilyHistoryData[]>([]);
  const [socialHistory, setSocialHistory] = useState<string[]>([]);
  const [livingSituation, setLivingSituation] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  const router = useRouter()
  const { onDataChange } = useFormContext()

  const historyData: HistoryFormData = {
    medicalHistory: medicalHistory,
    surgicalHistory: surgicalHistory,
    familyHistory: familyHistory,
    socialHistory: socialHistory,
    livingSituation: livingSituation,
    allergies: allergies,
    alerts: alerts,
  }

  const handleSubmit = () => {
    onDataChange("history", historyData)
    router.push("/admin/case-builder/form/history");
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50/50 overflow-hidden w-full">

      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileClock className="text-slate-400" />
            Patient History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 2 of 9: Document medical history and social context</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:px-12 lg:px-24">
        <form id="history-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6 pb-20">
          <div className="fixed top-6 right-8 z-10">
            <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-slate-200 shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Clinical Profile</CardTitle>
                <CardDescription>Past medical and surgical events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormSection icon={BriefcaseMedical} title="Medical History">
                  <MultiTextInput
                    labelText="Diagnoses"
                    name="medicalHistory"
                    value={medicalHistory}
                    onChange={setMedicalHistory}
                    placeholder="e.g. HTN, GERD..."
                  />
                </FormSection>

                <FormSection icon={Slice} title="Surgical History">
                  <MultiTextInput
                    labelText="Procedures"
                    name="surgicalHistory"
                    value={surgicalHistory}
                    onChange={setSurgicalHistory}
                    placeholder="e.g. TAVR (2010)..."
                  />
                </FormSection>

                <FormSection icon={AlertTriangle} title="Allergies">
                  <MultiTextInput
                    labelText="Allergens"
                    name="allergies"
                    value={allergies}
                    onChange={setAllergies}
                    placeholder="e.g. Penicillin..."
                  />
                </FormSection>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Social & Environmental</CardTitle>
                  <CardDescription>Living situation and habits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormSection icon={Home} title="Social Context">
                    <div className="space-y-4">
                      <MultiTextInput
                        labelText="Social Habits"
                        name="socialHistory"
                        value={socialHistory}
                        onChange={setSocialHistory}
                        placeholder="e.g. 1ppd smoker, socially drinks..."
                      />
                      <MultiTextInput
                        labelText="Living Situation"
                        name="livingSituation"
                        value={livingSituation}
                        onChange={setLivingSituation}
                        placeholder="e.g. Lives alone in single-story home..."
                      />
                    </div>
                  </FormSection>
                </CardContent>
              </Card>

              <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="text-amber-600" />
                    Safety Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiSelect
                    labelText=""
                    placeholder="Select safety alerts..."
                    options={nursingAlerts.map((alert) => ({ value: alert, label: alert }))}
                    selectedValues={alerts}
                    setSelectedValues={setAlerts}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Family History</CardTitle>
            </CardHeader>
            <CardContent>
              <FamilyHistory
                name="familyHistory"
                value={familyHistory}
                onChange={setFamilyHistory}
              />
            </CardContent>
          </Card>

        </form>
      </div>
    </div>
  )
}
export default HistoryForm