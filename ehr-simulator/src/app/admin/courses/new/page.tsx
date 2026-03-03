"use client"
import {
  FolderPlus,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  Users,
  Upload,
  AlertCircleIcon,
  CheckCircle2Icon,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState, useRef } from "react"
import { GroupTable, Student, Groups, GroupSections } from "./GroupTable"
import { SectionsCard, SectionData, FacultyMember } from "./SectionsCard"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Placeholder faculty data (replace with DB fetch) ---
const PLACEHOLDER_FACULTY: FacultyMember[] = [
  { id: "f1", name: "Dr. Sarah Mitchell", email: "s.mitchell@university.edu" },
  { id: "f2", name: "Dr. James Okafor", email: "j.okafor@university.edu" },
  { id: "f3", name: "Prof. Linda Chen", email: "l.chen@university.edu" },
  { id: "f4", name: "Dr. Marcus Webb", email: "m.webb@university.edu" },
  { id: "f5", name: "Prof. Anita Patel", email: "a.patel@university.edu" },
  { id: "f6", name: "Dr. Robert Torres", email: "r.torres@university.edu" },
]

const DEFAULT_SECTIONS: SectionData[] = [
  { id: "01", startTime: "", endTime: "", meetingDays: [], facultyIds: [] },
  { id: "02", startTime: "", endTime: "", meetingDays: [], facultyIds: [] },
  { id: "03", startTime: "", endTime: "", meetingDays: [], facultyIds: [] },
]

const SEMESTERS = ["Winter 2026", "Summer 2026", "Fall 2026", "Winter 2027", "Summer 2027", "Fall 2027"]

export default function CreateCoursePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // CSV / groups state
  const [selectedFile, setSelectedFile] = useState<File>()
  const [fileUploadError, setFileUploadError] = useState("")
  const [groups, setGroupData] = useState<Groups>({})
  const [groupSections, setGroupSections] = useState<GroupSections>({})
  const [draggedStudent, setDraggedStudent] = useState<{ student: Student; fromGroup: string } | null>(null)
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null)

  // Sections state
  const [sectionCount, setSectionCount] = useState<1 | 2 | 3>(1)
  const [sections, setSections] = useState<SectionData[]>(DEFAULT_SECTIONS)
  const [semester, setSemester] = useState("")

  // --- CSV Parsing ---
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
        const parsed = students.reduce((acc: Groups, s) => {
          acc[s.groupCode] = [...(acc[s.groupCode] || []), s]
          return acc
        }, {})
        setGroupData(parsed)
        setGroupSections({})
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
    setGroupSections({})
    setSelectedFile(undefined)
    setFileUploadError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- Drag & drop ---
  const handleDrop = (e: React.DragEvent, toGroup: string) => {
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

  // --- Group management ---
  const handleCreateNewGroup = () => {
    const existing = Object.keys(groups)
    let i = 1
    let name = `New Group ${i}`
    while (existing.includes(name)) { i++; name = `New Group ${i}` }
    setGroupData({ ...groups, [name]: [] })
  }

  const handleRenameGroup = (oldName: string, newName: string) => {
    if (oldName === newName || groups[newName]) return
    const newData = { ...groups }
    const students = newData[oldName].map(s => ({ ...s, groupCode: newName }))
    delete newData[oldName]
    newData[newName] = students
    setGroupData(newData)

    const newSections = { ...groupSections }
    newSections[newName] = newSections[oldName] ?? null
    delete newSections[oldName]
    setGroupSections(newSections)
  }

  const handleDeleteGroup = (groupName: string) => {
    const newData = { ...groups }
    delete newData[groupName]
    setGroupData(newData)

    const newSections = { ...groupSections }
    delete newSections[groupName]
    setGroupSections(newSections)
  }

  const handleAssignSection = (groupName: string, sectionId: string | null) => {
    setGroupSections(prev => ({ ...prev, [groupName]: sectionId }))
  }

  const handleSectionCountChange = (count: 1 | 2 | 3) => {
    setSectionCount(count)
    const activeSectionIds = Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0"))
    setGroupSections(prev => {
      const updated = { ...prev }
      for (const groupName of Object.keys(updated)) {
        if (updated[groupName] && !activeSectionIds.includes(updated[groupName]!)) {
          updated[groupName] = null
        }
      }
      return updated
    })
  }

  const handleSectionChange = (id: string, field: keyof Omit<SectionData, "id">, value: string | string[]) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const totalStudents = Object.values(groups).reduce((sum, s) => sum + s.length, 0)

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

          {/* CSV Upload */}
          <Card className="pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="size-5 text-blue-600" /> Upload .CSV File
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

          {/* Course Details */}
          <Card className="pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="size-5 text-blue-600" /> Course Details
              </CardTitle>
              <CardDescription>Enter course name and description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name" className="text-sm font-medium text-slate-600">Course Name</Label>
                  <Input id="course-name" placeholder="e.g., NUR 305" className="w-1/2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-description" className="text-sm font-medium text-slate-600">Course Description</Label>
                  <Textarea id="course-description" placeholder="Enter a brief description of the course..." className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger className="w-1/2 cursor-pointer">
                      <SelectValue placeholder="Select a semester..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections + Faculty */}
          <SectionsCard
            sectionCount={sectionCount}
            onSectionCountChange={handleSectionCountChange}
            sections={sections}
            onSectionChange={handleSectionChange}
            allFaculty={PLACEHOLDER_FACULTY}
          />

          {/* Group Management */}
          {Object.keys(groups).length > 0 && (
            <Card className="pt-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="size-5 text-blue-600" /> Student Groups
                    <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                      {Object.keys(groups).length} {Object.keys(groups).length === 1 ? "group" : "groups"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                      {totalStudents} {totalStudents === 1 ? "student" : "students"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Manage groups and assign them to sections</CardDescription>
                </div>
                <Button className="cursor-pointer" onClick={handleCreateNewGroup} size="sm">
                  <Plus className="w-4 h-4" /> New Group
                </Button>
              </CardHeader>
              <CardContent>
                <GroupTable
                  groups={groups}
                  groupSections={groupSections}
                  sectionCount={sectionCount}
                  draggedStudent={draggedStudent}
                  dragOverGroup={dragOverGroup}
                  onDragStart={(e, s, g) => { setDraggedStudent({ student: s, fromGroup: g }); e.dataTransfer.effectAllowed = "move" }}
                  onDragEnd={() => { setDraggedStudent(null); setDragOverGroup(null) }}
                  onDragOver={(e, g) => { e.preventDefault(); setDragOverGroup(g) }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverGroup(null) }}
                  onDrop={handleDrop}
                  onRenameGroup={handleRenameGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onAssignSection={handleAssignSection}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}