'use client'

import { useState } from "react"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import type { NoteData } from "./notesData"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import SoapNote from "./soapNote"

interface NoteDisplayProps {
  note: NoteData,
  displayDate: (dateOffset: number) => string
}

const renderNote = (note: NoteData) => {
  if (note.title === "Nursing Note") {
    return (
      <p className="text-sm">{note.noteBody}</p>
    )
  }
  else if (note.title === "Student Note") {
    return (
      <div className="grid gap-2">
        <p className="text-small">
          <span className="font-semibold">Situation: </span>
          {note.noteBody.situation}
        </p>
        <p className="text-small">
          <span className="font-semibold">Background: </span>
          {note.noteBody.background}
        </p>
        <p className="text-small">
          <span className="font-semibold">Assessment: </span>
          {note.noteBody.assessment}
        </p>
        <p className="text-small">
          <span className="font-semibold">Recommendation: </span>
          {note.noteBody.recommendation}
        </p>
      </div>
    )
  } else {
    return <SoapNote note={note.noteBody} />
  }
}
 
const NoteDisplay = ({ note, displayDate }: NoteDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const noteType = note.title;

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full flex flex-col space-y-1 bg-white pt-2 px-4 rounded-lg shadow"
    >
      <div className="flex justify-between">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <div className="flex items-center">
          <p className="text-md font-light">{note.publishTime}</p>
          <Separator className="mx-3  bg-gray-200" orientation="vertical"></Separator>
          <p className="text-md font-light">{displayDate(note.dateOffset)}</p>
        </div>
      </div>
      <h2 className="text-sm">{note.specialty}</h2>
      <h2 className="text-sm">{note.author}</h2>
      <CollapsibleContent className="data-[state=open]:animate-in  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <Separator className="my-2 bg-gray-300" />
        <div className="w-full">
          {/* {noteType === "Nursing Note" ? (
            <p className="text-sm">{note.noteBody}</p>
          ) :
          (
            <SoapNote note={note.noteBody} />
          )} */}
          {renderNote(note)}
          
        </div>
      </CollapsibleContent>
      <div className="flex justify-center">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="focus-visible:ring-none focus:ring-none hover:bg-transparent p-1 h-fit">
            <ChevronDown style={{transform: isOpen ? `rotate(180deg)` : "none"}} />
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  )
}

export default NoteDisplay