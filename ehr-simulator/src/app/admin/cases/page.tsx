"use client"
// import { getAllSimCases } from "@/actions/cases";

import * as React from "react";
import { useEffect } from "react";
import CaseListItem from "./CaseListItem";
import CreateCaseButton from "../components/CreateCaseButton";

type SimCase = {
  id: string;
  name: string;
  patient_name: string;
  description: string;
}

async function getCases(): Promise<SimCase[]> {
  return [
    {
      id: "1",
      name: "Fluid & Electrolyte Simulation",
      patient_name: "Harry Adams",
      description: "Recently returned from a Caribbean cruise. Reports ongoing nausea and vomiting for 3 days. Has not been eating or drinking. Presents with dizziness and fatigue. Complains of generalized weakness and nausea. Has not urinated much in the past 24 hours",
    },
  ];
}

export default function CasesPage() {
  const [cases, setCases] = React.useState<SimCase[]>([]);

  useEffect(() => {
    getCases().then((cases) => {
      setCases(cases);
    });
  }, []);

  return (
    <div className="pl-2">
      <h1 className="container mx-auto pt-10 text-4xl font-bold">CASES</h1>
      {cases.map((simCase) => <CaseListItem key={simCase.id} simCase={simCase} />)}
      <CreateCaseButton />
    </div>
  );
}
