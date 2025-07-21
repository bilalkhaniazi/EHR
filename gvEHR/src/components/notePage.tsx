
import { useState } from "react"
import { sampleNotes, type NoteData } from "./notesData"
import NursingNoteEntry from "./nursingNoteEntry"
import NoteDisplay from "./noteDisplay"
import { Toaster, toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Filter } from "lucide-react"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import FilterBadges from "./filterBadges"

const NotePage = () => {
  const specialties = [...new Set(sampleNotes.map((note) => {
    return (note.specialty)
  }))];
  
  const [notesData, setNotesData] = useState(sampleNotes)
  const [filteredSpecialties, setFilteredSpecialties] = useState<string[]>([])
  
  const filteredNotesData = notesData.filter(note => {
    if (filteredSpecialties.length === 0) {
      return true
    }
    return filteredSpecialties.includes(note.specialty);
  })

  const handleFilterChange = (specialty: string, checked: boolean | "indeterminate") => {
    if (checked) {
      setFilteredSpecialties(prev => [...prev, specialty]);
    } else {
      setFilteredSpecialties(prev => prev.filter(t => t !== specialty));
      console.log(`Removed ${specialty}`)
    }
  };
  
  const clearAllFilters = () => {
    setFilteredSpecialties([])
  };

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
    <div className="w-full h-full flex flex-col px-4 gap-3 bg-gray-100">
      <Toaster position="top-right" />
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs w-fit h-6">
                  Specialty
                  <Filter className="ml-1 h-2 w-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4 border rounded-lg shadow">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  {specialties.map(title => (
                    <div key={title} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${title}`}
                        checked={filteredSpecialties.includes(title)}
                        onCheckedChange={(checked) => handleFilterChange(title, checked)}
                      />
                      <Label htmlFor={`filter-${title}`} className="font-normal">
                        {title}
                      </Label>
                        </div>
                      ))}
                    </div>
                  {filteredSpecialties.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-6 border shadow"
                    >
                      Clear Filters
                    </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <FilterBadges 
            activeFilters={filteredSpecialties}
            handleFilterChange={handleFilterChange} 
            handleClearFilters={clearAllFilters}
          />
        </div>
        <NursingNoteEntry submitNote={onSubmitNote}/>
      </div>
      <div className="flex flex-col h-auto gap-4 p-2 rounded-t-lg overflow-y-auto border inset-shadow-sm bg-gray-100">
        {filteredNotesData.map((note, index) => {
          return (
            <NoteDisplay key={index} displayDate={displayDate} note={note} />
          )
        })}
      </div>
    </div>
  )
} 

export default NotePage