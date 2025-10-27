"use client"

import * as React from "react";
import { useEffect } from "react";
import CourseListItem from "./CourseListItem";

type Course = {
  id: string;
  name: string;
  code: string;
  semester: string;
  active: boolean;
  start_date: string;
  end_date: string;
}

async function getCourses(): Promise<Course[]> {
  return [
    {
      id: "1",
      name: "Client Playground (Click Here!)",
      code: "NUR 1",
      semester: "W26",
      active: true,
      start_date: "2026-01-12",
      end_date: "2026-04-25",
    },
    {
      id: "2",
      name: "Clinical Judgment In Adult Health",
      code: "NUR 335",
      semester: "W26",
      active: true,
      start_date: "2026-01-12",
      end_date: "2026-04-25",
    },
    {
      id: "3",
      name: "Test Course - Does not exist",
      code: "NUR 1234",
      semester: "F25",
      active: false,
      start_date: "2025-07-25",
      end_date: "2025-12-13",
    },
  ];
}

export default function CoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getCourses().then((courses) => {
      setCourses(courses);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="pl-4">Loading courses...</p>;

  return (
    <div className="pl-4">
      <h1 className="container mx-auto pt-10 text-4xl font-bold">COURSES</h1>
      {courses.map((course) => <CourseListItem key={course.id} course={course} />)}

    </div>
  );
}
