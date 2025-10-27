"use client"

import * as React from "react"
import Link from "next/link"

interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  active: boolean;
  start_date: string;
  end_date: string;
}

interface CourseListItemProps {
  course: Course;
}

export default function CourseListItem({ course }: CourseListItemProps) {
  const { id, name, code, semester, active, start_date, end_date } = course;

  return (
    <Link href={`/admin/courses/${id}`}>
      <div className={`border rounded-md my-4 p-4 hover:bg-secondary dark:hover:bg-gray-800 transition py-5 border-l-10 cursor-pointer
      ${active ? "border-l-green-800" : "border-l-red-800"}`}
      >
        <h2 className="text-xl font-semibold">{code}</h2>
        <p className="text-md text-gray-500">{name}</p>
        <p className="text-md text-gray-500">{semester}</p>
        <p className="text-sm text-gray-400">
          {start_date} → {end_date}
        </p>
      </div>
    </Link>
  );
} 
