"use client"
import { useState } from "react";
import MultipleTextInput from "../../multipleTextInput";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Info } from "lucide-react"



const DemographicsForm = () => {

  const limits = {
    minAge: 0,
    maxAge: 99,

    minDay: 1,
    maxDay: 31,

    minKilograms: 0,
    maxKilograms: 999,

    minFeet: 0,
    maxFeet: 8,

    minInches: 0,
    maxInches: 11,
  }

  const [allergies, setAllergies] = useState<string[]>([]);

  return (
    <>
      {/* make sure inputs have the 'required' attribute if needed */}
      <p className="m-2 mb-4 ml-0 text-2xl font-bold">Patient Demographics</p>

      <div className="flex">
        <label className="case-form-label" htmlFor="firstName">First Name: </label>
        <input
          id="firstName" name="firstName" required
          className="case-form-input-text"
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
        <select id="codeStatus" name="codeStatus" className="case-form-select" >
          <option value="full">Full</option>
          <option value="DNR">DNR</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="DOBMonth">Date of Birth: </label>
        <select id="DOBMonth" name="DOBMonth" defaultValue="" className="case-form-select" >
          <option value="" disabled hidden>Month</option>
          {/* Change month values to numbers??? */}
          {/* Validate, e.g. September 31 isn't real */}
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        &nbsp;&nbsp;
        <input
          id="DOBDay" name="DOBDay"
          min={limits.minDay} max={limits.maxDay}
          placeholder="dd" className="case-form-input-number" type="number" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="age">Age: </label>
        <input
          id="age" name="age"
          min={limits.minAge} max={limits.maxAge}
          placeholder="xx" className="case-form-input-number" type="number" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="language">Primary Language: </label>
        <input id="language" name="language" className="case-form-input-text" placeholder="Language" type="text" />
      </div>

      <div className="flex items-baseline">
        <label className="case-form-label" htmlFor="needsInterpreter">Interpreter Needed:</label>
        <input id="needsInterpreter" name="needsInterpreter" type="checkbox" />
      </div>

      <div className="flex ">
        <label className="case-form-label" htmlFor="heightFeet">Height: </label>
        <input
          id="heightFeet" name="heightFeet"
          min={limits.minFeet} max={limits.maxFeet}
          placeholder="ft" className="case-form-input-number" type="number" />
        &nbsp;&nbsp;
        <input
          id="heightInches" name="heightInches"
          min={limits.minInches} max={limits.maxInches}
          placeholder="in" className="case-form-input-number" type="number" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="dosingWeight">Dosing Weight: </label>
        <input
          id="dosingWeight" name="dosingWeight"
          min={limits.minKilograms} max={limits.maxKilograms}
          placeholder="kg" className="case-form-input-number" type="number" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="precautions">Precautions:</label>
        <select id="precautions" name="precautions" defaultValue="" className="case-form-select">
          <option value="" hidden disabled>Select</option>
          <option value="contact">Contact</option>
          <option value="contact-enteric">Contact-Enteric</option>
          <option value="airbourne">Airbourne</option>
          <option value="droplet">Droplet</option>
          <option value="neutropenic">Neutropenic</option>
        </select>
      </div>

      <MultipleTextInput
        labelText="Allergies:"
        name="allergies"
        value={allergies}
        onChange={setAllergies}
        placeholder="Allergy" />
      <hr />

      <p className="m-2 mb-4 ml-0 text-2xl font-bold">Admission Details</p>

      <div className="flex">
        <label htmlFor="admissionDateOffest" className="case-form-label">Duration of Inpatient Stay: </label>
        <input min={0} placeholder="days" name="admissionDateOffest" id="admissionDateOffest" type="number" className="case-form-input-number" />
        &nbsp;&nbsp;
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <Info size={16} color="var(--muted-foreground)" />
            </TooltipTrigger>
            <TooltipContent className="w-fit">
              <p className="max-w-120 text-wrap">
                The number of days before the start of the simulation that the patient has been hospitalized.
                Enter zero (0) if the date of admission is the day of the simulation.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex">
        <label htmlFor="admissionTime" className="case-form-label">Time of Admission:</label>
        <input defaultValue={"00:00"} className="w-25 border-1 pl-1 pr-1 rounded" name="admissionTime" id="admissionTime" type="time" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="admittingDiagnosis">Admitting Diagnosis: </label>
        <input name="admittingDiagnosis" id="admittingDiagnosis" placeholder="Diagnosis" className="case-form-input-text" type="text" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="admissionReason">Reason for Admission: </label>
        <input name="admissionReason" id="admissionReason" placeholder="Reason" className="case-form-input-text" type="text" />
      </div>

      <div className="flex">
        <label className="case-form-label" htmlFor="attendingProviderName">Attending Provider: </label>
        <select name="attendingProviderTitle" id="attendingProviderTitle" defaultValue="" className="case-form-select">
          <option value="" hidden disabled>Title</option>
          <option value="NP">NP</option>
          <option value="PA">PA</option>
          <option value="MD">MD</option>
          <option value="DO">DO</option>
        </select>
        &nbsp;&nbsp;
        <input name="attendingProviderName" id="attendingProviderName" placeholder="Name" className="case-form-input-text" type="text" />
      </div>
    </>
  )
}

export default DemographicsForm