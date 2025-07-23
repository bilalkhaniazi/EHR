
import { sampleNotes, type NoteData } from "./notesData";
import NursingNoteEntry from "./nursingNoteEntry";
import NoteDisplay from "./noteDisplay";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import FilterBadges from "./filterBadges";


import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  addNote,
  addSpecialtyFilter,
  removeSpecialtyFilter,
  clearSpecialtyFilters
} from './noteSlice'

const NotePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notesData = useSelector((state: RootState) => state.notes.notesData)
  const filteredSpecialties = useSelector((state: RootState) => state.notes.filteredSpecialties)


  const specialties = [...new Set(sampleNotes.map((note) => (note.specialty)))];
  

  const filteredNotesData = notesData.filter(note => {
    if (filteredSpecialties.length === 0) {
      return true
    }
    return filteredSpecialties.includes(note.specialty);
  })

  const handleFilterChange = (specialty: string, checked: boolean | "indeterminate") => {
    if (checked) {
      dispatch(addSpecialtyFilter(specialty));
    } else {
      dispatch(removeSpecialtyFilter(specialty))
      console.log(`Removed ${specialty}`)
    }
  };
  
  const clearAllFilters = () => {
    dispatch(clearSpecialtyFilters())
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
    dispatch(addNote(newNote))
    toast.success(`Nursing note submitted for {patient} at ${addedTime}`);
  };
  
  
  return (
    <div className="w-full h-full flex flex-col px-4  gap-3 bg-gray-100">
      <div className="w-full flex flex-shrink-0 justify-between py-2">
        <div className="flex h-full flex-col gap-2">
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
      <div className="flex flex-col flex-grow pb-20 gap-4 p-2 rounded-t-lg overflow-y-auto border inset-shadow-sm bg-gray-100">  
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