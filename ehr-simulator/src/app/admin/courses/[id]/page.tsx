import { getCourseById } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Calendar, Users, UserRoundX } from "lucide-react";
import { getSimAssignments } from "@/actions/cases";
import { format } from "date-fns";
import CaseAssignment from "./components/caseAssignment";
import { getCaseByCourseId } from "@/actions/cases";
import DeleteCaseButton from "./components/deleteCaseButton";


interface CoursePageProps {
  params: { id: string };
}

interface AssignmentGroups {
  completed: SimAssignment[];
  assigned: SimAssignment[];
}

interface SimAssignment {
  id: string;
  sim_time: string;
  presim_time: string;
  section_name: string;
  section_id: string;
  case_name: string;
  case_id: string;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const [course, sectionsResult, casesResult] = await Promise.all([
    getCourseById(params.id),
    getSimAssignments(params.id),
    getCaseByCourseId(params.id)
  ]);
  // console.log(sections)

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Course not found.
      </div>
    );
  }

  if (!sectionsResult.success || !casesResult.success) {
    return <div>Error loading data: {sectionsResult.message || casesResult.message}</div>
  }

  const sectionsData = sectionsResult.data ?? [];
  const casesData = casesResult.data ?? [];

  const processedSims = sectionsData.flatMap((section) =>
    section.section_assignments.map((assignment) => {

      // TS believes case_data is an array, when it is actually an object
      const caseName = Array.isArray(assignment.case_data)
        ? assignment.case_data[0]?.name
        : assignment.case_data?.name;

      const caseId = Array.isArray(assignment.case_data)
        ? assignment.case_data[0]?.id
        : assignment.case_data?.id;

      return {
        id: assignment.id,
        sim_time: assignment.sim_time,
        presim_time: assignment.presim_time,
        section_name: section.name,
        section_id: section.id,
        case_name: caseName ?? "Unknown Case",
        case_id: caseId ?? ""
      };
    })
  ).reduce<AssignmentGroups>((acc, item) => {
    const scheduledDate = new Date(item.sim_time);
    const now = new Date()

    if (scheduledDate < now) {
      acc.completed.push(item);
    } else {
      acc.assigned.push(item);
    }
    return acc;
  }, { completed: [], assigned: [] });

  return (
    <div className="h-screen w-full bg-gray-50/50">
      <header className="bg-white border-b px-8 py-6 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-end gap-3">
              <h1 className="text-5xl font-bold tracking-tight text-blue-900">
                {course.code}
              </h1>
              <Badge className="bg-gray-100 text-black text-md ">
                {course.semester}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Manage assigned for cases this course.</p>
          </div>
          <Button>Edit Course</Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Assigned Simulations</h2>
            <CaseAssignment
              sections={sectionsData}
              cases={casesData}
              isEditMode={false}
            />
          </div>

          <Card className="p-0 overflow-hidden">
            <CardContent className="p-0">
              {processedSims.assigned.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 ">
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead>Simulation Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedSims.assigned.map((assignment) => (
                      <TableRow key={assignment.id} className="hover:bg-transparent">
                        <TableCell>
                          <div className="font-medium flex items-center gap-2 text-gray-600">
                            <Calendar size={14} />
                            <p>{format(assignment.sim_time, 'Pp')}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">{assignment.case_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            {assignment.section_name}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          <CaseAssignment
                            isEditMode={true}
                            sections={sectionsData}
                            cases={casesData}
                            existing_id={assignment.id}
                            initialData={
                              {
                                sectionId: assignment.section_id,
                                caseId: assignment.case_id,
                                simTime: assignment.sim_time,
                                presimTime: assignment.presim_time
                              }
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="No upcoming simulations scheduled" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-gray-700">Past Simulations</h2>
          <Card className="p-0 overflow-hidden">
            <CardContent className="p-0">
              {processedSims.completed.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gry-50">
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead>Simulation Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead className="">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedSims.completed.map((assignment) => (
                      <TableRow key={assignment.id} className="hover:bg-transparent">
                        <TableCell>
                          <div className="font-medium flex items-center gap-2 text-gray-600">
                            <Calendar size={14} />
                            <p>{format(assignment.sim_time, 'P')}</p>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.case_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            {assignment.section_name}
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            Completed
                          </Badge>
                          <DeleteCaseButton caseId={assignment.id} />

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="No completed simulations found" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Empty Case Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4  text-center text-gray-500">
      <div className="rounded-full bg-gray-100 p-3 mb-4 border">
        <UserRoundX className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}
