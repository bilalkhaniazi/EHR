"use client"
import { Card } from "@/components/ui/card"

import InfoTooltip from "../../components/helpTooltip";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { relationshipStatuses, precautions, months, codeStatuses, days, insuranceOptions } from "@/utils/form";

const limits = {
  minAge: 0,
  maxAge: 120,

  minDay: 1,
  maxDay: 31,

  minKilograms: 0,
  maxKilograms: 999,

  minFeet: 0,
  maxFeet: 8,

  minInches: 0,
  maxInches: 11,
}

const DemographicsForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    router.push("/admin/case-builder/form/history");
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
      <Card className="h-fit relative">
        <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
          <div className="w-full flex flex-col gap-3 p-2">

            <p className="m-2 ml-0 text-2xl font-bold">Case Summary</p>

            <label htmlFor="summary">Please enter a brief summary of the case:</label>
            <textarea required rows={3} placeholder="Enter text..." name="summary" id="summary" className="case-form-textarea"></textarea>

            <br />
            <hr />

            <p className="m-2 ml-0 text-2xl font-bold">Patient Demographics</p>

            <div className="flex">
              <label className="case-form-label" htmlFor="firstName">First Name: </label>
              <input
                id="firstName" name="firstName" required
                className="case-form-input-text shadow-xs rounded-lg"
                type="text" placeholder="First Name"
              />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="lastName">Last Name: </label>
              <input
                id="lastName" name="lastName" required
                className="case-form-input-text"
                type="text" placeholder="Last Name"
              />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="MRN">Medical Record Number: </label>
              <input
                id="MRN" name="MRN" required
                className="case-form-input-text"
                type="text" placeholder="MRN"
              />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="codeStatus">Code Status: </label>
              <select required defaultValue="" id="codeStatus" name="codeStatus" className="case-form-select" >
                <option disabled hidden value="">Select status...</option>
                {codeStatuses.map((status, index) => (
                  <option value={status} key={index}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="DOBMonth">Date of Birth: </label>
              <select required id="DOBMonth" name="DOBMonth" defaultValue="" className="mr-2 case-form-select" >
                <option value="" disabled hidden>Month...</option>
                {/* Validate, e.g. September 31 isn't real */}
                {months.map((month, index) => (
                  <option value={month} key={index}>{month}</option>
                ))}
              </select>

              <select required defaultValue="" id="DOBDay" name="DOBDay" className="case-form-select">
                <option value="" disabled hidden>Day...</option>
                {days.map((day, index) => (
                  <option value={day} key={index}>{day}</option>
                ))}
              </select>
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="age">Age: </label>
              <input
                required id="age" name="age"
                min={limits.minAge} max={limits.maxAge}
                placeholder="yrs" className="case-form-input-number" type="number" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="language">Primary Language: </label>
              <input required id="language" name="language" className="case-form-input-text" placeholder="Language" type="text" />
            </div>

            <div className="flex items-baseline">
              <label className="case-form-label" htmlFor="needsInterpreter">Interpreter Needed:</label>
              <input id="needsInterpreter" name="needsInterpreter" type="checkbox" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="relationshipStatus">Relationship Status: </label>
              <select required defaultValue="" id="relationshipStatus" name="relationshipStatus" className="case-form-select" >
                <option disabled hidden value="">Select status...</option>
                {relationshipStatuses.map((status, index) => (
                  <option value={status} key={index}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="employment">Employment: </label>
              <input required placeholder="Employment" type="text" name="employment" className="case-form-input-text" />
            </div>

            <div className="flex">
              <label htmlFor="religion" className="case-form-label">Religion: </label>
              <input required placeholder="Religion" className="case-form-input-text" type="text" name="religion" id="religion" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="heightFeet">Height: </label>
              <input
                id="heightFeet" name="heightFeet"
                min={limits.minFeet} max={limits.maxFeet}
                required placeholder="ft" className="mr-2 case-form-input-number" type="number" />

              <input
                id="heightInches" name="heightInches"
                min={limits.minInches} max={limits.maxInches}
                required placeholder="in" className="case-form-input-number" type="number" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="dosingWeight">Dosing Weight: </label>
              <input
                id="dosingWeight" name="dosingWeight"
                min={limits.minKilograms} max={limits.maxKilograms}
                required placeholder="kg" className="case-form-input-number" type="number" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="precautions">Precautions:</label>
              <select required id="precautions" name="precautions" defaultValue="" className="case-form-select">
                <option value="" hidden disabled>Select...</option>
                {precautions.map((precaution, index) => (
                  <option value={precaution} key={index}>{precaution}</option>
                ))}
              </select>
            </div>

            <div className="flex">
              <label htmlFor="insurance" className="case-form-label">Insurance</label>
              <select required defaultValue="" name="insurance" id="insurance" className="case-form-select">
                <option value="" hidden disabled>Select...</option>
                {insuranceOptions.map((option, index) => (
                  <option value={option} key={index}>{option}</option>
                ))}

              </select>
            </div>

            <br />
            <hr />

            <p className="m-2 ml-0 text-2xl font-bold">Admission Details</p>

            <div className="flex">
              <label htmlFor="admissionDateOffest" className="case-form-label">Duration of Inpatient Stay: </label>
              <input required min={0} placeholder="days" name="admissionDateOffest" id="admissionDateOffest" type="number" className="mr-2 case-form-input-number" />
              <InfoTooltip
                content={
                  "The number of days before the start of the simulation that the patient has been hospitalized. Enter zero (0) if the date of admission is the day of the simulation."
                } />
            </div>

            <div className="flex">
              <label htmlFor="admissionTime" className="case-form-label">Time of Admission:</label>
              <input required defaultValue={"00:00"} className="w-26 border-1 pl-1 pr-1 rounded-lg shadow-xs" name="admissionTime" id="admissionTime" type="time" />
            </div>

            <div className="flex">
              <label className="case-form-label" htmlFor="admittingDiagnosis">Admitting Diagnosis: </label>
              <input required name="admittingDiagnosis" id="admittingDiagnosis" placeholder="Diagnosis" className="case-form-input-text" type="text" />
            </div>

            {/* <div className="flex">
              <label className="case-form-label" htmlFor="admissionReason">Reason for Admission: </label>
              <input name="admissionReason" id="admissionReason" placeholder="Reason" className="case-form-input-text" type="text" />
            </div> */}

            <div className="flex">
              <label className="case-form-label" htmlFor="attendingProviderName">Attending Provider: </label>
              <select required name="attendingProviderTitle" id="attendingProviderTitle" defaultValue="" className="mr-2 case-form-select">
                <option value="" hidden disabled>Title</option>
                <option value="NP">NP</option>
                <option value="PA">PA</option>
                <option value="MD">MD</option>
                <option value="DO">DO</option>
              </select>
              <input required name="attendingProviderName" id="attendingProviderName" placeholder="Name" className="case-form-input-text" type="text" />
            </div>
            <div className="absolute top-8 right-8">
              <SubmitButton buttonText="Continue" />
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default DemographicsForm