import type { SoapNoteData } from "./notesData";

interface SoapNoteProps {
  note: SoapNoteData
}
const SoapNote = ( { note } : SoapNoteProps) => {
  return (
    <div>
      {note.subjective && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Subjective</h1>
          <p className="text-sm pt-1 pl-2">{note.subjective}</p>
        </div>
      )}
      {note.objective && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Objective</h1>
          <p className="text-sm pt-1 pl-2">{note.objective}</p>
        </div>
      )}
      <div className="flex flex-col justify-left pb-2">
        <h1 className="text-sm font-medium underline">Assessment</h1>
        <p className="text-sm pt-1 pl-2">{note.assessment}</p>
      </div>
      {note.plan && (
        <div className="flex flex-col justify-left pb-2">
          <h1 className="text-sm font-medium underline">Plan</h1>
          <p className="text-sm pt-1 pl-2">{note.plan}</p>
        </div>
      )}
    </div>
  )
}

export default SoapNote