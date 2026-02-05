"use client"
import { FolderPlus, X, ArrowLeft, ArrowRight, Users, Upload, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"

export default function CreateCoursePage() {
  const router = useRouter();
  const cancelCourse = () => {
    router.push("/admin/courses");
  }
  const submitCourse = () => {
    router.push("/admin/courses");
  }

  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileUploadError, setFileUploadError] = useState<string>("");
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return
    }
    if (files?.length === 1) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === "csv") {
        setSelectedFile(file);
        setFileUploadError("");
      } else {
        e.target.value = ''; // clear file from input element
        setSelectedFile(undefined);
        const message = `Expected .csv file, but received .${ext} file instead. Please try again.`
        setFileUploadError(message);
      }
    }
  }

  const FileUploadErrorAlert = () => (
    <Alert className="max-w-md bg-red-50" variant={"destructive"}>
      <AlertCircleIcon />
      <AlertTitle className="font-bold">File upload failed!</AlertTitle>
      <AlertDescription>
        {fileUploadError}
      </AlertDescription>
    </Alert>
  )
  const FileUploadSuccessAlert = () => (
    <Alert className="text-green-600 max-w-md bg-green-50" variant={"default"}>
      <CheckCircle2Icon />
      <AlertTitle className="font-bold">File uploaded successfully!</AlertTitle>
    </Alert>
  )

  return (

    <div className="flex flex-col w-full h-[calc(100vh)] bg-slate-50/50 overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderPlus className="text-slate-400" /> Create a Course
          </h1>
          <p className="text-xs text-slate-500 mt-1">Define course and section details</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            onClick={cancelCourse}
            className="cursor-pointer">
            <ArrowLeft /> Cancel
          </Button>
          <Button
            onClick={submitCourse}
            className="cursor-pointer">
            Submit Course <ArrowRight />
          </Button>
        </div>
      </header>

      <div className="flex overflow-y-auto flex-col w-full bg-slate-50/50">
        <div className="flex-1 p-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto space-y-6 pb-20">

            {/* Form content */}

            <Card className="border-slate-200 shadow-sm pt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Create Sections
                </CardTitle>
                <CardDescription>Assign students, instructors, and meeting times to sections</CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>


            <Card className="border-slate-200 shadow-sm pt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Upload .CSV File
                </CardTitle>
                <CardDescription>Upload course information file</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <Input
                      onChange={handleFileChange}
                      type="file"
                      accept=".csv"
                      className="pt-2 cursor-pointer text-left" />
                    <Button
                      onClick={(e) => {
                        setSelectedFile(undefined);
                        setFileUploadError("");
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                      className="cursor-pointer"
                      variant={"secondary"}>
                      <X />Clear
                    </Button>
                  </div>
                  {fileUploadError && <FileUploadErrorAlert />}
                  {selectedFile && <FileUploadSuccessAlert />}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}