"use client"

import FormTooltip from "@/components/form-tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { use, useState } from "react";


interface MicrobiologyReport {
  timeOffset: number;
  sampleType: string;
  location?: string;
  cultureResults: string;
  appearance: string;
  microscopy: string;
  sensitivity: string;
  comments: string;
  isCritical: boolean | 'indeterminate';
  reporter: string;
}


const AddMicrobiologyReport = () => {
  const [sampleType, setSampleType] = useState('')
  const [appearance, setAppearance] = useState('')
  const [microscopy, setMicroscopy] = useState('')
  const [cultureResults, setCultureResults] = useState('')
  const [sensitivity, setSensitivity] = useState('')
  const [comments, setComments] = useState('')
  const [reporter, setReporter] = useState('')
  const [isCritical, setIsCritical] = useState<'indeterminate' | boolean>('indeterminate')
  const [location, setLocation] = useState('')
  const [reports, setReports] = useState<MicrobiologyReport[]>([])

  const [days, setDays] = useState<number | ''>('')
  const [hours, setHours] = useState<number | ''>('')
  const [minutes, setMinutes] = useState<number | ''>('')

  const totalMinutesOffset = (days || 0) * 24 * 60 + (hours || 0) * 60 + (minutes || 0);

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (x: number | '') => void
  ) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setter('');
      return
    }
    const numValue = parseFloat(inputValue);

    if (!isNaN(numValue) && numValue >= 0) {
      setter(numValue);
    }
  };

  const isSubmittable = 
    !!sampleType &&
    !!appearance &&
    !!microscopy &&
    !!cultureResults &&
    !!sensitivity &&
    !!comments &&
    !!reporter &&
    (days || hours || minutes)

  const report: MicrobiologyReport = {
    timeOffset: totalMinutesOffset,
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
    setReports(prev => ([...prev, report]))
    setSampleType('')
    setAppearance('')
    setMicroscopy('')
    setCultureResults('')
    setSensitivity('')
    setComments('')
    setReporter('')
    setIsCritical(false)
    setLocation('')
  }

  return (
    <div className="w-full p-4 space-y-4">
      <h1 className="text-4xl">Microbiology Report</h1>
      <fieldset className="flex border p-4 rounded w-full gap-10">
        <legend>Time Offset</legend>
        <div>
          <Label htmlFor="days">Days</Label>
          <Input id="days" className=" mt-1" type='number' onChange={(e) => handleTimeChange(e, setDays)} value={days} />
        </div>
        <div>
          <Label htmlFor="hours">Hours</Label>
          <Input id="hours" className=" mt-1" type='number' onChange={(e) => handleTimeChange(e, setHours)} value={hours} />
        </div>
        <div>
          <Label htmlFor="minutes">Minutes</Label>
          <Input id="minutes" className=" mt-1" type='number' onChange={(e) => handleTimeChange(e, setMinutes)} value={minutes}/>
        </div>
      </fieldset>
      <div>
        <Label htmlFor="sampleType">Sample Type</Label>
        <select onChange={(e) => setSampleType(e.target.value)} value={sampleType} id="sampleType" className="border border-gray-200 h-9 rounded-md w-full px-2 mt-1 shadow-xs text-sm">
          <option value="" selected disabled hidden>Select type</option>
          <option value='Blood'>Blood</option>
          <option value='Sputum'>Sputum</option>
          <option value='Urine'>Urine</option>
          <option value='Stool'>Stool</option>
          <option value='CSF'>CSF</option>
          <option value='Wound'>Wound</option>
        </select>
      </div>

      <div>
        <div className="flex pb-1 gap-3">
          <Label htmlFor='location'>Sample Location</Label>
          <FormTooltip 
            size={16}
            tip='For wound cultures. Body region where sample was obtained'
            color='#364153'
          />
        </div>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
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
      <div>
        <p>Mark as critical or abnormal finding?</p>
        <Checkbox checked={isCritical} onCheckedChange={setIsCritical} />
      </div>
    <Button disabled={!isSubmittable} onClick={handleSubmit}>Add Microbiology Report</Button>
    </div>
  )
}


export default AddMicrobiologyReport

// labName: "Wound Culture",
// value: {
//   sampleType: "Wound Culture – Right Great Toe",
//   appearance: "Purulent drainage noted, surrounding erythema",
//   microscopy: "Gram stain: Moderate gram-positive cocci in clusters, few PMNs",
//   culture: "Staphylococcus aureus (moderate growth)",
//   sensitivity: "Methicillin (R), Clindamycin (S), Vancomycin (S)",
//   comments: "Likely MRSA involvement. Consider empiric coverage with vancomycin. Poor healing noted in context of suboptimal glycemic control.",
//   reporter: "AC, Microbiology Lab – St. Jude Medical Center",
//   critical: true