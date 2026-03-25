'use client'

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import { useSimulationTime, type CaseRow } from "../../context/SimulationTimeContext"

const Demographics = () => {
  const { isLoading, caseRow: caseRowRaw } = useSimulationTime()
  const caseRow = caseRowRaw as CaseRow | null

  const {
    patientName,
    ageYears,
    admittingDiagnosis,
    emergencyContactDisplay,
  } = useMemo(() => {
    if (!caseRow) {
      return {
        patientName: null as string | null,
        ageYears: null as number | null,
        admittingDiagnosis: null as string | null,
        emergencyContactDisplay: "N/A" as string,
      }
    }

    const dob = caseRow.date_of_birth ?? null
    const referenceTs = caseRow.time_of_admission ?? null
    let ageYears: number | null = null
    if (dob) {
      const dobDate = new Date(dob)
      const refDate = referenceTs ? new Date(referenceTs) : new Date()
      let years = refDate.getFullYear() - dobDate.getFullYear()
      const monthDiff = refDate.getMonth() - dobDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < dobDate.getDate())) {
        years -= 1
      }
      ageYears = Number.isFinite(years) && years >= 0 ? years : null
    }

    const emergencyContactName = caseRow.emergency_contact_name ?? null
    const emergencyContactRelationship = caseRow.emergency_contact_relationship ?? null
    const emergencyContactDisplayName = emergencyContactName ?? "N/A"
    const emergencyContactDisplayRelationship = emergencyContactRelationship ?? "N/A"
    const emergencyContactDisplay = emergencyContactName
      ? `${emergencyContactDisplayName} (${emergencyContactDisplayRelationship})`
      : emergencyContactDisplayName

    return {
      patientName: caseRow.name ?? null,
      ageYears,
      admittingDiagnosis: caseRow.admitting_diagnosis ?? caseRow.description ?? null,
      emergencyContactDisplay,
    }
  }, [caseRow])

  if (isLoading) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
        <CardContent className="px-4 py-2">
          <p className="text-sm text-slate-600">Loading demographics...</p>
        </CardContent>
        <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>
      </Card>
    )
  }

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
      <CardContent className="px-4 space-y-1">
        <div className="flex">
          <p className="text-sm pr-2 font-light">Patient Name: </p>
          <p className="text-sm">{patientName ?? "N/A"}</p>
        </div>
        <Separator className="bg-lime-200" />
        <div className="flex">
          <p className="text-sm pr-2 font-light">Age: </p>
          <p className="text-sm">{ageYears !== null ? `${ageYears} y.o.` : "N/A"}</p>
        </div>
        <Separator className="bg-lime-200" />
        <div className="flex">
          <p className="text-sm pr-2 font-light">Diagnosis: </p>
          <p className="text-sm">{admittingDiagnosis ?? "N/A"}</p>
        </div>
        <Separator className="bg-lime-200" />
        <div className="flex">
          <p className="text-sm pr-2 font-light">Emergency Contact: </p>
          <p className="text-sm">
            {emergencyContactDisplay}
          </p>
        </div>
      </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>
    </Card>
  )
}

export default Demographics
