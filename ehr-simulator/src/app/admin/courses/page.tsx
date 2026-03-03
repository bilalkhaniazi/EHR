import { getAllCourses } from "@/actions/courses";
import CourseListItem from "./components/CourseListItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
  const courseResult = await getAllCourses();

  if (!courseResult.success || !courseResult.data) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Courses not found.
      </div>
    );
  }

  const courses = courseResult.data || [];

  return (
    <div className="w-full">
      <div className="w-full px-8">
        <div className="pt-10 flex justify-between">
          <h1 className="text-4xl font-bold">COURSES</h1>
          <Link href="/admin/courses/new">
            <Button className="cursor-pointer">
              Create New Course <Plus />
            </Button>
          </Link>
        </div>
        {courses.map((course) => (
          <CourseListItem key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}