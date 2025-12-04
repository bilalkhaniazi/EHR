import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronDown, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { relationshipStatuses, precautions, months, codeStatuses, days, insuranceOptions } from "@/utils/form";
import { Checkbox } from "@/components/ui/checkbox";


export default function Review() {



  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">

      <header className="sticky top-0 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-slate-400" />
            Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 10 of 9: Basic identification and admission details</p>
        </div>
      </header>

      <div className="w-full md:px-16 xl:px-24">
        <Card className="border-slate-200 shadow-sm pt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Demographics
            </CardTitle>
            <CardDescription>Core patient information.</CardDescription>
          </CardHeader>
          <CardContent>

            <div className="space-y-2">
              <Label htmlFor="firstName">Case Summary</Label>
              <Textarea
                // value={}
                // onChange={}
                name="summary"
                placeholder="No summary recorded"
                className="min-h-[100px] bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input required id="firstName" name="firstName" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input required id="lastName" name="lastName" placeholder="Doe" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Date of Birth</Label>
                <div className="flex gap-2">
                  <Select required name="DOBMonth">
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Month" />
                      <ChevronDown />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => <SelectItem key={i} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select required name="DOBDay">
                    <SelectTrigger className="w-[80px] bg-white"><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>
                      {days.map((d, i) => <SelectItem key={i} value={d.toString()}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative">
                  <Input required id="age" name="age" type="number" className="pr-12" />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">y.o.</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeStatus">Code Status</Label>
              <Select required name="codeStatus">
                <SelectTrigger className="bg-white w-fit">
                  <SelectValue placeholder="Select..." />
                  <ChevronDown />
                </SelectTrigger>
                <SelectContent>
                  {codeStatuses.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input required name="heightFeet" type="number" className="pr-8" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <Input required name="heightInches" type="number" className="pr-8" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">in</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosingWeight">Dosing Weight</Label>
                  <div className="relative">
                    <Input required id="dosingWeight" name="dosingWeight" type="number" className="pr-8" />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precautions">Isolation Precautions</Label>
                <Select required name="precautions">
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select..." />
                    <ChevronDown />

                  </SelectTrigger>
                  <SelectContent>
                    {precautions.map((p, i) => <SelectItem key={i} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input required id="language" name="language" placeholder="e.g. English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance</Label>
                <Select required name="insurance">
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
                <Input required id="employment" name="employment" placeholder="Occupation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipStatus">Relationship</Label>
                <Select required name="relationshipStatus">
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
                <Input required id="religion" name="religion" placeholder="Optional" />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox id="needsInterpreter" name="needsInterpreter" />
                <Label htmlFor="needsInterpreter" className="font-normal text-slate-600">Needs Interpreter</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}