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
  Plus
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState, DragEvent, useRef } from "react"
import { GroupTable, Student, Groups } from "./GroupTable"


export default function CreateCoursePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File>()
  const [fileUploadError, setFileUploadError] = useState("")
  const [groups, setGroupData] = useState<Groups>({})
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
        const groups = students.reduce((acc: Groups, s) => {
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
    const newData = { ...groups }
    newData[fromGroup] = newData[fromGroup].filter(s => s.studentId !== student.studentId)
    newData[toGroup] = [...(newData[toGroup] || []), { ...student, groupCode: toGroup }]

    setGroupData(newData)
    setDraggedStudent(null)
    setDragOverGroup(null)
  }

  const handleCreateNewGroup = () => {
    const existingGroups = Object.keys(groups)
    let i = 1
    let name = `New Group ${i}`
    while (existingGroups.includes(name)) {
      i++
      name = `New Group ${i}`
    }
    setGroupData({ ...groups, [name]: [] })
  }

  const handleRenameGroup = (oldName: string, newName: string) => {
    if (oldName === newName || groups[newName]) return
    const newData = { ...groups }
    const students = newData[oldName].map(s => ({ ...s, groupCode: newName }))
    delete newData[oldName]
    newData[newName] = students
    setGroupData(newData)
  }

  const handleDeleteGroup = (groupName: string) => {
    const newData = { ...groups }
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
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> Upload .CSV File
              </CardTitle>
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

          {Object.keys(groups).length > 0 && (
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Student Groups
                  <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                    {Object.keys(groups).length} {Object.keys(groups).length === 1 ? "group" : "groups"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                    {(() => { const total = Object.values(groups).reduce((sum, students) => sum + students.length, 0); return `${total} ${total === 1 ? "student" : "students"}`; })()}
                  </Badge>
                </CardTitle>
                <Button className="cursor-pointer" onClick={handleCreateNewGroup} size="sm">
                  <Plus className="w-4 h-4" /> New Group
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <GroupTable
                  groups={groups}
                  draggedStudent={draggedStudent}
                  dragOverGroup={dragOverGroup}
                  onDragStart={(e: React.DragEvent, s: Student, g: string) => { setDraggedStudent({ student: s, fromGroup: g }); e.dataTransfer.effectAllowed = "move" }}
                  onDragEnd={() => { setDraggedStudent(null); setDragOverGroup(null) }}
                  onDragOver={(e: React.DragEvent, g: string) => { e.preventDefault(); setDragOverGroup(g) }}
                  onDragLeave={(e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverGroup(null) }}
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