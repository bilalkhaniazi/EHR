"use client"

import { MicrobiologyReportData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import FormTooltip from "@/components/form-tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { use, useState } from "react";

// export interface MicrobiologyReport {
//   // timeOffset: number;
//   sampleType: string;
//   location?: string;
//   cultureResults: string;
//   appearance: string;
//   microscopy: string;
//   sensitivity: string;
//   comments: string;
//   isCritical: boolean | 'indeterminate';
//   reporter: string;
// }

interface AddMicrobiologyReportProps {
  // handlePopoverClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddMicrobiologyReport: (report: MicrobiologyReportData) => void;
  initialData?: MicrobiologyReportData;
}


const AddMicrobiologyReport = ({ handleAddMicrobiologyReport, initialData }: AddMicrobiologyReportProps) => {
  const isEditMode = !!initialData;

  const [sampleType, setSampleType] = useState(initialData?.sampleType || '')
  const [appearance, setAppearance] = useState(initialData?.appearance || '')
  const [microscopy, setMicroscopy] = useState(initialData?.microscopy || '')
  const [cultureResults, setCultureResults] = useState(initialData?.cultureResults || '')
  const [sensitivity, setSensitivity] = useState(initialData?.sensitivity || '')
  const [comments, setComments] = useState(initialData?.comments || '')
  const [reporter, setReporter] = useState(initialData?.reporter || '')
  const [isCritical, setIsCritical] = useState<'indeterminate' | boolean>(initialData?.isCritical || false)
  const [location, setLocation] = useState(initialData?.location || '')


  const isSubmittable =
    !!sampleType &&
    !!appearance &&
    !!microscopy &&
    !!cultureResults &&
    !!sensitivity &&
    !!comments &&
    !!reporter

  const report: MicrobiologyReportData = {
    sampleType: sampleType,
    location: location,
    cultureResults: cultureResults,
    appearance: appearance,
    microscopy: microscopy,
    sensitivity: sensitivity,
    comments: comments,
    isCritical: isCritical,
    reporter: reporter
  }
  const handleSubmit = () => {
    handleAddMicrobiologyReport(report)
    // handlePopoverClose(false)
  }

  return (
    <div className="w-full p-4 space-y-4">
      <h1 className="text-3xl tracking-tight font-semibold">
        {isEditMode ? "Edit Report" : "Microbiology Report"}
      </h1>

      <div>
        <div className="flex gap-8">
          <div className="w-60">
            <Label htmlFor="sampleType">Sample Type</Label>
            <select onChange={(e) => setSampleType(e.target.value)} value={sampleType} id="sampleType" className="border border-gray-200 h-9 rounded-md w-full px-2 mt-1 shadow-xs text-sm">
              <option value="" disabled hidden>Select type</option>
              <option value='Blood'>Blood</option>
              <option value='Sputum'>Sputum</option>
              <option value='Urine'>Urine</option>
              <option value='Stool'>Stool</option>
              <option value='CSF'>CSF</option>
              <option value='Wound'>Wound</option>
            </select>
          </div>
          <div className="flex-1">
            <div className="flex pb-1 gap-3 w-full">
              <Label htmlFor='location'>Sample Location</Label>
              <FormTooltip
                size={16}
                tip='For wound cultures. Body region where sample was obtained'
                color='#364153'
              />
            </div>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full" />
          </div>
        </div>
      </div>
      <div>
        <div className="flex pb-1 gap-3">
          <Label htmlFor="appearance">Appearance</Label>
          <FormTooltip
            size={16}
            tip='Ex: "'
            color='#364153'
          />
        </div>
        <Input className="mt-1" id='appearance' value={appearance} onChange={(e) => setAppearance(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="microscopy">Microscopy</Label>
        <Input className="mt-1" id='microscopy' value={microscopy} onChange={(e) => setMicroscopy(e.target.value)} />
      </div>
      <div>
        <div className="flex pb-1 gap-3">
          <Label htmlFor="cultureResults">Culture Results</Label>
          <FormTooltip
            size={16}
            tip='Ex: "Gram stain: Moderate gram-positive cocci in clusters, few PMNs"'
            color='#364153'
          />
        </div>
        <Input className="mt-1" id='cultureResults' value={cultureResults} onChange={(e) => setCultureResults(e.target.value)} />
      </div>
      <div>
        <div className="flex pb-1 gap-3">
          <Label htmlFor="sensitivity">Sensitivity</Label>
          <FormTooltip
            size={16}
            tip='Ex: "Methicillin (R), Clindamycin (S), Vancomycin (S)"'
            color='#364153'
          />
        </div>
        <Input className="mt-1" id='senstivity' value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="comments">Comments</Label>
        <Input className="mt-1" id='comments' value={comments} onChange={(e) => setComments(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="reporter">Reporter's Name</Label>
        <Input className="mt-1" id='reporter' value={reporter} onChange={(e) => setReporter(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <p>Mark as critical or abnormal finding?</p>
        <Checkbox checked={isCritical} onCheckedChange={setIsCritical} />
      </div>
      <Button disabled={!isSubmittable} onClick={handleSubmit} type='button'>
        {isEditMode ? 'Update Report' : 'Add Microbiology Report'}
      </Button>
    </div>
  )
}


export default AddMicrobiologyReport
