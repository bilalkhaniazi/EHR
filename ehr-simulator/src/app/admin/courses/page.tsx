"use client"

import * as React from "react";
import { useEffect } from "react";
import CourseListItem from "./CourseListItem";
import { getAllCourses } from "@/actions/courses";
import Link from "next/link";

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
  return await getAllCourses();
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

  return (
    <div className="pl-4">
      <h1 className="container mx-auto pt-10 text-4xl font-bold">COURSES</h1>
      {courses.map((course) =>
        <CourseListItem key={course.id} course={course} />
      )}

    </div>
  );
}
