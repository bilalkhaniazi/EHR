'use client'

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  FileText,
  User,
  Clock,
  Stethoscope,
  ClipboardList
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NoteData, ProviderNote, StudentNote } from "./notesData"
import { format, subMinutes } from "date-fns"

// --- Type Guards ---
function isSoapNote(note: NoteData): note is ProviderNote {
  return typeof note.noteBody === 'object' && 'assessment' in note.noteBody && !('recommendation' in note.noteBody);
}

function isSbarNote(note: NoteData): note is StudentNote {
  return typeof note.noteBody === 'object' && 'recommendation' in note.noteBody;
}

const displayDate = (startTime: number, offset: number) => {
  return format(subMinutes(startTime, offset), "Pp")

};



interface NoteDisplayProps {
  note: NoteData;
  startTime: number;
}

export default function NoteDisplay({ note, startTime }: NoteDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine icon based on note type
  const NoteIcon = isSbarNote(note) ? ClipboardList : (isSoapNote(note) ? Stethoscope : FileText);
  const iconColor = isSbarNote(note) ? "text-orange-600 bg-orange-50" : (isSoapNote(note) ? "text-blue-600 bg-blue-50" : "text-slate-600 bg-slate-100");

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md group shrink-0"
    >
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer hover:bg-slate-50/50 transition-colors gap-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-3 items-center overflow-hidden">
          <div className={`p-2.5 rounded-lg shrink-0 ${iconColor}`}>
            <NoteIcon size={20} />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{note.title}</h3>
              {isSbarNote(note) && <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-orange-600 border-orange-200 bg-orange-50">Student</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <User size={12} className="text-slate-400" />
                {note.author}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="font-medium text-slate-600">{note.specialty}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-[3.25rem] sm:pl-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <Clock size={12} className="text-slate-400" />
            {displayDate(startTime, note.timeOffset)}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 shrink-0">
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <div className="px-4 pb-4 sm:px-8 sm:pb-6 text-sm text-slate-700 space-y-4 animate-in slide-in-from-top-2 duration-200 border-t  border-slate-100">

          {typeof note.noteBody === 'string' && (
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap pt-2 ">
              {note.noteBody}
            </div>
          )}

          {isSoapNote(note) && (
            <div className="grid gap-4 pt-2 border-slate-100">
              {note.noteBody.subjective && (
                <Section title="Subjective" content={note.noteBody.subjective} />
              )}
              {note.noteBody.objective && (
                <Section title="Objective" content={note.noteBody.objective} />
              )}
              {note.noteBody.assessment && (
                <Section title="Assessment" content={note.noteBody.assessment} variant="highlight" />
              )}
              {note.noteBody.plan && (
                <Section title="Plan" content={note.noteBody.plan} />
              )}
            </div>
          )}

          {isSbarNote(note) && (
            <div className="grid gap-3 pt-2 border-t border-slate-100">
              <Section title="Situation" content={note.noteBody.situation} />
              <Section title="Background" content={note.noteBody.background} />
              <Section title="Assessment" content={note.noteBody.assessment} />
              <Section title="Recommendation" content={note.noteBody.recommendation} variant="highlight" />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// --- Internal Sub-Component for consistent sections ---
function Section({ title, content }: { title: string, content: string, variant?: "default" | "highlight" }) {

  return (
    <div className={`rounded-lg border p-3 bg-white border-slate-100`}>
      <h4 className={`text-[10px] uppercase tracking-wider font-bold mb-1.5 text-slate-400`}>
        {title}
      </h4>
      <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}