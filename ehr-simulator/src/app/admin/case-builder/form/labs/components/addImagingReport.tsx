'use client'

import { ImagingData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react"


interface AddImagingProps {
  imagingType: string
  handleAddImagingReport: (report: ImagingData) => void;
  initialData?: ImagingData;
}

interface Finding {
  region: string;
  description: string;
}

const AddImagingReport = ({ imagingType, handleAddImagingReport, initialData }: AddImagingProps) => {
  const isEditMode = !!initialData;
  const [technique, setTechnique] = useState(initialData?.technique || '')
  const [findings, setFindings] = useState<Finding[]>(initialData?.findings || [])
  const [impressions, setImpressions] = useState<string[]>(initialData?.impressions || [])
  const [isCritical, setIsCritical] = useState<'indeterminate' | boolean>(initialData?.isCritical || false)

  const [region, setRegion] = useState('')
  const [description, setDescription] = useState('')
  const [impression, setImpression] = useState<string>('')

  const newEntry = {
    displayName: imagingType,
    technique: technique,
    findings: findings,
    impressions: impressions,
    isCritical: isCritical
  }

  const isSubmittable =
    !!imagingType &&
    !!technique &&
    findings.length > 0 &&
    impressions.length > 0;

  const handleAddFinding = () => {
    if (!description || !region) {
      alert("Enter a region and finding")
      return
    }
    const finding: Finding = { region: region, description: description }

    setFindings(prev => [...prev, finding])
    setRegion('')
    setDescription('')
  }

  const handleAddImpression = () => {
    if (!impression) {
      alert('Impression cannot be empty')
    }
    setImpressions(prev => [...prev, impression])
    setImpression('')
  }

  const handleRemoveFinding = (index: number) => {
    setFindings(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveImpression = (index: number) => {
    setImpressions(prev => prev.filter((_, i) => i !== index))
  }


  const handleSubmit = () => {
    handleAddImagingReport(newEntry)
  }


  return (
    <DialogContent className="flex flex-col sm:max-w-150 lg:max-w-none w-250 h-full max-h-9/10 overflow-hidden">
      <h1 className="text-3xl tracking-tight font-semibold pb-2">
        {isEditMode ? "Edit Imaging" : "Imaging"}
      </h1>
      <Button disabled={!isSubmittable} onClick={handleSubmit} type='button' className="absolute top-6 right-16">
        {isEditMode ? 'Update Imaging' : 'Add Imaging'}
      </Button>
      <div className="flex-1 flex flex-col w-full overflow-y-auto space-y-4 p-4 border rounded-lg">
        <div>
          <Label className="mb-1" htmlFor="technique">Technique</Label>
          <Textarea id='technique' value={technique} onChange={(e) => setTechnique(e.target.value)} />
        </div>

        <fieldset className="border px-4 py-2 rounded w-full space-y-4">
          <legend>Findings</legend>
          <div>
            <Label>Body Region</Label>
            <Input onChange={(e) => setRegion(e.target.value)} value={region} className="w-60 mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Input onChange={(e) => setDescription(e.target.value)} value={description} className="mt-1" />
          </div>
          <Button onClick={handleAddFinding}>Add Finding</Button>

          <div>
            {findings.map((finding, index) =>
              <div key={index} className="flex gap-3 text-sm">
                <p className="font-medium text-nowrap">{finding.region}: </p>
                <p>{finding.description}</p>
                <Button onClick={() => handleRemoveFinding(index)} variant="outline" className="rounded-full size-4 p-3">X</Button>
              </div>
            )}
          </div>
        </fieldset >

        <fieldset className="border px-4 py-2 rounded w-full space-y-4">
          <legend>Impressions</legend>
          <Label className="mb-1" htmlFor="impressions">Description</Label>
          <Textarea value={impression} onChange={(e) => setImpression(e.target.value)} id="impressons" />
          <Button onClick={handleAddImpression}>
            <p>Add Impression</p>
          </Button>
          <div>
            {impressions.map((item, index) =>
              <div key={index} className="flex gap-3 text-sm">
                <p>{item}</p>
                <Button onClick={() => handleRemoveImpression(index)} variant="outline" className="rounded-full size-4 p-3">X</Button>
              </div>
            )}
          </div>
        </fieldset>
        <div className="flex items-center gap-4 ml-2">
          <p>Mark as critical or abnormal finding?</p>
          <Checkbox checked={isCritical} onCheckedChange={setIsCritical} className="border-gray-300" />
        </div>
      </div>

    </DialogContent>
  )
}

export default AddImagingReport

