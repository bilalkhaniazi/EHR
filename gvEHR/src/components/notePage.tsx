
import { useState } from "react"
import { sampleNotes, type NoteData } from "./notesData"
import NursingNoteEntry from "./nursingNoteEntry"
import NoteDisplay from "./noteDisplay"
import { Toaster, toast } from "sonner"

const NotePage = () => {
    const [notesData, setNotesData] = useState(sampleNotes)
    const displayDate = (dateOffset: number) => {
        const date = new Date()
        date.setDate(date.getDate() - dateOffset)

        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit"
        });
    };

    const onSubmitNote = (userNoteContent: string) => {
      const date = new Date()
      const addedTime = date.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '');

      const newNote: NoteData = {
        title: "Nursing Note",
        author: "Current User, RN BSN",
        specialty: "Nursing",
        dateOffset: 0, 
        publishTime: addedTime,
        noteBody: [
            { type: 'paragraph', content: userNoteContent }
        ]
      }
      setNotesData(prevNotes => {
        const newNotesData = [newNote, ...prevNotes]
        return newNotesData
      })
      toast.success(`Nursing note submitted for {patient} at ${addedTime}`);
    };
  
  
  return (
    <div className="w-full h-screen overflow-y-auto flex flex-col px-4 gap-3 bg-gray-100">
      <Toaster position="top-right"></Toaster>
      <div className="w-full flex justify-end">
        <NursingNoteEntry submitNote={onSubmitNote}/>
      </div>
      <div className="flex flex-col gap-4 p-2 rounded-lg overflow-y-auto border inset-shadow-sm bg-gray-100">
        {notesData.map((note, index) => {
          return (
            <NoteDisplay key={index} displayDate={displayDate} note={note} />
          )
        })}
      </div>
    </div>
  )
} 

export default NotePage