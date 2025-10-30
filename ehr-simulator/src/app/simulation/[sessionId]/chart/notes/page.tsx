
"use client"

import { sampleNotes, SbarNote, type NoteData } from "./components/notesData";
import NursingNoteEntry from "./components/nursingNoteEntry";
import NoteDisplay from "./components/noteDisplay";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterBadges from "./components/filterBadges";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store/store";
import {
  addSpecialtyFilter,
  removeSpecialtyFilter,
  clearSpecialtyFilters
} from './components/noteSlice'
import { useAddNoteMutation, useGetNotesQuery } from "@/app/store/apiSlice";
import { Skeleton } from "@/components/ui/skeleton";




const NotePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading: areNotesLoading, isFetching, isError: notesFetchError, error: fetchErrorDetails } = useGetNotesQuery();
  const [addNote] = useAddNoteMutation() 
  const filteredSpecialties = useSelector((state: RootState) => state.notes.filteredSpecialties)

  const notesData = data?.notesData || [];

  // get all specialties from RTK queried data to build filter options
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

  const onSubmitNote = async (studentNote: SbarNote) => {
    const date = new Date()
    const addedTime = date.toLocaleTimeString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(":", ''); 

    const newNote: NoteData = {
      title: "Student Note",
      author: "Current User, RN BSN",
      specialty: "Nursing",
      dateOffset: 0,
      hospitalDay: "3", 
      publishTime: addedTime,
      noteBody: studentNote 
    }
    try {
      await addNote(newNote).unwrap();
      toast.success(`Nursing note submitted for {patient} at ${addedTime}`);
    } catch (err) {
      toast.error(`Failed to submit note: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Failed to submit note:", err);
    }
  };
  
  if (areNotesLoading || isFetching) {
    return (
      <div className="flex flex-col h-full w-full pt-16 bg-gray-100 justify-start items-center gap-6">
        <Skeleton className="w-5/6 h-16 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (notesFetchError) {
    return (
      <div className="w-full h-full flex flex-col px-4 gap-3 bg-gray-100 justify-center items-center">
        <p className="text-red-600">Error loading notes: {fetchErrorDetails ? (fetchErrorDetails as any).message : 'Unknown error'}</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col px-4  gap-3 bg-gray-100">
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
      <div className="flex flex-col flex-grow gap-4 p-2 rounded-t-lg overflow-y-auto border inset-shadow-sm bg-gray-100">  
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