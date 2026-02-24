import React from "react";
import ProfileHeader from "@/app/user/components/ProfileHeader";
import AssignedCasesList from "@/app/user/components/AssignedCasesList";
import CompletedCasesList from "@/app/user/components/CompletedCasesList";
import { createServerSupabase } from "@/utils/supabase/server";

type PerfMetrics = {
  score: number;
  accuracy: number;
  timeTakenMinutes: number;
};

type CaseItem = {
  id: string;
  name: string;
  assignedDate: string; // ISO
  status: "Assigned" | "In Progress" | "Completed";
  completionDate?: string; // ISO
  metrics?: PerfMetrics;
  feedback?: string;
  teamMembers?: string[];
  otherInfo?: string;
};

// Mock data
const mockCases: CaseItem[] = [
  {
    id: "case-1",
    name: "Sepsis Management",
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "In Progress",
  },
  {
    id: "case-2",
    name: "Acute MI",
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: "Completed",
    completionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    teamMembers: ["Alex Johnson", "Taylor Brown", "Priya Singh"]  
},
  {
    id: "case-3",
    name: "Pediatric Asthma",
    assignedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Assigned",
  },
];

export default async function ProfilePage() {
  // get server-side user info from Supabase session
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const studentName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Student";
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  const assigned = mockCases.filter((c) => c.status !== "Completed");
  const completed = mockCases.filter((c) => c.status === "Completed");

  const student = {
    name: studentName,
    avatarUrl,
    classes: ["NURS 201", "Clinical Simulation"],
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <ProfileHeader name={student.name} avatarUrl={student.avatarUrl} classes={student.classes} />

      <section>
        <h2 className="text-lg font-semibold mb-4">Assigned Simulations</h2>
        <AssignedCasesList cases={assigned} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Completed Simulations</h2>
        <CompletedCasesList cases={completed} />
      </section>
    </main>
  );
}
