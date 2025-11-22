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
import { ClipboardPen } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
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
  });

  const [isOpen, setIsOpen] = useState(false);

  // Logic kept exactly the same, just widened the type to allow Textarea events
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }))
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
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm gap-2"
        >
          <ClipboardPen className="h-4 w-4" />
          <span>Add SBAR Note</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-2xl xl:max-w-3xl bg-white p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-white border-b border-slate-200">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-md">
              <ClipboardPen size={18} />
            </span>
            Nursing Note (SBAR)
          </DialogTitle>
          <DialogDescription>
            Document clinical findings using the SBAR communication format.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <form className="grid gap-6">

            {/* SITUATION */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold">S</span>
                <Label htmlFor="situation" className="text-slate-700 font-semibold">Situation</Label>
              </div>
              <Textarea
                id="situation"
                name="situation"
                placeholder="What is happening with the patient?"
                className="bg-white min-h-[80px] focus-visible:ring-blue-500/20"
                value={newNote.situation}
                onChange={handleNoteChange}
              />
            </div>

            {/* BACKGROUND */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold">B</span>
                <Label htmlFor="background" className="text-slate-700 font-semibold">Background</Label>
              </div>
              <Textarea
                id="background"
                name="background"
                placeholder="What is the clinical background or context?"
                className="bg-white min-h-[80px] focus-visible:ring-blue-500/20"
                value={newNote.background}
                onChange={handleNoteChange}
              />
            </div>

            {/* ASSESSMENT */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold">A</span>
                <Label htmlFor="assessment" className="text-slate-700 font-semibold">Assessment</Label>
              </div>
              <Textarea
                id="assessment"
                name="assessment"
                placeholder="What do you think the problem is?"
                className="bg-white min-h-[80px] focus-visible:ring-blue-500/20"
                value={newNote.assessment}
                onChange={handleNoteChange}
              />
            </div>

            {/* RECOMMENDATION */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold">R</span>
                <Label htmlFor="recommendation" className="text-slate-700 font-semibold">Recommendation</Label>
              </div>
              <Textarea
                id="recommendation"
                name="recommendation"
                placeholder="What would you do to correct it?"
                className="bg-white min-h-[80px] focus-visible:ring-blue-500/20"
                value={newNote.recommendation}
                onChange={handleNoteChange}
              />
            </div>

          </form>
        </div>

        <DialogFooter className="px-6 py-4 bg-white border-t border-slate-200">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmitNote} className="bg-blue-600 hover:bg-blue-700">
            Submit Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NursingNoteEntry