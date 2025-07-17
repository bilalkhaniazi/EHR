import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "./ui/dialog"

import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { PencilLine } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { useState } from "react"

interface NursingNoteEntryProps {
  submitNote: (userNote: string) => void,
}

const NursingNoteEntry = ({ submitNote }: NursingNoteEntryProps) => {
  const [newNote, setNewNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitNote = () => {
    submitNote(newNote);
    setNewNote("");
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
        <DialogDescription>
          
        </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="note">Some prompt here?</Label>
            <Textarea id="note" name="username"  value={newNote} onChange={e => setNewNote(e.target.value)} />
          </div>
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