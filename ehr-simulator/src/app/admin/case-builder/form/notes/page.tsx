"use client"
import { useState, useEffect } from "react"
import {
  FilePlus,
  Stethoscope,
  User,
  FileText,
  ListPlus,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "../../components/submitButton";
import InfoTooltip from "../../components/helpTooltip";
import { useRouter } from "next/navigation";
import { categories, specialties } from "@/utils/form";

import {
  type NoteData,
} from "@/app/simulation/[sessionId]/chart/notes/components/notesData";
import NoteFormDisplay from "./noteFormDisplay";
import { useFormContext } from "@/context/FormContext";
import { Checkbox } from "@/components/ui/checkbox";
import TextEditor, { templateNote } from "@/components/textEditor";

export default function NotesForm() {
  const { onDataChange, noteData } = useFormContext()
  const [notes, setNotes] = useState<NoteData[]>(noteData);

  // individual note data
  const [category, setCategory] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isSoap, setIsSoap] = useState<boolean>(true);
  const [excludeFromPresim, setExcludeFromPresim] = useState<boolean>(false)
  const [noteContent, setNoteContent] = useState<string>(templateNote);

  // Time Offset
  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);

  const [canAddNote, setCanAddNote] = useState(false);

  const handleCheckedChange = (value: boolean) => {
    setExcludeFromPresim(value)
  }
  const clearForm = () => {
    setCategory("");
    setNoteContent(templateNote);
    setDays(0);
    setHours(0);
    setMinutes(0);
  };

  console.log(noteContent)
  const handleNoteChange = (content: string) => {
    setNoteContent(content)
  }
  useEffect(() => {
    const canSubmit = (specialty && author && category.length > 0 && noteContent.length > 0)
    setCanAddNote(!!canSubmit);
  }, [specialty, author, noteContent, category]);

  const createNote = () => {
    const timeOffset = ((Number(days) || 0) * 1440) + ((Number(hours) || 0) * 60) + (Number(minutes) || 0);

    const newNote = {
      title: category ? `${category} Note` : "Progress Note",
      author,
      specialty,
      timeOffset,
      noteBody: noteContent,
      excludedFromPresim: excludeFromPresim
    };
    setNotes(prev => [newNote, ...prev]);
    clearForm();
  };

  const router = useRouter();

  const handleSubmit = () => {
    onDataChange("notes", notes);
    router.push("/admin/case-builder/form/orders");
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 overflow-hidden">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FilePlus className="text-slate-400" />
            Clinical Documentation
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 3 of 9: Add all relevant notes</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 h-full max-w-7xl mx-auto pb-20">
          <div className="fixed top-6 right-8 z-10">
            <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-200 shadow-sm pt-0">
              <CardHeader className="bg-slate-100/70 border-b border-slate-200 pt-4 !pb-2 rounded-t-xl">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> New Entry</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select specialty..." />
                        <ChevronDown />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select note type..." />
                        <ChevronDown />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c, i) => <SelectItem key={i} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                {/* Author & Time Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="pl-9 bg-white"
                        placeholder="e.g. Dr. Smith"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Time Before Sim</Label>
                      <InfoTooltip content="How long before the simulation start time was this note written?" />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input type="number" min={0} value={days} onChange={e => setDays(Number(e.target.value))} className="pr-8 bg-white" />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">d</span>
                      </div>
                      <div className="relative flex-1">
                        <Input type="number" min={0} value={hours} onChange={e => setHours(Number(e.target.value))} className="pr-8 bg-white" />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">h</span>
                      </div>
                      <div className="relative flex-1">
                        <Input type="number" min={0} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="pr-8 bg-white" />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">m</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full gap-2">
                    <Checkbox checked={excludeFromPresim} onCheckedChange={handleCheckedChange} />
                    <Label>Exclude from Pre-Sim</Label>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-normal">
                    <Switch id="soap-mode" checked={isSoap} onCheckedChange={setIsSoap} className="border border-slate-300" />
                    <Label htmlFor="soap-mode">SOAP Format</Label>
                  </div>
                </div>

                <Separator />
                <TextEditor content={noteContent} onChange={handleNoteChange} />
                {/* {isSoap ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <TextEditor />
                      <Label className="text-xs uppercase text-slate-500 font-semibold">Subjective</Label>
                      <Textarea
                        className="bg-white min-h-[80px]"
                        value={soapContent.subjective}
                        onChange={e => setSoapContent({ ...soapContent, subjective: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500 font-semibold">Objective</Label>
                      <Textarea
                        className="bg-white min-h-[80px]"
                        value={soapContent.objective}
                        onChange={e => setSoapContent({ ...soapContent, objective: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500 font-semibold">Assessment</Label>
                      <Textarea
                        className="bg-white min-h-[80px]"
                        value={soapContent.assessment}
                        onChange={e => setSoapContent({ ...soapContent, assessment: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500 font-semibold">Plan</Label>
                      <Textarea
                        className="bg-white min-h-[80px]"
                        value={soapContent.plan}
                        onChange={e => setSoapContent({ ...soapContent, plan: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <Label className="text-xs uppercase text-slate-500 font-semibold">Note Body</Label>
                    <Textarea
                      className="bg-white min-h-[200px] font-mono text-sm leading-relaxed"
                      placeholder="Enter note text..."
                      value={plainNote}
                      onChange={e => setPlainNote(e.target.value)}
                    />
                  </div>
                )} */}

                <div className="pt-2">
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!canAddNote}
                    onClick={createNote}
                  >
                    <ListPlus className="mr-2 h-4 w-4" />
                    Add Note to Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-slate-600 px-1">
              <h3 className="font-semibold flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Chart Preview
              </h3>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded-full">{notes.length} Notes</span>
            </div>

            <div className="space-y-3 h-full overflow-y-auto pr-2 scrollbar-thin">
              {notes.length === 0 && (
                <div className="h-48 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No notes added yet.</p>
                </div>
              )}

              {notes.map((note, index) => (
                <div key={index} className="group relative">
                  <NoteFormDisplay
                    note={note}
                    onDelete={() => setNotes(notes.filter((_, i) => i !== index))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}