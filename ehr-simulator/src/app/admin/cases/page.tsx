import { getCourseCaseAssignments } from "@/actions/cases";
import { getAllCourses } from "@/actions/courses";
import CasesClient from "./casesClient";



export default async function CasesPage() {
  const [courseResults, caseAssignmentResults] = await Promise.all([
    getAllCourses(),
    getCourseCaseAssignments()
  ]);

  if (!courseResults || !caseAssignmentResults.success) {
    return (
      <div>Failed to fetch simulation cases</div>
    )
  }
  const assignments = caseAssignmentResults.data || [];

  return (
    <CasesClient
      courses={courseResults}
      caseAssignments={assignments}
    />
  );
}