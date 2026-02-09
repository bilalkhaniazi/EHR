// "use client"
// import { getAllSimCases } from "@/actions/cases";

import * as React from "react";
import CaseListItem from "./CaseListItem";
import { Button } from "@/components/ui/button";
import { getAllSimCases } from "@/actions/cases";


export default async function CasesPage() {
  const casesResult = await getAllSimCases()

  if (!casesResult.success) {
    return (
      <div>Failed to fetch simulation cases</div>
    )
  }

  const casesData = casesResult.data || []

  return (
    <div className="w-full">
      <header className="bg-white border-b px-8 py-6 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold tracking-tight">CASES</h1>

            <p className="text-xs text-gray-500">Manage all simulation cases</p>
          </div>
          <Button>Create Case</Button>
        </div>
      </header>


      <div className="flex flex-col gap-1 px-2">
        {casesData.map((simCase) => <CaseListItem key={simCase.id} simCase={simCase} />)}
      </div>
    </div>
  );
}
