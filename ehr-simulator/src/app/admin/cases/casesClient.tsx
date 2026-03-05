"use client"

import { useState } from "react";
import CaseListItem from "./CaseListItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CaseCourseAssignments } from "@/actions/cases";
import { Course } from "../courses/[id]/page";
import { ChevronDown } from "lucide-react";

interface CaseClientProps {
  courses: Course[];
  caseAssignments: CaseCourseAssignments;
}

export default function CasesClient({ courses, caseAssignments }: CaseClientProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const filteredAssignments = selectedCourse && selectedCourse !== "all"
    ? caseAssignments.filter(item => item.courseId === selectedCourse)
    : caseAssignments;

  return (
    <div className="w-full">
      <header className="bg-white border-b px-8 py-4 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold tracking-tight">CASES</h1>

            <p className="text-xs text-gray-500">Manage all simulation cases</p>
          </div>
          <Link href='/admin/case-builder/form/demographics'>
            <Button>Create Case</Button>
          </Link>
        </div>
      </header>

      <div className="pt-2 px-2">
        <Select onValueChange={setSelectedCourse} value={selectedCourse} defaultValue="">
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select a fruit" />
            <ChevronDown />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Courses</SelectLabel>
              <SelectItem value="all">All Courses</SelectItem>
              {
                courses.map(course => (
                  <SelectItem
                    key={course.id}
                    value={course.id}
                  >
                    {course.code}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>


      <div className="flex flex-col gap-4 p-4">
        {
          filteredAssignments.length > 0 ? (
            filteredAssignments.map((simCase) => <CaseListItem key={simCase.id} courseCaseAssignment={simCase} />)

          ) : (
            <div className="flex justify-center items-center border border-dashed border-gray-300 rounded-md h-20">
              <p className=" font-semibold text-gray-300">No cases assigned to this course</p>
            </div>
          )
        }
      </div>
    </div>
  );
}
