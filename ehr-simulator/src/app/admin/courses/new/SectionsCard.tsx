"use client"
import { useState } from "react"
import { Group, ChevronDown, ChevronUp, Clock, Calendar, UserCog, ChevronsUpDown, Check, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface FacultyMember {
  id: string
  name: string
  email: string
}

export interface SectionData {
  id: string  // "01" | "02" | "03"
  startTime: string
  endTime: string
  meetingDays: string[]
  facultyIds: string[]
}

interface SectionsCardProps {
  sectionCount: 1 | 2 | 3
  onSectionCountChange: (count: 1 | 2 | 3) => void
  sections: SectionData[]
  onSectionChange: (id: string, field: keyof Omit<SectionData, "id">, value: string | string[]) => void
  allFaculty: FacultyMember[]
}

const SectionRow = ({
  section,
  onChange,
  allFaculty,
}: {
  section: SectionData
  onChange: (field: keyof Omit<SectionData, "id">, value: string | string[]) => void
  allFaculty: FacultyMember[]
}) => {
  const [expanded, setExpanded] = useState(true)
  const [facultyOpen, setFacultyOpen] = useState(false)

  const assignedFaculty = allFaculty.filter(f => section.facultyIds.includes(f.id))

  const toggleFaculty = (member: FacultyMember) => {
    const updated = section.facultyIds.includes(member.id)
      ? section.facultyIds.filter(id => id !== member.id)
      : [...section.facultyIds, member.id]
    onChange("facultyIds", updated)
  }

  const removeFaculty = (id: string) => {
    onChange("facultyIds", section.facultyIds.filter(fid => fid !== id))
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-700">Section {section.id}</span>
          {section.meetingDays.length > 0 && (
            <Badge variant="outline" className="text-xs text-slate-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                .filter(d => section.meetingDays.includes(d))
                .join(", ")}
            </Badge>
          )}
          {assignedFaculty.length > 0 && (
            <Badge variant="outline" className="text-xs text-sky-700 border-sky-200 bg-sky-50">
              {assignedFaculty.length === 1
                ? assignedFaculty[0].name
                : `${assignedFaculty.length} faculty`}
            </Badge>
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        }
      </button>

      {expanded && (
        <div className="px-4 py-4 space-y-4 bg-white">
          {/* Schedule fields */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Start Time
              </Label>
              <Input
                type="time"
                value={section.startTime}
                onChange={e => onChange("startTime", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> End Time
              </Label>
              <Input
                type="time"
                value={section.endTime}
                onChange={e => onChange("endTime", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label className="text-xs font-medium text-slate-500">
                <Calendar className="w-3 h-3" /> Meeting Days
              </Label>
              <div className="flex gap-1 flex-wrap">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                  const active = section.meetingDays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const updated = active
                          ? section.meetingDays.filter(d => d !== day)
                          : [...section.meetingDays, day]
                        onChange("meetingDays", updated)
                      }}
                      className={`h-8 px-1 flex-1 rounded text-xs font-medium border transition-colors cursor-pointer select-none ${active
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                        }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Faculty assignment */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <Label className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <UserCog className="w-3 h-3" /> Faculty
            </Label>

            <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between text-slate-400 font-normal cursor-pointer h-9 text-sm"
                >
                  Assign faculty...
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-80" align="start">
                <Command>
                  <CommandInput placeholder="Search by name..." />
                  <CommandList>
                    <CommandEmpty>No faculty found.</CommandEmpty>
                    <CommandGroup>
                      {allFaculty.map(member => {
                        const isSelected = section.facultyIds.includes(member.id)
                        return (
                          <CommandItem
                            key={member.id}
                            value={member.name}
                            onSelect={() => toggleFaculty(member)}
                            className="cursor-pointer"
                          >
                            <Check className={cn("mr-2 h-4 w-4 flex-shrink-0", isSelected ? "opacity-100 text-sky-700" : "opacity-0")} />
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium">{member.name}</span>
                              <span className="text-xs text-slate-500 truncate">{member.email}</span>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {assignedFaculty.length > 0 && (
              <div className="space-y-1.5">
                {assignedFaculty.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-800">{member.name}</span>
                      <span className="text-xs text-slate-500 truncate">{member.email}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 cursor-pointer flex-shrink-0"
                      onClick={() => removeFaculty(member.id)}
                    >
                      <X className="w-3 h-3 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const SectionsCard = ({
  sectionCount,
  onSectionCountChange,
  sections,
  onSectionChange,
  allFaculty,
}: SectionsCardProps) => {
  const activeSections = sections.slice(0, sectionCount)

  return (
    <Card className="pt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-lg flex items-center gap-2">
            <Group className="size-5 text-blue-600" /> Sections
            <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
              {sectionCount} {sectionCount === 1 ? "section" : "sections"}
            </Badge>
          </CardTitle>
          <CardDescription>Configure section schedules and assign faculty</CardDescription>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs font-medium text-slate-500">Number of sections</p>
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
            {([1, 2, 3] as const).map(n => (
              <Button
                key={n}
                type="button"
                size="sm"
                variant={sectionCount === n ? "default" : "ghost"}
                className="h-7 w-7 p-0 text-xs cursor-pointer"
                onClick={() => onSectionCountChange(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {activeSections.map(section => (
          <SectionRow
            key={section.id}
            section={section}
            onChange={(field, value) => onSectionChange(section.id, field, value)}
            allFaculty={allFaculty}
          />
        ))}
      </CardContent>
    </Card>
  )
}