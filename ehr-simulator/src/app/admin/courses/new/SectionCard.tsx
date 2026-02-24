"use client"
import { useState } from "react"
import {
  Clock, Calendar,
  ChevronDown, ChevronUp, Plus, Shuffle, GripVertical, Users2, UserX
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { GroupCard, Student, FacultyMember } from "./GroupCard"

export type { FacultyMember } from "./GroupCard"

export interface SectionData {
  id: string
  startTime: string
  endTime: string
  meetingDays: string[]
}

export type SectionGroups = Record<string, Student[]>

export function generateGroupNames(count: number): string[] {
  const names: string[] = []
  for (let i = 0; i < count; i++) {
    if (i < 26) names.push(String.fromCharCode(65 + i))
    else names.push(String.fromCharCode(65 + Math.floor(i / 26) - 1) + String.fromCharCode(65 + (i % 26)))
  }
  return names
}

export function randomlyAssignGroups(students: Student[], groupSize: number): SectionGroups {
  const shuffled = [...students].sort(() => Math.random() - 0.5)
  const count = Math.round(shuffled.length / groupSize)
  const numGroups = Math.max(1, count)
  const names = generateGroupNames(numGroups)
  const groups: SectionGroups = {}
  names.forEach(n => { groups[n] = [] })
  shuffled.forEach((student, i) => {
    groups[names[i % numGroups]].push(student)
  })
  return groups
}

interface SectionCardProps {
  section: SectionData
  groups: SectionGroups
  unassigned: Student[]
  groupSize: number
  facultyMembers: FacultyMember[]
  groupFacultyLeads: Record<string, string[]>
  onGroupFacultyLeadsChange: (sectionId: string, groupName: string, facultyIds: string[]) => void
  draggedStudent: { student: Student; fromGroup: string; fromSection: string } | null
  dragOverGroup: string | null
  onSectionChange: (field: keyof Omit<SectionData, "id">, value: string | string[]) => void
  onGroupSizeChange: (size: number) => void
  onRandomAssign: () => void
  onUnassignAll: () => void
  onAddGroup: () => void
  onRenameGroup: (sectionId: string, oldName: string, newName: string) => void
  onDeleteGroup: (sectionId: string, groupName: string) => void
  onDragStart: (e: React.DragEvent, student: Student, fromGroup: string, fromSection: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, sectionId: string, groupName: string) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, toGroup: string, toSection: string) => void
}

