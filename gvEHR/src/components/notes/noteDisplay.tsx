import { useState } from "react"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
  } from "../ui/collapsible"
import { Separator } from "../ui/separator"
import type { NoteData } from "./notesData"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"

interface NoteDisplayProps {
  note: NoteData,
  displayDate: (dateOffset: number) => string
}
 
const NoteDisplay = ({ note, displayDate }: NoteDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full flex flex-col space-y-1 bg-white pt-2 px-4 rounded-lg shadow"
    >
      <div className="flex justify-between">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <div className="flex items-center">
          <p className="text-md">{note.publishTime}</p>
          <Separator className="mx-3  bg-gray-200" orientation="vertical"></Separator>
          <p className="text-md">{displayDate(note.dateOffset)}</p>
        </div>
      </div>
      <h2 className="text-sm">{note.specialty}</h2>
      <h2 className="text-sm">{note.author}</h2>
      <CollapsibleContent className="data-[state=open]:animate-in  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <Separator className="my-2 bg-gray-300" />
        <div className="w-full">
          {note.noteBody.map((row, index) => {
            if(row.type === "header") {
              return (
                <h1 key={index} className="text-sm font-medium mt-2"><u>{row.content}</u></h1>
              )
            } else if (row.type === "paragraphWithLabel") {
              return (
                <div key={index} className="flex gap-1">
                  <h1 className="text-sm font-medium">{row.label}:</h1>
                  <p className="text-sm">{row.content}</p>
                </div>
              )
            } else {
              return (
                <p key={index} className="text-sm">{row.content}</p>
              )
            }
          }
          )}
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