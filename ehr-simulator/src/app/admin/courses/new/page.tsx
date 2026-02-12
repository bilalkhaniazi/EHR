"use client"
import {
  FolderPlus,
  X,
  ArrowLeft,
  ArrowRight,
  Users,
  Upload,
  AlertCircleIcon,
  CheckCircle2Icon,
  GripVertical,
  Plus,
  Pencil,
  Check,
  Trash
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
import { useRouter } from "next/navigation"
import { ChangeEvent, useState, DragEvent, useRef } from "react"

interface Student {
  groupCode: string
  userName: string
  studentId: string
  firstName: string
  lastName: string
  groupSet: string
}

interface GroupData {
  [groupName: string]: Student[]
}

const GroupTable = ({
  groupData,
  draggedStudent,
  dragOverGroup,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRenameGroup,
  onDeleteGroup
}: any) => {
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleStartEdit = (groupName: string) => {
    setEditingGroup(groupName)
    setEditValue(groupName)
  }

  const handleSaveEdit = (oldGroupName: string) => {
    if (editValue.trim() && editValue !== oldGroupName) {
      onRenameGroup(oldGroupName, editValue.trim())
    }
    setEditingGroup(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent, oldGroupName: string) => {
    if (e.key === "Enter") handleSaveEdit(oldGroupName)
    if (e.key === "Escape") {
      setEditingGroup(null)
      setEditValue("")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.entries(groupData).map(([groupName, students]: [string, any]) => (
        <div
          key={groupName}
          onDragOver={(e) => onDragOver(e, groupName)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, groupName)}
          className={`bg-white border rounded-lg p-4 shadow-sm transition-all ${dragOverGroup === groupName && draggedStudent?.fromGroup !== groupName
            ? "outline-blue-500 outline-2 bg-blue-50 shadow-lg"
            : "outline-slate-200 hover:shadow-md"
            }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
            {editingGroup === groupName ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, groupName)}
                  onBlur={() => handleSaveEdit(groupName)}
                  autoFocus
                  className="h-8 text-sm font-semibold min-w-0"
                />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex-shrink-0" onClick={() => handleSaveEdit(groupName)}>
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{groupName}</h3>
                <Button size="sm" variant="ghost" className="cursor-pointer h-6 w-6 p-0 flex-shrink-0" onClick={() => handleStartEdit(groupName)}>
                  <Pencil className="w-3 h-3 text-slate-400" />
                </Button>
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
                        This will permanently delete the group and remove all students from it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteGroup(groupName)} className="bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                  className={`flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 cursor-move transition-all select-none ${draggedStudent?.student.studentId === student.studentId ? "opacity-50" : ""
                    }`}
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
      ))}
    </div>
  )
}

export default function CreateCoursePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File>()
  const [fileUploadError, setFileUploadError] = useState("")
  const [groupData, setGroupData] = useState<GroupData>({})
  const [draggedStudent, setDraggedStudent] = useState<{ student: Student; fromGroup: string } | null>(null)
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null)

  const parseCSV = (text: string): Student[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) throw new Error("CSV file is empty or contains only headers")

    const header = lines[0].split(",").map(h => h.replace(/"/g, "").trim())
    const cols = ["Group Code", "User Name", "Student Id", "First Name", "Last Name", "Group Set"]
    const indices = cols.map(col => header.indexOf(col))

    if (indices.includes(-1)) throw new Error(`Missing columns: ${cols.filter((_, i) => indices[i] === -1).join(", ")}`)

    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values: string[] = []
      let current = ""
      let inQuotes = false
      for (let char of line) {
        if (char === '"') inQuotes = !inQuotes
        else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else current += char
      }
      values.push(current.trim())

      const clean = (idx: number) => values[idx]?.replace(/"/g, "") || ""
      return {
        groupCode: clean(indices[0]),
        userName: clean(indices[1]),
        studentId: clean(indices[2]),
        firstName: clean(indices[3]),
        lastName: clean(indices[4]),
        groupSet: clean(indices[5])
      }
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.split(".").pop()?.toLowerCase() !== "csv") {
      setFileUploadError(`Expected .csv, received .${file.name.split(".").pop()}`)
      setSelectedFile(undefined)
      setGroupData({})
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const students = parseCSV(event.target?.result as string)
        const groups = students.reduce((acc: GroupData, s) => {
          acc[s.groupCode] = [...(acc[s.groupCode] || []), s]
          return acc
        }, {})
        setGroupData(groups)
        setSelectedFile(file)
        setFileUploadError("")
      } catch (err: any) {
        setFileUploadError(err.message)
        setSelectedFile(undefined)
        setGroupData({})
      }
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setGroupData({})
    setSelectedFile(undefined)
    setFileUploadError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (e: DragEvent, toGroup: string) => {
    e.preventDefault()
    if (!draggedStudent || draggedStudent.fromGroup === toGroup) return

    const { student, fromGroup } = draggedStudent
    const newData = { ...groupData }
    newData[fromGroup] = newData[fromGroup].filter(s => s.studentId !== student.studentId)
    newData[toGroup] = [...(newData[toGroup] || []), { ...student, groupCode: toGroup }]

    setGroupData(newData)
    setDraggedStudent(null)
    setDragOverGroup(null)
  }

  const handleCreateNewGroup = () => {
    const existingGroups = Object.keys(groupData)
    let i = 1
    let name = `New Group ${i}`
    while (existingGroups.includes(name)) {
      i++
      name = `New Group ${i}`
    }
    setGroupData({ ...groupData, [name]: [] })
  }

  const handleRenameGroup = (oldName: string, newName: string) => {
    if (oldName === newName || groupData[newName]) return
    const newData = { ...groupData }
    const students = newData[oldName].map(s => ({ ...s, groupCode: newName }))
    delete newData[oldName]
    newData[newName] = students
    setGroupData(newData)
  }

  const handleDeleteGroup = (groupName: string) => {
    const newData = { ...groupData }
    delete newData[groupName]
    setGroupData(newData)
  }

  return (
    <div className="flex flex-col w-full h-screen bg-slate-50/50 overflow-hidden border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderPlus className="text-slate-400" /> Create a Course
          </h1>
          <p className="text-xs text-slate-500 mt-1">Define course and section details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push("/admin/courses")}><ArrowLeft /> Cancel</Button>
          <Button onClick={() => router.push("/admin/courses")}>Submit Course <ArrowRight /></Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
          <Card className="pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Upload className="w-5 h-5 text-blue-600" />Upload .CSV File</CardTitle>
              <CardDescription>Upload course information file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-2">
                  <Input ref={fileInputRef} onChange={handleFileChange} type="file" accept=".csv" className="pt-2 cursor-pointer" />
                  <Button className="cursor-pointer flex-shrink-0" variant="secondary" onClick={handleClear}>
                    <X /> Clear
                  </Button>
                </div>
                {fileUploadError && (
                  <Alert className="bg-red-50" variant="destructive">
                    <AlertCircleIcon /><AlertTitle>Upload failed!</AlertTitle><AlertDescription>{fileUploadError}</AlertDescription>
                  </Alert>
                )}
                {selectedFile && !fileUploadError && (
                  <Alert className="text-green-600 bg-green-50">
                    <CheckCircle2Icon /><AlertTitle>Success!</AlertTitle>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {Object.keys(groupData).length > 0 && (
            <Card className="pt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" /> Student Groups
                  </CardTitle>
                  <Button className="cursor-pointer" onClick={handleCreateNewGroup} size="sm">
                    <Plus className="w-4 h-4" /> New Group
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <GroupTable
                  groupData={groupData}
                  draggedStudent={draggedStudent}
                  dragOverGroup={dragOverGroup}
                  onDragStart={(e: any, s: Student, g: string) => { setDraggedStudent({ student: s, fromGroup: g }); e.dataTransfer.effectAllowed = "move" }}
                  onDragEnd={() => { setDraggedStudent(null); setDragOverGroup(null) }}
                  onDragOver={(e: any, g: string) => { e.preventDefault(); setDragOverGroup(g) }}
                  onDragLeave={(e: any) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverGroup(null) }}
                  onDrop={handleDrop}
                  onRenameGroup={handleRenameGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}