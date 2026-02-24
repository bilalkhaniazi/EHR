"use client"
import { useState } from "react"
import { GripVertical, Pencil, Check, Trash2, User, UserCog, ChevronsUpDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export interface Student {
  userName: string
  studentId: string
  firstName: string
  lastName: string
}

export interface FacultyMember {
  id: string
  name: string
  email: string
}

interface GroupCardProps {
  groupName: string
  students: Student[]
  sectionId: string
  facultyMembers: FacultyMember[]
  facultyLeads: string[]
  onFacultyLeadsChange: (sectionId: string, groupName: string, facultyIds: string[]) => void
  draggedStudent: { student: Student; fromGroup: string; fromSection: string } | null
  dragOverGroup: string | null
  onDragStart: (e: React.DragEvent, student: Student, fromGroup: string, fromSection: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, sectionId: string, groupName: string) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, toGroup: string, toSection: string) => void
  onRenameGroup: (sectionId: string, oldName: string, newName: string) => void
  onDeleteGroup: (sectionId: string, groupName: string) => void
}

export const GroupCard = ({
  groupName,
  students,
  sectionId,
  facultyMembers,
  facultyLeads,
  onFacultyLeadsChange,
  draggedStudent,
  dragOverGroup,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRenameGroup,
  onDeleteGroup,
}: GroupCardProps) => {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const [facultyOpen, setFacultyOpen] = useState(false)

  const dropKey = `${sectionId}::${groupName}`
  const isOver = dragOverGroup === dropKey && draggedStudent?.fromSection === sectionId && draggedStudent?.fromGroup !== groupName

  const handleStartEdit = () => {
    setEditing(true)
    setEditValue(groupName)
  }

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue.trim() !== groupName) {
      onRenameGroup(sectionId, groupName, editValue.trim())
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveEdit()
    if (e.key === "Escape") setEditing(false)
  }

  return (
    <div
      onDragOver={(e) => onDragOver(e, sectionId, groupName)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, groupName, sectionId)}
      className={`bg-white border rounded-lg p-3 shadow-sm transition-all flex flex-col ${isOver
        ? "ring-2 ring-blue-400 bg-blue-50 shadow-md"
        : "border-slate-200 hover:shadow-md"
        }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 min-w-0">
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              autoFocus
              className="h-7 text-sm font-semibold min-w-0"
            />
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 flex-shrink-0" onClick={handleSaveEdit}>
              <Check className="w-3.5 h-3.5 text-green-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
            <span className="font-semibold text-slate-800 text-sm truncate">Group {groupName}</span>
            <Button onClick={handleStartEdit} size="sm" variant="ghost" className="cursor-pointer h-6 w-6 p-0 flex-shrink-0">
              <Pencil className="w-3 h-3 text-slate-400" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="cursor-pointer h-6 w-6 p-0 flex-shrink-0">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Group {groupName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Students in this group will be moved to the unassigned pool.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteGroup(sectionId, groupName)} className="bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
          {students.length} <User />
        </Badge>
      </div>

      {/* Faculty Leads */}
      <div className="mb-2 pb-2 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Faculty Lead(s)</p>
        <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between h-7 text-xs font-normal cursor-pointer text-slate-500"
            >
              <span className="flex items-center gap-1.5">
                <UserCog className="w-3 h-3" />
                {facultyLeads.length === 0
                  ? "Assign faculty..."
                  : `${facultyLeads.length} assigned`}
              </span>
              <ChevronsUpDown className="h-3 w-3 opacity-50 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-72" align="start">
            <Command>
              <CommandInput placeholder="Search faculty..." />
              <CommandList>
                <CommandEmpty>No faculty found.</CommandEmpty>
                <CommandGroup>
                  {facultyMembers.map(member => {
                    const isSelected = facultyLeads.includes(member.id)
                    return (
                      <CommandItem
                        key={member.id}
                        value={member.name}
                        onSelect={() => {
                          const updated = isSelected
                            ? facultyLeads.filter(id => id !== member.id)
                            : [...facultyLeads, member.id]
                          onFacultyLeadsChange(sectionId, groupName, updated)
                        }}
                        className="cursor-pointer"
                      >
                        <Check className={cn("mr-2 h-3.5 w-3.5 flex-shrink-0", isSelected ? "opacity-100 text-slate-700" : "opacity-0")} />
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
        {facultyLeads.length > 0 && (
          <div className="flex flex-col gap-1 mt-1.5">
            {facultyLeads.map(id => {
              const member = facultyMembers.find(f => f.id === id)
              if (!member) return null
              return (
                <div key={id} className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="font-medium text-slate-800 truncate">{member.name}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 cursor-pointer flex-shrink-0 ml-1"
                    onClick={() => onFacultyLeadsChange(sectionId, groupName, facultyLeads.filter(fid => fid !== id))}
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        {students.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-3">Drop students here</p>
        )}
        {[...students]
          .sort((a, b) => a.lastName.localeCompare(b.lastName))
          .map((student) => (
            <div
              key={student.studentId}
              draggable
              onDragStart={(e) => onDragStart(e, student, groupName, sectionId)}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 cursor-move transition-all select-none ${draggedStudent?.student.studentId === student.studentId ? "opacity-40" : ""
                }`}
            >
              <GripVertical className="size-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {student.userName} · {student.studentId}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}