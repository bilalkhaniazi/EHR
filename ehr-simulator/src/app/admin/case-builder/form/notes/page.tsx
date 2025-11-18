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
import { useRouter } from "next/navigation";

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

const minutesToDHM = (minutes: number) => [Math.floor(minutes / 1440), Math.floor((minutes % 1440) / 60), minutes % 60];

const DHMToMinutes = (days: number | "", hours: number | "", minutes: number | "") => {
  return ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0)
}

// const dateFromOffset = (dateOffset: number) => {
//   const date = new Date()
//   date.setDate(date.getDate() - dateOffset)

//   return date.toLocaleDateString("en-US", {
//     month: "numeric",
//     day: "numeric",
//     year: "2-digit"
//   });
// };

function displayTimeOffset(timeOffset: number): string {
  const [days, hours, minutes] = minutesToDHM(timeOffset)

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  return parts.join(', ') || '0 minutes';
}

const NoteDisplay = ({ note, onDelete }: { note: TextNote | SoapNote, onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col space-y-1 bg-white pt-2 px-4 rounded-lg shadow"
    >
      <div className="flex justify-between">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <div className="flex items-center gap-2">

          <p className="text-md font-light">
            {displayTimeOffset(note.timeOffset)} before simulation
          </p>
          <Separator className="mx-3 bg-gray-200" orientation="vertical" />

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
  const router = useRouter();

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

  const [notes, setNotes] = useState<(TextNote | SoapNote)[]>([]);

  const [category, setCategory] = useState<string>("")
  const [specialty, setSpecialty] = useState<string>("")
  const [author, setAuthor] = useState<string>("")
  const [isSoap, setIsSoap] = useState<boolean>(false)

  const [plainNote, setPlainNote] = useState<string>("");
  const [subjective, setSubjective] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [assessment, setAssessment] = useState<string>("");
  const [plan, setPlan] = useState<string>("");

  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);

  const [canAddNote, setCanAddNote] = useState(false);

  const clears = () => {
    setCategory("");
    setSpecialty("");
    setAuthor("");
    setPlainNote("");
    setSubjective("");
    setObjective("");
    setAssessment("");
    setPlan("");
    setDays(0);
    setHours(0);
    setMinutes(0);
  }

  const handleFormatSwitch = (isSoap: boolean) => {
    setIsSoap(isSoap);

    // Clear inputs south of choosing the format that depend on the format
    setPlainNote("");
    setSubjective("");
    setObjective("");
    setAssessment("");
    setPlan("");
  }

  useEffect(() => {
    // Check if note is complete (enough to be added to the array)
    if (isSoap) {
      setCanAddNote([
        assessment, // Only assessment is required for a SOAP note
        category,
        specialty,
        author].every(
          inputField => (inputField.trim() !== ""))
      )
    }
    else {
      setCanAddNote([
        plainNote,
        category,
        specialty,
        author].every(
          inputField => (inputField.trim() !== ""))
      )
    }
  }, [
    plainNote,
    assessment,
    category,
    specialty,
    author,
    isSoap
  ]);

  const createNote = () => {
    if (isSoap) {
      setNotes([...notes, {
        title: category + " Note",
        author: author,
        specialty: specialty,
        timeOffset: DHMToMinutes(days, hours, minutes), // days, hours, minutes to minutes
        body: {
          subjective: subjective,
          objective: objective,
          assessment: assessment,
          plan: plan
        }
      }])
    }
    else {
      setNotes([...notes, {
        title: category + " Note",
        author: author,
        specialty: specialty,
        timeOffset: DHMToMinutes(days, hours, minutes), // Days, hours, minutes to minutes
        text: plainNote
      }])
    }
    clears();
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);

    router.push('/admin/case-builder/form/labs')
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-neutral-100 flex-1 gap-2 p-2 overflow-y-auto ">
        <Card className="relative pb-0">
          <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
            <div className="w-full flex flex-col gap-6 p-2">
              <input type="hidden" name="notes" value={JSON.stringify(notes)} />
              <div className="absolute top-8 right-8">
                <SubmitButton buttonText="Continue" />
              </div>


              <p className="m-2 ml-0 text-2xl font-bold">Notes</p>

              <div className="flex">
                <label className="case-form-label">Category:</label>
                <select
                  onChange={(e) => { setCategory(e.target.value) }}
                  value={category} className="case-form-select">
                  <option value="" hidden disabled>Select</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <label className="case-form-label">Specialty:</label>
                <select
                  onChange={(e) => { setSpecialty(e.target.value) }}
                  value={specialty} className="case-form-select">
                  <option value="" hidden disabled>Select</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <label htmlFor="author" className="case-form-label">Author:</label>
                <input
                  type="text" value={author} className="case-form-input-text"
                  onChange={(e) => { setAuthor(e.target.value) }}
                  id="author" placeholder="" />
              </div>

              <div className="flex-col">
                <label htmlFor="timeOffset" className="case-form-label">Time Offset:</label>
                <InfoTooltip content="" />
                <div className="flex ml-4">

                  <label htmlFor="days" className="case-form-label">Days:</label>
                  <input
                    value={days}
                    onChange={(e) => { setDays(parseFloat(e.target.value)) }} type="number"
                    id="days" min={0}
                    className="mr-4 case-form-input-number" />

                  <label htmlFor="hours" className="case-form-label">Hours:</label>
                  <input
                    value={hours}
                    onChange={(e) => { setHours(parseFloat(e.target.value)) }}
                    type="number"
                    id="hours" min={0}
                    className="mr-4 case-form-input-number" />

                  <label htmlFor="minutes" className="case-form-label">Minutes:</label>
                  <input
                    value={minutes}
                    onChange={(e) => { setMinutes(parseFloat(e.target.value)) }}
                    type="number"
                    id="minutes" min={0}
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


              {/* SOAP format inputs */}
              <div className="space-y-3">
                <p>Note Contents:</p>

                {isSoap && (
                  <div className="ml-4">
                    <div className="flex flex-col">
                      <label htmlFor="subjective" className="case-form-label ">Subjective:</label>
                      <textarea
                        onChange={(e) => { setSubjective(e.target.value) }} value={subjective}
                        id="subjective" className="min-h-25 case-form-textarea" />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="objective" className="case-form-label">Objective:</label>
                      <textarea
                        onChange={(e) => { setObjective(e.target.value) }} value={objective}
                        id="objective" className="min-h-25 case-form-textarea" />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="assessment" className="case-form-label">Assessment:</label>
                      <textarea
                        onChange={(e) => { setAssessment(e.target.value) }} value={assessment}
                        id="assessment" className="min-h-25 case-form-textarea" />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="plan" className="case-form-label">Plan:</label>
                      <textarea
                        onChange={(e) => { setPlan(e.target.value) }} value={plan}
                        id="plan" className="min-h-25 case-form-textarea" />
                    </div>
                  </div>
                )}
              </div>

              {/* Text input, not in SOAP format */}
              {!isSoap &&
                <textarea
                  onChange={(e) => { setPlainNote(e.target.value) }} value={plainNote}
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
            </div>
          </form>
          {(notes.length > 0) &&
            <div className="flex flex-col grow gap-4 p-2 rounded-lg overflow-y-auto ">
              {notes.map((note, index) => (
                <div className="border rounded-lg">
                  <NoteDisplay onDelete={() => setNotes(notes.filter((_, i) => i !== index))} note={note} key={index} />
                </div>
              ))}
            </div>
          }

        </Card>
      </div>
    </>
  )
}

export default NotesForm