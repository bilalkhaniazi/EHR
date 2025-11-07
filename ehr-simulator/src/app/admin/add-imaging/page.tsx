'use client'

import { ImagingData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react"

// export const imagingOptions = [
//   // --- CT (Computed Tomography) ---
//   { value: "CT Head w/o Contrast", label: "CT Head w/o Contrast" },
//   { value: "CT Head w/ Contrast", label: "CT Head w/ Contrast" },
//   { value: "CT Neck w/ Contrast", label: "CT Neck w/ Contrast" },
//   { value: "CT Orbits w/o Contrast", label: "CT Orbits w/o Contrast" },
//   { value: "CT Sinuses w/o Contrast", label: "CT Sinuses w/o Contrast" },
//   { value: "CT Chest w/ Contrast", label: "CT Chest w/ Contrast" },
//   { value: "CT Chest w/o Contrast", label: "CT Chest w/o Contrast" },
//   { value: "CT Abdomen/Pelvis w/o Contrast", label: "CT Abdomen/Pelvis w/o Contrast" },
//   { value: "CT Abdomen/Pelvis w/ Contrast", label: "CT Abdomen/Pelvis w/ Contrast" },
//   { value: "CT C-Spine", label: "CT C-Spine" },
//   { value: "CT T-Spine", label: "CT T-Spine" },
//   { value: "CT L-Spine", label: "CT L-Spine" },
//   { value: "CT R. Foot", label: "CT R. Foot" },
//   { value: "CT L. Foot", label: "CT L. Foot" },
//   { value: "CT R. Ankle", label: "CT R. Ankle" },
//   { value: "CT L. Ankle", label: "CT L. Ankle" },
//   { value: "CT R. Knee", label: "CT R. Knee" },
//   { value: "CT L. Knee", label: "CT L. Knee" },

//   // --- MRI (Magnetic Resonance Imaging) ---
//   { value: "MRI Brain w/o Contrast", label: "MRI Brain w/o Contrast" },
//   { value: "MRI Brain w/ and w/o Contrast", label: "MRI Brain w/ and w/o Contrast" },
//   { value: "MRI C-Spine", label: "MRI C-Spine" },
//   { value: "MRI T-Spine", label: "MRI T-Spine" },
//   { value: "MRI L-Spine", label: "MRI L-Spine" },
//   { value: "MRI R. Shoulder", label: "MRI R. Shoulder" },
//   { value: "MRI L. Shoulder", label: "MRI L. Shoulder" },
//   { value: "MRI R. Knee", label: "MRI R. Knee" },
//   { value: "MRI L. Knee", label: "MRI L. Knee" },
//   { value: "MRI Abdomen w/ and w/o Contrast", label: "MRI Abdomen w/ and w/o Contrast" },

//   // --- US (Ultrasound) ---
//   { value: "US Renal", label: "US Renal" },
//   { value: "US RUQ (Gallbladder/Liver)", label: "US RUQ (Gallbladder/Liver)" },
//   { value: "US Appendix", label: "US Appendix" },
//   { value: "US Pelvic", label: "US Pelvic" },
//   { value: "US Scrotal", label: "US Scrotal" },
//   { value: "US Thyroid", label: "US Thyroid" },
//   { value: "US Carotid Doppler", label: "US Carotid Doppler" },
//   { value: "US Venous Doppler Bil. U/E", label: "US Venous Doppler Bil. U/E" },
//   { value: "US Venous Doppler Bil. L/E ", label: "US Venous Doppler Bil. L/E " },
//   { value: "US Echocardiogram (TTE)", label: "US Echocardiogram (TTE)" },
//   { value: "US Echocardiogram (TEE)", label: "US Echocardiogram (TEE)" },

//   // --- XR (X-Ray) ---
//   { value: "XR Chest", label: "XR Chest" },
//   { value: "XR Abdomen", label: "XR Abdomen" },
//   { value: "XR C-Spine", label: "XR C-Spine" },
//   { value: "XR T-Spine", label: "XR T-Spine" },
//   { value: "XR L-Spine", label: "XR L-Spine" },
//   { value: "XR R. Shoulder", label: "XR R. Shoulder" },
//   { value: "XR L. Shoulder", label: 'Two L. Shoulder' },
//   { value: "XR R. Clavicle", label: "XR R. Clavicle" },
//   { value: "XR L. Clavicle", label: "XR L. Clavicle" },
//   { value: "XR R. Humerus", label: "XR R. Humerus" },
//   { value: "XR L. Humerus", label: "XR L. Humerus" },
//   { value: "XR R. Elbow", label: "XR R. Elbow" },
//   { value: "XR L. Elbow", label: "XR L. Elbow" },
//   { value: "XR R. Forearm", label: "XR R. Forearm" },
//   { value: "XR L. Forearm", label: "XR L. Forearm" },
//   { value: "XR R. Wrist", label: "XR R. Wrist" },
//   { value: "XR L. Wrist", label: "XR L. Wrist" },
//   { value: "XR R. Hand", label: "XR R. Hand" },
//   { value: "XR L. Hand", label: "XR L. Hand" },
//   { value: "XR Pelvis", label: "XR Pelvis" },
//   { value: "XR R. Hip", label: "XR R. Hip" },
//   { value: "XR L. Hip", label: "XR L. Hip" },
//   { value: "XR R. Femur", label: "XR R. Femur" },
//   { value: "XR L. Femur", label: "XR L. Femur" },
//   { value: "XR R. Knee", label: "XR R. Knee" },
//   { value: "XR L. Knee", label: "XR L. Knee" },
//   { value: "XR R. Tib/Fib", label: "XR R. Tib/Fib" },
//   { value: "XR L. Tib/Fib", label: "XR L. Tib/Fib" },
//   { value: "XR R. Ankle", label: "XR R. Ankle" },
//   { value: "XR L. Ankle", label: "XR L. Ankle" },
//   { value: "XR R. Foot", label: "XR R. Foot" },
//   { value: "XR L. Foot", label: "XR L. Foot" },
// ];
interface AddImagingProps {
  imagingType: string
  handleAddImagingReport: (report: ImagingData) => void;
  initialData?: ImagingData;
}

interface Finding {
  region: string;
  description: string;
}

interface Image {
  imagingType: string;
  technique: string;
  findings: Finding[];
  impressions: string[];
  timeOffset: number;
}

const AddImaging = ({ imagingType, handleAddImagingReport, initialData }: AddImagingProps) => {
  const isEditMode = !!initialData;
  const [technique, setTechnique] = useState(initialData?.technique || '')
  const [findings, setFindings] = useState<Finding[]>(initialData?.findings || [])
  const [impressions, setImpressions] = useState<string[]>(initialData?.impressions || [])

  const [region, setRegion] = useState('')
  const [description, setDescription] = useState('')
  const [impression, setImpression] = useState<string>('')

  const newEntry = {
    displayName: imagingType,
    technique: technique,
    findings: findings,
    impressions: impressions,
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
    <div className="w-full p-4 space-y-4">
      <h1 className="text-4xl">Imaging</h1>
      {/* <div>
        <Label>Imaging Type</Label>
        <Combobox onValueChange={setImagingType} value={imagingType} displayText="Select imaging" data={imagingOptions}></Combobox>
      </div> */}
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
            <div key={index} className="flex gap-3">
              <p key={index}>{finding.region}: {finding.description}</p>
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
            <div key={index} className="flex gap-3">
              <p>{item}</p>
              <Button onClick={() => handleRemoveImpression(index)} variant="outline" className="rounded-full size-4 p-3">X</Button>
            </div>
          )}
        </div>
      </fieldset>
      <Button onClick={handleSubmit} disabled={!isSubmittable}>Submit Imaging</Button>
    </div>
  )
}

export default AddImaging


// { labName: "CT R. Foot",
//   value: {
//     displayName: "CT OF THE RIGHT FOOT",
//     technique: "Non-contrast axial and sagittal CT images of the right foot were obtained. Multiplanar reconstructions performed.",
//     findings: {
//       "Soft Tissue": "There is a focal soft tissue defect overlying the plantar aspect of the right forefoot, measuring approximately 2.8 cm in diameter, with surrounding subcutaneous fat stranding and mild edema.",
//       "Bone Structures": "Cortical irregularity and erosion noted involving the underlying second and third metatarsal heads. Trabecular sclerosis and decreased attenuation suggest early osteomyelitic changes. No definitive intraosseous gas observed.",
//       "Joints": "Mild degenerative changes at the tarsometatarsal joints. No joint effusion",
//       "Vascularity": "Posterior tibial artery calcifications consistent with peripheral vascular disease."
//     },
//     impression: [
//       "Soft tissue ulceration of the right plantar forefoot with adjacent inflammatory changes.",
//       "Findings suggestive of early osteomyelitis involving the second and third metatarsal heads.",
//       "Peripheral vascular calcifications likely related to underlying diabetes."
//     ]
//   }
// },