export const SectionCard = ({
  section,
  groups,
  unassigned,
  groupSize,
  facultyMembers,
  groupFacultyLeads,
  onGroupFacultyLeadsChange,
  draggedStudent,
  dragOverGroup,
  onSectionChange,
  onGroupSizeChange,
  onRandomAssign,
  onUnassignAll,
  onAddGroup,
  onRenameGroup,
  onDeleteGroup,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: SectionCardProps) => {
  const [expanded, setExpanded] = useState(true)

  const totalAssigned = Object.values(groups).reduce((s, g) => s + g.length, 0)
  const unassignedDropKey = `${section.id}::__unassigned__`
  const isOverUnassigned =
    dragOverGroup === unassignedDropKey &&
    draggedStudent?.fromSection === section.id &&
    draggedStudent?.fromGroup !== "__unassigned__"


  return (
    <Card className="border-2 border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="cursor-pointer w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-slate-50/60 hover:brightness-95 transition-all text-left"
      >
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className="text-base font-bold text-slate-800 flex-shrink-0">Section {section.id}</span>
          {section.meetingDays.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                .filter(d => section.meetingDays.includes(d))
                .join(", ")}
            </Badge>
          )}
          {section.startTime && section.endTime && (
            <Badge variant="outline" className="text-xs">
              {section.startTime} – {section.endTime}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {totalAssigned} assigned
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {unassigned.length} unassigned
          </Badge>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>

      {expanded && (
        <CardContent className="p-4 sm:p-5 pt-3 sm:pt-3 space-y-5">
          {/* Schedule row: times on left, meeting days on right */}
          <div className="pb-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3">Schedule</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 flex items-center gap-1 normal-case">
                    <Clock className="w-3 h-3" /> Start Time
                  </Label>
                  <Input
                    type="time"
                    value={section.startTime}
                    onChange={e => onSectionChange("startTime", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 flex items-center gap-1 normal-case">
                    <Clock className="w-3 h-3" /> End Time
                  </Label>
                  <Input
                    type="time"
                    value={section.endTime}
                    onChange={e => onSectionChange("endTime", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Meeting days */}
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs text-slate-500 flex items-center gap-1 normal-case">
                  <Calendar className="w-3 h-3" /> Meeting Days
                </Label>
                <div className="flex gap-1 flex-wrap">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                    const selected = section.meetingDays.includes(day)
                    return (
                      <Button
                        key={day}
                        type="button"
                        onClick={() => {
                          const updated = selected
                            ? section.meetingDays.filter(d => d !== day)
                            : [...section.meetingDays, day]
                          onSectionChange("meetingDays", updated)
                        }}
                        className={cn(
                          "text-xs w-12 px-0 py-1 rounded border font-medium transition-colors cursor-pointer justify-center hover:text-white",
                          selected
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        )}
                      >
                        {day}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium text-slate-500 whitespace-nowrap">Group size</Label>
              <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => onGroupSizeChange(Math.max(1, groupSize - 1))}
                  className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer font-medium text-sm"
                >-</button>
                <span className="w-8 text-center text-sm font-semibold text-slate-800">{groupSize}</span>
                <button
                  type="button"
                  onClick={() => onGroupSizeChange(Math.min(20, groupSize + 1))}
                  className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer font-medium text-sm"
                >+</button>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onRandomAssign}
              className="cursor-pointer gap-1.5 h-8 text-xs"
            >
              <Shuffle className="w-3.5 h-3.5" /> Randomly Assign
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onUnassignAll}
              className="cursor-pointer gap-1.5 h-8 text-xs"
            >
              <UserX className="w-3.5 h-3.5" /> Unassign All
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddGroup}
              className="cursor-pointer gap-1.5 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Group
            </Button>
          </div>

          {(Object.keys(groups).length > 0 || unassigned.length > 0) && (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                {Object.keys(groups).length === 0 ? (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-400 text-center px-4">No groups yet — click "Randomly Assign" or "Add Group"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                    {Object.entries(groups)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([groupName, students]) => (
                        <GroupCard
                          key={groupName}
                          groupName={groupName}
                          students={students}
                          sectionId={section.id}
                          facultyMembers={facultyMembers}
                          facultyLeads={groupFacultyLeads[groupName] ?? []}
                          onFacultyLeadsChange={onGroupFacultyLeadsChange}
                          draggedStudent={draggedStudent}
                          dragOverGroup={dragOverGroup}
                          onDragStart={onDragStart}
                          onDragEnd={onDragEnd}
                          onDragOver={onDragOver}
                          onDragLeave={onDragLeave}
                          onDrop={onDrop}
                          onRenameGroup={onRenameGroup}
                          onDeleteGroup={onDeleteGroup}
                        />
                      ))}
                  </div>
                )}
              </div>

              <div
                onDragOver={(e) => onDragOver(e, section.id, "__unassigned__")}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, "__unassigned__", section.id)}
                className={`w-full lg:w-52 xl:w-56 flex-shrink-0 border-2 border-dashed rounded-lg p-3 transition-all ${isOverUnassigned
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-slate-50/50"
                  }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Users2 className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500">Unassigned</p>
                  <Badge variant="secondary" className="text-xs ml-auto">{unassigned.length}</Badge>
                </div>
                <div className="space-y-1.5">
                  {unassigned.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">All assigned!</p>
                  )}
                  {[...unassigned]
                    .sort((a, b) => a.lastName.localeCompare(b.lastName))
                    .map(student => (
                      <div
                        key={student.studentId}
                        draggable
                        onDragStart={(e) => onDragStart(e, student, "__unassigned__", section.id)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center gap-2 p-2 bg-white rounded border border-slate-200 hover:bg-slate-100 cursor-move transition-all select-none ${draggedStudent?.student.studentId === student.studentId ? "opacity-40" : ""
                          }`}
                      >
                        <GripVertical className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate leading-tight">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{student.studentId}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )
      }
    </Card >
  )
}