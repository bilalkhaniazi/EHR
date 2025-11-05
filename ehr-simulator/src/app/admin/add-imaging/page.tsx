'use client'

import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react"

const imagingOptions = [
  // --- CT (Computed Tomography) ---
  { value: "CT Head w/o Contrast", label: "CT Head w/o Contrast" },
  { value: "CT Head w/ Contrast", label: "CT Head w/ Contrast" },
  { value: "CT Head w/ and w/o Contrast", label: "CT Head w/ and w/o Contrast" },
  { value: "CT Neck w/ Contrast", label: "CT Neck w/ Contrast" },
  { value: "CT Orbits w/o Contrast", label: "CT Orbits w/o Contrast" },
  { value: "CT Sinuses w/o Contrast", label: "CT Sinuses w/o Contrast" },
  { value: "CT Chest w/ Contrast (PE Protocol)", label: "CT Chest w/ Contrast (PE Protocol)" },
  { value: "CT Chest w/o Contrast", label: "CT Chest w/o Contrast" },
  { value: "CT Abdomen/Pelvis w/o Contrast (Stone Protocol)", label: "CT Abdomen/Pelvis w/o Contrast (Stone Protocol)" },
  { value: "CT Abdomen/Pelvis w/ Contrast", label: "CT Abdomen/Pelvis w/ Contrast" },
  { value: "CT Abdomen/Pelvis w/ and w/o Contrast", label: "CT Abdomen/Pelvis w/ and w/o Contrast" },
  { value: "CT C-Spine w/o Contrast", label: "CT C-Spine w/o Contrast" },
  { value: "CT T-Spine w/o Contrast", label: "CT T-Spine w/o Contrast" },
  { value: "CT L-Spine w/o Contrast", label: "CT L-Spine w/o Contrast" },
  { value: "CT R. Foot", label: "CT R. Foot" },
  { value: "CT L. Foot", label: "CT L. Foot" },
  { value: "CT R. Ankle", label: "CT R. Ankle" },
  { value: "CT L. Ankle", label: "CT L. Ankle" },
  { value: "CT R. Knee", label: "CT R. Knee" },
  { value: "CT L. Knee", label: "CT L. Knee" },

  // --- MRI (Magnetic Resonance Imaging) ---
  { value: "MRI Brain w/o Contrast", label: "MRI Brain w/o Contrast" },
  { value: "MRI Brain w/ and w/o Contrast", label: "MRI Brain w/ and w/o Contrast" },
  { value: "MRI C-Spine w/o Contrast", label: "MRI C-Spine w/o Contrast" },
  { value: "MRI T-Spine w/o Contrast", label: "MRI T-Spine w/o Contrast" },
  { value: "MRI L-Spine w/o Contrast", label: "MRI L-Spine w/o Contrast" },
  { value: "MRI L-Spine w/ and w/o Contrast", label: "MRI L-Spine w/ and w/o Contrast" },
  { value: "MRI R. Shoulder w/o Contrast", label: "MRI R. Shoulder w/o Contrast" },
  { value: "MRI L. Shoulder w/o Contrast", label: "MRI L. Shoulder w/o Contrast" },
  { value: "MRI R. Knee w/o Contrast", label: "MRI R. Knee w/o Contrast" },
  { value: "MRI L. Knee w/o Contrast", label: "MRI L. Knee w/o Contrast" },
  { value: "MRI Abdomen w/ and w/o Contrast", label: "MRI Abdomen w/ and w/o Contrast" },

  // --- US (Ultrasound) ---
  { value: "US Renal", label: "US Renal" },
  { value: "US RUQ (Gallbladder/Liver)", label: "US RUQ (Gallbladder/Liver)" },
  { value: "US Appendix", label: "US Appendix" },
  { value: "US Pelvic (Transabdominal)", label: "US Pelvic (Transabdominal)" },
  { value: "US Pelvic (Transvaginal)", label: "US Pelvic (Transvaginal)" },
  { value: "US Scrotal", label: "US Scrotal" },
  { value: "US Thyroid", label: "US Thyroid" },
  { value: "US Carotid Doppler", label: "US Carotid Doppler" },
  { value: "US Venous Doppler R. U/E", label: "US Venous Doppler R. U/E" },
  { value: "US Venous Doppler L. U/E", label: "US Venous Doppler L. U/E" },
  { value: "US Venous Doppler R. L/E (DVT Study)", label: "US Venous Doppler R. L/E (DVT Study)" },
  { value: "US Venous Doppler L. L/E (DVT Study)", label: "US Venous Doppler L. L/E (DVT Study)" },
  { value: "US Echocardiogram (TTE)", label: "US Echocardiogram (TTE)" },
  { value: "US Echocardiogram (TEE)", label: "US Echocardiogram (TEE)" },

  // --- XR (X-Ray) ---
  { value: "XR Chest (PA & Lat)", label: "XR Chest (PA & Lat)" },
  { value: "XR Chest (1 View, Portable)", label: "XR Chest (1 View, Portable)" },
  { value: "XR Abdomen (KUB)", label: "XR Abdomen (KUB)" },
  { value: "XR Abdomen (Acute Series, 2 Views)", label: "XR Abdomen (Acute Series, 2 Views)" },
  { value: "XR C-Spine (3 Views)", label: "XR C-Spine (3 Views)" },
  { value: "XR T-Spine (2 Views)", label: "XR T-Spine (2 Views)" },
  { value: "XR L-Spine (2 Views)", label: "XR L-Spine (2 Views)" },
  { value: "XR R. Shoulder", label: "XR R. Shoulder" },
  { value: "XR L. Shoulder", label: 'Two L. Shoulder' },
  { value: "XR R. Clavicle", label: "XR R. Clavicle" },
  { value: "XR L. Clavicle", label: "XR L. Clavicle" },
  { value: "XR R. Humerus", label: "XR R. Humerus" },
  { value: "XR L. Humerus", label: "XR L. Humerus" },
  { value: "XR R. Elbow", label: "XR R. Elbow" },
  { value: "XR L. Elbow", label: "XR L. Elbow" },
  { value: "XR R. Forearm", label: "XR R. Forearm" },
  { value: "XR L. Forearm", label: "XR L. Forearm" },
  { value: "XR R. Wrist", label: "XR R. Wrist" },
  { value: "XR L. Wrist", label: "XR L. Wrist" },
  { value: "XR R. Hand", label: "XR R. Hand" },
  { value: "XR L. Hand", label: "XR L. Hand" },
  { value: "XR Pelvis", label: "XR Pelvis" },
  { value: "XR R. Hip", label: "XR R. Hip" },
  { value: "XR L. Hip", label: "XR L. Hip" },
  { value: "XR R. Femur", label: "XR R. Femur" },
  { value: "XR L. Femur", label: "XR L. Femur" },
  { value: "XR R. Knee", label: "XR R. Knee" },
  { value: "XR L. Knee", label: "XR L. Knee" },
  { value: "XR R. Tib/Fib", label: "XR R. Tib/Fib" },
  { value: "XR L. Tib/Fib", label: "XR L. Tib/Fib" },
  { value: "XR R. Ankle", label: "XR R. Ankle" },
  { value: "XR L. Ankle", label: "XR L. Ankle" },
  { value: "XR R. Foot", label: "XR R. Foot" },
  { value: "XR L. Foot", label: "XR L. Foot" },
];

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

