import { getCourseById } from "@/actions/courses";

interface CoursePageProps {
  params: { id: string };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseById(params.id);

  if (!course) {
    return <div className="p-4">Course not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{course.name}</h1>
      <p className="text-lg">Code: {course.code}</p>
      <p className="text-lg">Semester: {course.semester}</p>
      <p className="text-lg">Active: {course.active ? "Yes" : "No"}</p>
      <p className="text-lg">Start: {course.start_date}</p>
      <p className="text-lg">End: {course.end_date}</p>
    </div>
  );
}
