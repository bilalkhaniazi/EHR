import { getCourseById } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Calendar, Users, UserRoundX, Trash } from "lucide-react";
import { getCourseSimulations } from "@/actions/courses";
import { format } from "date-fns";
import CaseAssignment from "./caseAssignment";
import { deleteCaseAssignment, getCaseByCourse } from "@/actions/cases";


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

export type CourseSimulationsResult = Awaited<ReturnType<typeof getCourseSimulations>>;
export type CasesWithName = Awaited<ReturnType<typeof getCaseByCourse>>;


export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseById(params.id);
  const sections = await getCourseSimulations(params.id);
  const cases = await getCaseByCourse(params.id)

  const now = new Date()
  console.log(sections)

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Course not found.
      </div>
    );
  }

  const handleDeleteAssignment = async (id: string) => {
    try {
      await deleteCaseAssignment(id);

    } catch (error) {
      console.error("Failed to delete case:", error);
      alert("Something went wrong. Please try again.");

    }
  }

  const processedSims = sections.flatMap((section) =>
    section.section_assignments.map((assignment) => ({
      id: assignment.id,
      sim_time: assignment.sim_time,
      presim_time: assignment.presim_time,
      section_name: section.name,
      section_id: section.id,
      case_name: assignment.case_template.name,
      case_id: assignment.case_template.id
    }))
  ).reduce<AssignmentGroups>((acc, item) => {
    const scheduledDate = new Date(item.sim_time);

    if (scheduledDate < now) {
      acc.completed.push(item);
    } else {
      acc.assigned.push(item);
    }
    return acc;
  }, { completed: [], assigned: [] });

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50/50">
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
              sections={sections}
              cases={cases}
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
                            sections={sections}
                            cases={cases}
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
                          <Button
                            variant='ghost'
                            className="group hover:bg-red-100 size-6"
                          // onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash className="text-gray-300 group-hover:text-red-500" />
                          </Button>

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

// Reusable Empty State Component
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
