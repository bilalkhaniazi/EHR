"use client"
import { useState, useEffect, use } from "react"
import { sampleNotes, type TextNote, type SoapNote } from "./notesData"
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Card } from "@/components/ui/card"
import SubmitButton from "../../components/submitButton";
import InfoTooltip from "../../components/helpTooltip";

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.target as HTMLFormElement);
  const payload = Object.fromEntries(formData);
  console.log(payload);

  // Process data and save to patient object
  // Move to next page of the form
  // Backend shenanigans
}




const TextNoteContentDisplay = (note: TextNote) => {
  return (
    <p className="text-sm">{note.text}</p>
  )
}

const SoapNoteContentDisplay = (note: SoapNote) => {
  return (
    <div>
      {note.body.subjective && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Subjective</h1>
          <p className="text-sm pt-1 pl-2">{note.body.subjective}</p>
        </div>
      )}
      {note.body.objective && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Objective</h1>
          <p className="text-sm pt-1 pl-2">{note.body.objective}</p>
        </div>
      )}
      <div className="flex flex-col justify-left pb-2">
        <h1 className="text-sm font-medium underline">Assessment</h1>
        <p className="text-sm pt-1 pl-2">{note.body.assessment}</p>
      </div>
      {note.body.plan && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Plan</h1>
          <p className="text-sm pt-1 pl-2">{note.body.plan}</p>
        </div>
      )}
    </div>
  )
}

const dateFromOffset = (dateOffset: number) => {
  const date = new Date()
  date.setDate(date.getDate() - dateOffset)

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  });
};

const minutesToDHM = (minutes: number) => [Math.floor(minutes / 1440), Math.floor((minutes % 1440) / 60), minutes % 60];

const NoteDisplay = ({ note, onDelete }: { note: TextNote | SoapNote, onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [days, hours, minutes] = minutesToDHM(note.timeOffset)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col space-y-1 bg-white pt-2 px-4 rounded-lg shadow"
    >
      <div className="flex justify-between">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <div className="flex items-center gap-2">

          <p className="text-md font-light">{note.timeOffset}</p>

          <Separator className="mx-3 bg-gray-200" orientation="vertical"></Separator>


          <p className="text-md font-light">
            {days == 1 && days + " day,"} { } before simulation
          </p>


          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onDelete}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 h-8 p-1"
          >
            <X />
          </Button>

        </div>
      </div>
      <h2 className="text-sm">{note.specialty}</h2>
      <h2 className="text-sm">{note.author}</h2>
      <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <Separator className="my-2 bg-gray-300" />
        <div className="w-full">

          {/* Text Note or Soap Note */}
          {('text' in note && typeof note.text === 'string') && (
            <TextNoteContentDisplay {...note} />
          )}

          {('body' in note) && (
            <SoapNoteContentDisplay {...note} />
          )}

        </div>
      </CollapsibleContent>
      <div className="flex justify-center">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="cursor-pointer focus-visible:ring-none focus:ring-none hover:bg-transparent p-1 h-fit">
            <ChevronDown style={{ transform: isOpen ? `rotate(180deg)` : "none" }} />
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  )
}


