import { CircleUserRound, Info } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays } from "date-fns";
import { useSimulationTime } from "../context/SimulationTimeContext";

function ChartSidebarSkeleton() {
  return (
    <div className="flex flex-col items-center justify-start h-full w-full py-8 gap-3">
      <Skeleton className="h-28 w-1/2 bg-gray-300 rounded-full mb-6" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-3/5 bg-gray-300" />
      <Skeleton className="h-4 w-3/4 bg-gray-300 mb-6" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-5/8 bg-gray-300 mb-6" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
    </div>
  );
}

export default function ChartSidebar() {
  const { isLoading, caseRow } = useSimulationTime();
  const sessionStartTime = new Date().getTime();
  const ageYears = useMemo(() => {
    if (!caseRow?.date_of_birth) return null;
    const dob = new Date(caseRow.date_of_birth);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) years -= 1;
    return years >= 0 ? years : null;
  }, [caseRow?.date_of_birth]);

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <ChartSidebarSkeleton />
      </div>
    )
  }

  if (!caseRow) {
    return (
      <div className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <p className="mt-10">No patient data.</p>
      </div>
    )
  }

  // --- Helper Functions ---

  const displayDob = (dob: string | null) => {
    if (!dob) return "N/A";
    return format(new Date(dob), "P");
  };

  const displayAdmissionDate = (admissionTs: string | null, currDate: number, daysIp: number) => {
    if (admissionTs) return format(new Date(admissionTs), "P")
    const admissionDate = subDays(currDate, daysIp)
    return format(admissionDate, "P")
  };

  const patientName = caseRow.name || [caseRow.first_name, caseRow.last_name].filter(Boolean).join(" ") || "N/A";
  const isolationName = (caseRow as { isolation_precautions?: { name?: string } | null }).isolation_precautions?.name ?? "N/A";
  const relationshipName = (caseRow as { relationship_statuses?: { name?: string } | null }).relationship_statuses?.name ?? "N/A";
  const weightDisplay = caseRow.weight_kg != null ? `${caseRow.weight_kg} kg` : "N/A";
  const heightDisplay =
    caseRow.height_ft != null || caseRow.height_in != null
      ? `${caseRow.height_ft ?? 0}'${caseRow.height_in ?? 0}"` : "N/A";
  const inpatientDays = caseRow.inpatient_duration_days ?? 0;
  const attending = caseRow.attending_provider ?? "N/A";
  const admissionDate = displayAdmissionDate(caseRow.time_of_admission, sessionStartTime, inpatientDays);

  return (
    <div className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
      <span className="rounded-full p-1 bg-gray-100 shadow-md">
        <CircleUserRound size={100} strokeWidth={0.8} color="oklch(38% 0.189 293.745)" className="rounded-full bg-white" />
      </span>
      <div className="flex flex-col items-center">
        <h1 className="text-purple-900 text-lg font-medium tracking-tight">{patientName}</h1>
        <p className="text-purple-900 text-sm tracking-tight">
          <span className="pl-2 font-normal">{ageYears != null ? `${ageYears} y.o.` : "N/A"}</span>
        </p>
        <p className="text-purple-900 text-sm font-light tracking-tight">
          DOB:
          <span className="pl-2 font-normal">{displayDob(caseRow.date_of_birth)}</span>
        </p>
        <p className="text-purple-900 text-sm font-light tracking-tight">
          Relationship:
          <span className="pl-2 font-normal">{relationshipName}</span>
        </p>

        <p className="text-purple-900 text-sm font-light tracking-tight">
          Code:
          <span className="pl-2 font-normal">{caseRow.code_status ?? "N/A"}</span>
        </p>
      </div>

      <div className="flex flex-col h-fit max-h-full py-4 px-2 rounded-lg shadow-md mt-4 border gap-6 bg-white overflow-y-auto">
        {/* Current Admission Data */}
        <div className="relative flex flex-col border bg-white border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
          <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl  px-1">This Admission</p>

          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline">Admission Date:</span>
            <span className="pl-2 font-normal">{admissionDate}</span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline">Attending:</span>
            <span className="pl-2 font-normal">{attending}</span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline">Case ID:</span>
            <span className="pl-2 font-normal">{caseRow.id}</span>
          </p>
        </div>

        {/* Clinical Info */}
        <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
          <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">Clinical Info</p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline">Height:</span>
            <span className="pl-2 font-normal">{heightDisplay}</span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline">Weight:</span>
            <span className="pl-2 font-normal">{weightDisplay}</span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline text-nowrap">Isolation:</span>
            <span className="pl-2 font-normal">{isolationName}</span>
            <span className="pl-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} color="oklch(38.1% 0.176 304.987)" />
                  </TooltipTrigger>
                  <TooltipContent className="w-fit">
                    <p className="max-w-120 text-wrap">Isolation precautions are loaded from case demographics.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline pr-2 text-nowrap">Allergies:</span>
            <span className='font-normal decoration-none no-underline px-2 bg-yellow-200 rounded-md'>
              {(caseRow.allergies ?? []).join(", ") || "N/A"}
            </span>
          </p>
          <p className="text-purple-900 text-xs font-light tracking-tight">
            <span className="underline pr-2 text-nowrap">PMH:</span>
            <span className='font-normal decoration-none no-underline rounded-md'>
              {(caseRow.medical_history ?? []).join(", ") || "N/A"}
            </span>
          </p>

        </div>

        {/* MAR */}
        <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
          <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">MAR</p>
          <p className="text-purple-900 text-xs tracking-tight">
            <span className="pl-2 font-medium">No MAR summary available.</span>
          </p>
        </div>
      </div>
    </div>
  )
}