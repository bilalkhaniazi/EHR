"use client"
import { useState } from "react"
import {
  GripVertical,
  Pencil,
  Check,
  Trash
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"

export interface Student {
  groupCode: string
  userName: string
  studentId: string
  firstName: string
  lastName: string
  groupSet: string
}

export interface Groups {
  // A collection of student groups, keyed by group name. Each group contains an array of students.
  [groupName: string]: Student[]
}

interface GroupTableProps {
  groups: Groups
  draggedStudent: { student: Student; fromGroup: string } | null
  dragOverGroup: string | null
  onDragStart: (e: React.DragEvent, student: Student, groupName: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, groupName: string) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, groupName: string) => void
  onRenameGroup: (oldGroupName: string, newGroupName: string) => void
  onDeleteGroup: (groupName: string) => void
}

interface GroupDeletionAlertProps {
  groupName: string
  onDelete: (groupName: string) => void
}

interface GroupDisplayProps {
  groupName: string
  students: Student[]
  draggedStudent: { student: Student; fromGroup: string } | null
  dragOverGroup: string | null
  onDragStart: (e: React.DragEvent, student: Student, groupName: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, groupName: string) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, groupName: string) => void
  onRenameGroup: (oldGroupName: string, newGroupName: string) => void
  onDeleteGroup: (groupName: string) => void
}

const GroupDeletionAlert = ({ groupName, onDelete }: GroupDeletionAlertProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="sm" variant="ghost" className="cursor-pointer h-6 w-6 p-0 flex-shrink-0">
        <Trash className="w-3 h-3 text-red-400" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete group</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the group and all of its students.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => onDelete(groupName)} className="bg-red-600">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

const GroupDisplay = ({
  groupName,
  students,
  draggedStudent,
  dragOverGroup,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRenameGroup,
  onDeleteGroup
}: GroupDisplayProps) => {
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null)
  const [editValue, setEditNameValue] = useState("")

  const handleStartNameEdit = () => {
    setEditingGroupName(groupName)
    setEditNameValue(groupName)
  }

  const handleSaveNameEdit = () => {
    if (editValue.trim() && editValue !== groupName) {
      onRenameGroup(groupName, editValue.trim())
    }
    setEditingGroupName(null)
    setEditNameValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveNameEdit()
    if (e.key === "Escape") {
      setEditingGroupName(null)
      setEditNameValue("")
    }
  }

  return (
    <div
      onDragOver={(e) => onDragOver(e, groupName)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, groupName)}
      className={`bg-white border rounded-lg p-4 shadow-sm transition-all ${dragOverGroup === groupName && draggedStudent?.fromGroup !== groupName
        ? "outline-blue-500 outline-2 bg-blue-50 shadow-lg"
        : "outline-slate-200 hover:shadow-md"
        }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
        {editingGroupName === groupName ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Input
              value={editValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveNameEdit}
              autoFocus
              className="h-8 text-sm font-semibold min-w-0"
            />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex-shrink-0" onClick={handleSaveNameEdit}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{groupName}</h3>
            <Button onClick={handleStartNameEdit} size="sm" variant="ghost" className="cursor-pointer h-6 w-6 p-0 flex-shrink-0" >
              <Pencil className="w-3 h-3 text-slate-400" />
            </Button>
            <GroupDeletionAlert groupName={groupName} onDelete={onDeleteGroup} />
          </div>
        )}
        <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
          {students.length} {students.length === 1 ? "student" : "students"}
        </Badge>
      </div>
      <div className="space-y-2">
        {students
          .sort((a: Student, b: Student) => a.lastName.localeCompare(b.lastName))
          .map((student: Student) => (
            <div
              key={student.studentId}
              draggable
              onDragStart={(e) => onDragStart(e, student, groupName)}
              onDragEnd={onDragEnd}
              className={
                `flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 cursor-move transition-all select-none ${draggedStudent?.student.studentId === student.studentId ? "opacity-50" : ""}`
              }
            >
              <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {student.userName} • {student.studentId}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export const GroupTable = ({
  groups: groupData,
  draggedStudent,
  dragOverGroup,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRenameGroup,
  onDeleteGroup
}: GroupTableProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.entries(groupData)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
        .map(([groupName, students]) => (
          <GroupDisplay
            key={groupName}
            groupName={groupName}
            students={students}
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
  )
}