const NotesForm = () => {

  const categories = [
    "Admission",
    "Consent",
    "Consult",
    "Discharge",
    "History & Physical",
    "Nursing",
    "Post-op",
    "Pre-op",
    "Progress",
    "Rapid Response",
    "Telehealth"
  ]
  const specialties = [
    "Cardiology",
    "Care Management",
    "Critical Care",
    "Dermatology",
    "ENT",
    "Emergency Medicine",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Neurology",
    "Nursing",
    "Obstetrics",
    "Occupational Therapy",
    "Oncology",
    "Orthopedics",
    "Pathology",
    "Pediatrics",
    "Physical Therapy",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Respiratory Therapy",
    "SLP",
    "Social Work",
    "Spiritual Care",
    "Urology"
  ]

  const [notes, setNotes] = useState<(TextNote | SoapNote)[]>([sampleNotes[0], sampleNotes[1]]);

  const [categoryInput, setCategoryInput] = useState<string>("")
  const [specialtyInput, setSpecialtyInput] = useState<string>("")
  const [authorInput, setAuthorInput] = useState<string>("")
  const [isSoap, setIsSoap] = useState<boolean>(false)

  const [plainNoteInput, setPlainNoteInput] = useState<string>("");
  const [subjectiveInput, setSubjectiveInput] = useState<string>("");
  const [objectiveInput, setObjectiveInput] = useState<string>("");
  const [assessmentInput, setAssessmentInput] = useState<string>("");
  const [planInput, setPlanInput] = useState<string>("");

  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);
  const timeOffset = ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0)

  const [canAddNote, setCanAddNote] = useState(false);

  const clearInputs = () => {
    setCategoryInput("");
    setSpecialtyInput("");
    setAuthorInput("");
    setPlainNoteInput("");
    setSubjectiveInput("");
    setObjectiveInput("");
    setAssessmentInput("");
    setPlanInput("");
    setDays("");
    setHours("");
    setMinutes("");
  }

  const handleFormatSwitch = (isSoap: boolean) => {
    setIsSoap(isSoap);

    // Clear inputs south of choosing the format that depend on the format
    setPlainNoteInput("");
    setSubjectiveInput("");
    setObjectiveInput("");
    setAssessmentInput("");
    setPlanInput("");
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



  useEffect(() => {
    // Check if note is complete (enough to be added to the array)
    if (isSoap) {
      setCanAddNote([
        assessmentInput, // Only assessment is required for a SOAP note
        categoryInput,
        specialtyInput,
        authorInput].every(
          inputField => (inputField.trim() !== ""))
      )
    }
    else {
      setCanAddNote([
        plainNoteInput,
        categoryInput,
        specialtyInput,
        authorInput].every(
          inputField => (inputField.trim() !== ""))
      )
    }
  }, [
    plainNoteInput,
    assessmentInput,
    categoryInput,
    specialtyInput,
    authorInput,
    isSoap
  ]);

  const createNote = () => {
    if (isSoap) {
      setNotes([...notes, {
        title: categoryInput + " Note",
        author: authorInput,
        specialty: specialtyInput,
        timeOffset: (0 * 24 * 60) + (5 * 60) + 30, // 0 days, 5 hours, 30 minutes in minutes
        body: {
          subjective: subjectiveInput,
          objective: objectiveInput,
          assessment: assessmentInput,
          plan: planInput
        }
      }])
    }
    else {
      setNotes([...notes, {
        title: categoryInput + " Note",
        author: authorInput,
        specialty: specialtyInput,
        timeOffset: (0 * 24 * 60) + (5 * 60) + 30, // 0 days, 5 hours, 30 minutes in minutes
        text: plainNoteInput
      }])
    }
    clearInputs();
  }


  return (
    <>
      <div className="flex flex-col bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
        <Card>
          <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
            <div className="w-full flex flex-col gap-2 p-2">
              <input type="hidden" name="notes" value={JSON.stringify(notes)} />

              <p className="m-2 ml-0 text-2xl font-bold">Notes</p>

              {(notes.length > 0) &&
                <div className="flex flex-col grow gap-2 p-2 rounded-lg overflow-y-auto border inset-shadow-sm bg-gray-100">
                  {notes.map((note, index) => (
                    <NoteDisplay onDelete={() => setNotes(notes.filter((_, i) => i !== index))} note={note} key={index} />
                  ))}
                </div>
              }

              <div className="flex">
                <label className="case-form-label">Category:</label>
                <select
                  onChange={(e) => { setCategoryInput(e.target.value) }}
                  value={categoryInput} className="case-form-select">
                  <option value="" hidden disabled>Select</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <label className="case-form-label">Specialty:</label>
                <select
                  onChange={(e) => { setSpecialtyInput(e.target.value) }}
                  value={specialtyInput} className="case-form-select">
                  <option value="" hidden disabled>Select</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <label htmlFor="author" className="case-form-label">Author:</label>
                <input
                  type="text" value={authorInput} className="case-form-input-text"
                  onChange={(e) => { setAuthorInput(e.target.value) }}
                  id="author" placeholder="" />
              </div>

              <div className="flex-col">
                <label htmlFor="timeOffset" className="case-form-label">Time Offset:</label>
                <InfoTooltip content="" />
                <div className="flex ml-4">

                  <label htmlFor="days" className="case-form-label">Days:</label>
                  <input
                    type="number"
                    id="days"
                    className="mr-4 case-form-input-number" />

                  <label htmlFor="hours" className="case-form-label">Hours:</label>
                  <input
                    value={hours}
                    type="number"
                    id="hours"
                    className="mr-4 case-form-input-number" />

                  <label htmlFor="minutes" className="case-form-label">Minutes:</label>
                  <input
                    type="number"
                    id="minutes"
                    className="mr-4 case-form-input-number" />

                </div>
              </div>

              <div className="flex">
                <label className="case-form-label">SOAP Format:</label>
                <div className="flex gap-1">
                  <input
                    id="isSoapYes" type="radio" value={"Yes"} checked={isSoap === true}
                    onChange={(e) => { if (e.target.value === "Yes") { handleFormatSwitch(true) } }} />
                  <label htmlFor="isSoapYes" className="case-form-label">Yes</label>

                  <input
                    id="isSoapNo" type="radio" value={"No"} checked={isSoap === false}
                    onChange={(e) => { if (e.target.value === "No") { handleFormatSwitch(false) } }} />
                  <label htmlFor="isSoapNo" className="case-form-label">No</label>
                </div>
              </div>

              <p>Note Contents:</p>

              {/* SOAP format inputs */}
              {isSoap &&
                (
                  <div className="ml-4">
                    <div className="flex flex-col">
                      <label htmlFor="subjective" className="case-form-label ">Subjective:</label>
                      <textarea
                        onChange={(e) => { setSubjectiveInput(e.target.value) }} value={subjectiveInput}
                        id="subjective" className="min-h-25 case-form-textarea" />
                    </div>
                    <br />
                    <div className="flex flex-col">
                      <label htmlFor="objective" className="case-form-label">Objective:</label>
                      <textarea
                        onChange={(e) => { setObjectiveInput(e.target.value) }} value={objectiveInput}
                        id="objective" className="min-h-25 case-form-textarea" />
                    </div>
                    <br />

                    <div className="flex flex-col">
                      <label htmlFor="assessment" className="case-form-label">Assessment:</label>
                      <textarea
                        onChange={(e) => { setAssessmentInput(e.target.value) }} value={assessmentInput}
                        id="assessment" className="min-h-25 case-form-textarea" />
                    </div>
                    <br />

                    <div className="flex flex-col">
                      <label htmlFor="plan" className="case-form-label">Plan:</label>
                      <textarea
                        onChange={(e) => { setPlanInput(e.target.value) }} value={planInput}
                        id="plan" className="min-h-25 case-form-textarea" />
                    </div>
                  </div>
                )
              }

              {/* Text input, not in SOAP format */}
              {!isSoap &&
                <textarea
                  onChange={(e) => { setPlainNoteInput(e.target.value) }} value={plainNoteInput}
                  className="ml-4 min-h-25 case-form-textarea" />
              }

              <button
                onClick={createNote}
                disabled={!canAddNote}
                title={!canAddNote ? "Note incomplete" : ""}
                className="
                disabled:cursor-not-allowed disabled:opacity-55
                cursor-pointer mb-4 border border-[#333] rounded bg-[#eaeaea] pl-2 pr-2 inline w-fit"
                type="button">
                Add Note to Case +
              </button>
              <SubmitButton href="/admin/case-builder/new/orders" buttonText="Continue" />
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

export default NotesForm