const AddImaging = () => {
  const [imagingType, setImagingType] = useState('')
  const [technique, setTechnique] = useState('')
  const [region, setRegion] = useState('')
  const [description, setDescription] = useState('')
  const [findings, setFindings] = useState<Finding[]>([])
  const [impression, setImpression] = useState<string>('')
  const [impressions, setImpressions] = useState<string[]>([])
  const [allEntries, setAllEntries] = useState<Image[]>([])
  
  const [days, setDays] = useState<number | ''>('')
  const [hours, setHours] = useState<number | ''>('')
  const [minutes, setMinutes] = useState<number | ''>('')

  const totalMinutesOffset = (days || 0) * 24 * 60 + (hours || 0) * 60 + (minutes || 0);


  const newEntry = {
    imagingType: imagingType,
    technique: technique,
    findings: findings,
    impressions: impressions,
    timeOffset: totalMinutesOffset
  }

  const isSubmittable =
    (days || hours || minutes) &&
    !!imagingType &&
    !!technique &&
    findings.length > 0 &&
    impressions.length > 0;

  const handleAddFinding = () => {
    if (!description || !region) {
      alert("Enter a region and finding")
      return
    }
    const finding: Finding = {region: region, description: description}

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

  const handleSubmit = () => {
    setAllEntries(prev => ([...prev, newEntry]))
    setHours('')
    setDays('')
    setMinutes('')
    setDescription('')
    setFindings([])
    setImpression('')
    setTechnique('')
    setImpressions([])
  }


  return (
    <div className="w-full p-4 space-y-4">
      <h1 className="text-4xl">Imaging</h1>
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
        <Label>Imaging Type</Label>
        <Combobox  onValueChange={setImagingType} value={imagingType} displayText="Select imaging" data={imagingOptions}></Combobox>
      </div>
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
              <div className="flex gap-3"> 
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
            <div className="flex gap-3" key={index}>
              <p>{item}</p>
              <Button onClick={() => handleRemoveImpression(index) } variant="outline" className="rounded-full size-4 p-3">X</Button>
            </div>
            )}
        </div>      
      </fieldset>
      <Button onClick={handleSubmit} disabled={!isSubmittable}>Submit Imaging</Button>
      <p>Image Count: {allEntries.length}</p>
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