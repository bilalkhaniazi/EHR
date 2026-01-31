"use client"
import { useEffect, useState } from "react";
import CourseListItem from "./components/CourseListItem";
import CourseListSkeleton from "./components/CourseListSkeleton";
import { getAllCourses } from "@/actions/courses";
import { Course } from "./types";

async function getCourses(): Promise<Course[]> {
  return await getAllCourses();
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses().then((courses) => {
      setCourses(courses);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full px-8">
        <h1 className="pt-10 text-4xl font-bold">COURSES</h1>
        {loading ? (
          <CourseListSkeleton />
        ) : (
          courses.map((course) =>
            <CourseListItem key={course.id} course={course} />
          )
        )}
      </div>
    </div>
  );
}