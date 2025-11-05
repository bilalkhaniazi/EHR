"use client"

import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useState } from "react";

const labOptions = [
  { "value": "Sodium", "label": "Sodium" },
  { "value": "Potassium", "label": "Potassium" },
  { "value": "Chlorine", "label": "Chlorine" },
  { "value": "BUN", "label": "BUN" },
  { "value": "Creatinine", "label": "Creatinine" },
  { "value": "Glucose", "label": "Glucose" },
  { "value": "CO2", "label": "CO2" },
  { "value": "Calcium", "label": "Calcium" },
  { "value": "Lactate", "label": "Lactate" },
  { "value": "RBC", "label": "RBC" },
  { "value": "WBC", "label": "WBC" },
  { "value": "Platelets", "label": "Platelets" },
  { "value": "Hemoglobin", "label": "Hemoglobin" },
  { "value": "Hematocrit", "label": "Hematocrit" },
  { "value": "MCV", "label": "MCV" },
  { "value": "MCH", "label": "MCH" },
  { "value": "MCHC", "label": "MCHC" },
  { "value": "Troponin", "label": "Troponin" },
  { "value": "CKMB", "label": "CKMB" },
  { "value": "Myoglobin", "label": "Myoglobin" },
  { "value": "AST", "label": "AST" },
  { "value": "ALT", "label": "ALT" },
  { "value": "ALP", "label": "ALP" },
  { "value": "Total Bilirubin", "label": "Total Bilirubin" },
  { "value": "Albumin", "label": "Albumin" },
  { "value": "Ammonia", "label": "Ammonia" },
  { "value": "pH", "label": "pH" },
  { "value": "pCO2", "label": "pCO2" },
  { "value": "pO2", "label": "pO2" },
  { "value": "HCO3", "label": "HCO3" },
  { "value": "Specific Gravity", "label": "Specific Gravity" },
  { "value": "Urine pH", "label": "Urine pH" },
  { "value": "Protein", "label": "Protein" },
  { "value": "Urine Glucose", "label": "Urine Glucose" },
  { "value": "Ketones", "label": "Ketones" },
  { "value": "Leukocyte Esterase", "label": "Leukocyte Esterase" },
  { "value": "Nitrites", "label": "Nitrites" },
  { "value": "Blood", "label": "Blood" },
  { "value": "PT", "label": "PT" },
  { "value": "PTT", "label": "PTT" },
  { "value": "INR", "label": "INR" },
  { "value": "CRP", "label": "CRP" },
  { "value": "ESR", "label": "ESR" },
  { "value": "TSH", "label": "TSH" },
  { "value": "Free T3", "label": "Free T3" },
  { "value": "Free T4", "label": "Free T4" },
  { "value": "Total Cholesterol", "label": "Total Cholesterol" },
  { "value": "HDL Cholesterol", "label": "HDL Cholesterol" },
  { "value": "LDL Cholesterol", "label": "LDL Cholesterol" },
  { "value": "Triglycerides", "label": "Triglycerides" },
  { "value": "Magnesium", "label": "Magnesium" },
  { "value": "Phosphate", "label": "Phosphate" },
  { "value": "Amylase", "label": "Amylase" },
  { "value": "Lipase", "label": "Lipase" },
]

interface LabEntry {
  timeOffset: number;
  labName: string;
  value: number;
}

export default function AddLabs() {
  const [days, setDays] = useState<number | ''>('')
  const [hours, setHours] = useState<number | ''>('')
  const [minutes, setMinutes] = useState<number | ''>('')

  const [currentLab, setCurrentLab] = useState('')
  const [labValue, setLabValue] = useState<number | ''>('')
  const [labEntries, setLabEntries] = useState<LabEntry[]>([])


  
  const handleLabAdd = () => {
    if (!currentLab || !labValue) {
      alert("Enter a time and lab")
      return
    }

    const totalMinutesOffset = (days || 0) * 24 * 60 + (hours || 0) * 60 + (minutes || 0);

    const newEntry: LabEntry = {
      timeOffset: totalMinutesOffset,
      labName: currentLab,
      value: labValue,
    };

    const existingEntryIndex = labEntries.findIndex(
      (entry) =>
        entry.timeOffset === totalMinutesOffset && entry.labName === currentLab
    );

    if (existingEntryIndex !== -1) {
      setLabEntries((prev) =>
        prev.map((entry, index) =>
          index === existingEntryIndex ? newEntry : entry
        )
      );
    } else {
      setLabEntries((prev) => [...prev, newEntry]);
    }
    setCurrentLab('')
    setLabValue('')
  }

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
  

  return ( 
    <div className="grid grid-cols-[300px_auto] w-full p-4 gap-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Labs</h1>
        <div>
          <div className="flex items-center gap-2 pb-2">
            <p className="font-medium ">Time Offset</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMarkIcon size={20} color='#52525c' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Amount of time before the start of simulation the lab will display</p>
              </TooltipContent>
            </Tooltip>

          </div>
          
          <div className="flex gap-10">
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
          </div>
        </div>
        <div>
          <Label className="mb-1">Lab Type</Label>
          <Combobox value={currentLab} onValueChange={setCurrentLab} displayText="Select a lab" data={labOptions}/>
        </div>
        <div>
          <Label>Lab Value</Label>
          <Input className="w-40 mt-1" onChange={(e) => handleTimeChange(e, setLabValue)} value={labValue} type='number'/>
        </div>
        <div className="flex w-full justify-center">
          <Button onClick={handleLabAdd}>
            <p>Add Lab</p>
          </Button>
        </div>
      </div>
      <div className="pt-12">
        <h3 className="font-semibold underline">Added Labs</h3>
        <div className="grid grid-cols-1 gap-1 pl-4">
          {labEntries.length === 0 ? (
            <p className="text-muted-foreground">No labs added yet.</p>
          ) : (
            labEntries
              .sort((a, b) => a.timeOffset - b.timeOffset)
              .map((entry, index) => (
                <div key={index} className="text-sm">
                  <strong>{entry.labName}:</strong> {entry.value} (@{" "}
                  {entry.timeOffset} min)
                </div>
              ))
          )}
        </div>
      </div>
    </div>

  )
}