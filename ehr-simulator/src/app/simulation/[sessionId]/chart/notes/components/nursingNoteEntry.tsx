'use client'

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PencilLine } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { SbarNote } from "./notesData"

interface NursingNoteEntryProps {
  submitNote: (userNote: SbarNote) => void,
}


const NursingNoteEntry = ({ submitNote }: NursingNoteEntryProps) => {
  const [newNote, setNewNote] = useState<SbarNote>({
    situation: '',
    background: '', 
    assessment: '',
    recommendation: ''
  }
  );


  const [isOpen, setIsOpen] = useState(false);

  
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    setNewNote(prev => (
      {
        ...prev,
        [name]: value
      }
    ))
  }
  
  
  const handleSubmitNote = () => {
    submitNote(newNote);
    setNewNote({
      situation: '',
      background: '', 
      assessment: '',
      recommendation: ''
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)} className="hover:bg-black/5">
          <PencilLine />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl xl:max-w-4xl">
        <DialogHeader>
        <DialogTitle>Nursing Note</DialogTitle>
        <DialogDescription>Prompt here</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <form className="grid gap-3">
            <Label htmlFor="situation">Situation</Label>
            <Input 
              id="situation"
              name="situation"
              value={newNote.situation}
              onChange={handleNoteChange}
            />
            <Label htmlFor="background">Background</Label>
            <Input 
              id="background"
              name="background"
              value={newNote.background}
              onChange={handleNoteChange}
            />
            <Label htmlFor="assessment">Assessment</Label>
            <Input 
              id="assessment"
              name="assessment"
              value={newNote.assessment}
              onChange={handleNoteChange}
            />
            <Label htmlFor="note">Recommendation</Label>
            <Input 
              id="recommendation"
              name="recommendation"
              value={newNote.recommendation}
              onChange={handleNoteChange}
            />
          </form>
        </div>
        <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" onClick={handleSubmitNote}>Submit Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NursingNoteEntry