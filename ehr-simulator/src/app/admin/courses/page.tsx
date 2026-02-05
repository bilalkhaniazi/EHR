"use client"
import { useEffect, useState } from "react";
import CourseListItem from "./components/CourseListItem";
import CourseListSkeleton from "./components/CourseListSkeleton";
import { getAllCourses } from "@/actions/courses";
import { Course } from "./types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

async function getCourses(): Promise<Course[]> {
  return await getAllCourses();
}

export default function CoursesPage() {
  const router = useRouter();
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
        <div className="pt-10 flex justify-between">
          <h1 className="text-4xl font-bold">COURSES</h1>
          <Button
            className="cursor-pointer"
            onClick={() => { router.push("/admin/courses/new") }}>
            Create New Course <Plus />
          </Button>
        </div>
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