"use client"
import {
  User,
  FileText,
  Ruler,
  Briefcase,
  Building2,
  Clock,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InfoTooltip from "../../components/helpTooltip";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { relationshipStatuses, precautions, months, codeStatuses, days, insuranceOptions, DemographicFormData } from "@/utils/form";
import { useState } from "react";
import { useFormContext } from "@/context/FormContext";

export default function DemographicsForm() {
  const { onDataChange, demographicData: initialData } = useFormContext();
  const [demographicsData, setDemographicsData] = useState<DemographicFormData>(initialData);
  const router = useRouter();

  const handleSubmit = () => {
    onDataChange("demographics", demographicsData)
    router.push("/admin/case-builder/form/history");
  }

  const limits = {
    minAge: 0, maxAge: 120,
    minDay: 1, maxDay: 31,
    minKilograms: 0, maxKilograms: 999,
    minFeet: 0, maxFeet: 8,
    minInches: 0, maxInches: 11,
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">

      <header className="sticky top-0 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-slate-400" />
            Patient Demographics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 1 of 9: Basic identification and admission details</p>
        </div>
      </header>

      <div className="flex-1 p-6 md:px-12 lg:px-24">
        <div id="demo-form" className="max-w-6xl mx-auto space-y-6 pb-20">
          <div className="fixed top-6 right-8 z-10">
            <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
          </div>
          <Card className="border-slate-200 shadow-sm pt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Case Overview
              </CardTitle>
              <CardDescription>Brief description of the patient scenario.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={demographicsData.summary}
                onChange={(e) => { setDemographicsData({ ...demographicsData, ["summary"]: e.target.value }) }}
                required
                name="summary"
                placeholder="e.g. 68-year-old male admitted with shortness of breath..."
                className="min-h-[100px] bg-white"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">

            {/* SECTION 2: Personal Info */}
            <Card className="border-slate-200 shadow-sm h-fit pt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      required
                      id="firstName"
                      name="firstName"
                      placeholder="Jane"
                      onChange={(e) => { setDemographicsData({ ...demographicsData, ["firstName"]: e.target.value }) }}
                      value={demographicsData.firstName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      required
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      onChange={(e) => { setDemographicsData({ ...demographicsData, ["lastName"]: e.target.value }) }}
                      value={demographicsData.lastName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Date of Birth</Label>
                    <div className="flex gap-2">
                      <Select
                        required
                        name="DOBMonth"
                        onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["DOBMonth"]: value }) }}
                        value={demographicsData.DOBMonth}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Month" />
                          <ChevronDown />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m, i) => <SelectItem key={i} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select
                        required
                        name="DOBDay"
                        onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["DOBDay"]: value }) }}
                        value={demographicsData.DOBDay}
                      >
                        <SelectTrigger className="w-[80px] bg-white"><SelectValue placeholder="Day" />
                          <ChevronDown />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((d, i) => <SelectItem key={i} value={d.toString()}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <div className="relative">
                      <Input
                        onChange={(e) => { setDemographicsData({ ...demographicsData, ["age"]: e.target.value }) }}
                        required
                        id="age"
                        name="age"
                        type="number"
                        min={limits.minAge}
                        max={limits.maxAge}
                        className="pr-12"
                        value={demographicsData.age}
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">y.o.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codeStatus">Code Status</Label>
                  <Select
                    required
                    name="codeStatus"
                    onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["codeStatus"]: value }) }}
                    value={demographicsData.codeStatus}
                  >
                    <SelectTrigger className="bg-white w-fit">
                      <SelectValue placeholder="Select..." />
                      <ChevronDown />

                    </SelectTrigger>
                    <SelectContent>
                      {codeStatuses.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: Clinical & Social */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm pt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-blue-600" />
                    Physical Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            required
                            name="heightFeet"
                            type="number"
                            min={limits.minFeet}
                            max={limits.maxFeet}
                            className="pr-8"
                            onChange={(e) => { setDemographicsData({ ...demographicsData, ["heightFeet"]: e.target.value }) }}
                            value={demographicsData.heightFeet}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400">ft</span>
                        </div>
                        <div className="relative flex-1">
                          <Input
                            required
                            name="heightInches"
                            type="number"
                            min={limits.minInches}
                            max={limits.maxInches}
                            className="pr-8"
                            onChange={(e) => { setDemographicsData({ ...demographicsData, ["heightInches"]: e.target.value }) }}
                            value={demographicsData.heightInches}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400">in</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosingWeight">Dosing Weight</Label>
                      <div className="relative">
                        <Input
                          required
                          id="dosingWeight"
                          name="dosingWeight"
                          type="number"
                          min={limits.minKilograms}
                          max={limits.maxKilograms}
                          className="pr-8"
                          onChange={(e) => { setDemographicsData({ ...demographicsData, ["dosingWeight"]: e.target.value }) }}
                          value={demographicsData.dosingWeight}
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precautions">Isolation Precautions</Label>
                    <Select
                      required
                      name="precautions"
                      onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["precautions"]: value }) }}
                      value={demographicsData.precautions}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select..." />
                        <ChevronDown />
                      </SelectTrigger>
                      <SelectContent>
                        {precautions.map((p, i) => <SelectItem key={i} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm pt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Social Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input
                        required
                        id="language"
                        name="language"
                        placeholder="e.g. English"
                        onChange={(e) => { setDemographicsData({ ...demographicsData, ["language"]: e.target.value }) }}
                        value={demographicsData.language}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance</Label>
                      <Select
                        required
                        name="insurance"
                        onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["insurance"]: value }) }}
                        value={demographicsData.insurance}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select..." />
                          <ChevronDown />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceOptions.map((o, i) => <SelectItem key={i} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employment">Employment</Label>
                      <Input
                        required
                        id="employment"
                        name="employment"
                        placeholder="Occupation"
                        onChange={(e) => { setDemographicsData({ ...demographicsData, ["employment"]: e.target.value }) }}
                        value={demographicsData.employment}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationshipStatus">Relationship</Label>
                      <Select
                        required
                        name="relationshipStatus"
                        onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["relationshipStatus"]: value }) }}
                        value={demographicsData.relationshipStatus}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select..." />
                          <ChevronDown />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipStatuses.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="religion">Religion</Label>
                      <Input
                        required
                        id="religion"
                        name="religion"
                        placeholder=""
                        onChange={(e) => { setDemographicsData({ ...demographicsData, ["religion"]: e.target.value }) }}
                        value={demographicsData.religion}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id="needsInterpreter"
                        name="needsInterpreter"
                        defaultChecked={false}
                        onCheckedChange={(value) => { setDemographicsData({ ...demographicsData, ["needsInterpreter"]: typeof value === 'boolean' ? value : false }) }}
                        checked={demographicsData.needsInterpreter}
                      />
                      <Label htmlFor="needsInterpreter" className="font-normal text-slate-600">Needs Interpreter</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SECTION 4: Admission Details */}
          <Card className="border-slate-200 shadow-sm pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Admission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admittingDiagnosis">Admitting Diagnosis</Label>
                <Input
                  required
                  id="admittingDiagnosis"
                  name="admittingDiagnosis"
                  placeholder="e.g. Acute Appendicitis"
                  onChange={(e) => { setDemographicsData({ ...demographicsData, ["admittingDiagnosis"]: e.target.value }) }}
                  value={demographicsData.admittingDiagnosis}
                />
              </div>

              <div className="space-y-2">
                <Label>Attending Provider</Label>
                <div className="flex gap-2">
                  <Select
                    required
                    name="attendingProviderTitle"
                    onValueChange={(value) => { setDemographicsData({ ...demographicsData, ["attendingProviderTitle"]: value }) }}
                    value={demographicsData.attendingProviderTitle}
                  >
                    <SelectTrigger className="bg-white w-fit">
                      <SelectValue placeholder="Title" />
                      <ChevronDown />

                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MD">MD</SelectItem>
                      <SelectItem value="DO">DO</SelectItem>
                      <SelectItem value="NP">NP</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    required
                    name="attendingProviderName"
                    placeholder="First & Last Name"
                    className="flex-1"
                    onChange={(e) => { setDemographicsData({ ...demographicsData, ["attendingProviderName"]: e.target.value }) }}
                    value={demographicsData.attendingProviderName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Inpatient Duration
                  <InfoTooltip content="Number of days hospitalized BEFORE simulation start." />
                </Label>
                <div className="relative max-w-[180px]">
                  <Input
                    required
                    min={0}
                    name="admissionDateOffest"
                    type="number"
                    className="pr-12"
                    onChange={(e) => { setDemographicsData({ ...demographicsData, ["admissionDateOffest"]: e.target.value }) }}
                    value={demographicsData.admissionDateOffest}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">days</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionTime">Time of Admission</Label>
                <div className="relative max-w-[180px]">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    required
                    name="admissionTime"
                    id="admissionTime"
                    type="time"
                    className="pl-10"
                    onChange={(e) => { setDemographicsData({ ...demographicsData, ["admissionTime"]: e.target.value }) }}
                    value={demographicsData.admissionTime}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}