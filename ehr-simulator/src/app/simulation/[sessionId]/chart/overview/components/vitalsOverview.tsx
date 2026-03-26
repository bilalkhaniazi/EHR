"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useMemo, useState } from "react"
import StyledTitle from "./styledTitle"
import { formatTimeFromOffset } from "../../charting/page"
import { useSimulationTime } from "../../context/SimulationTimeContext"

export type VitalsOverviewTable = {
  field: string
  [key: string]: string
}

const toText = (value: string | null | undefined) => (value && value.trim() ? value : "")

const hasAnyVitals = (row: {
  hr: string | null
  bp: string | null
  rr: string | null
  temp: string | null
  spo2: string | null
  pain: string | null
  weight_kg: string | null
}) =>
  [
    row.hr,
    row.bp,
    row.rr,
    row.temp,
    row.spo2,
    row.pain,
    row.weight_kg,
  ].some((v) => Boolean(v && v.trim()))



export function VitalsOverview() {
  const [sessionStartTime] = useState(new Date().getTime())
  const { documentationResults } = useSimulationTime()

  const displayTimeOffsets = useMemo(() => {
    const rowsWithVitals = documentationResults.filter((r) =>
      hasAnyVitals({
        hr: r.hr,
        bp: r.bp,
        rr: r.rr,
        temp: r.temp,
        spo2: r.spo2,
        pain: r.pain,
        weight_kg: r.weight_kg,
      })
    )
    const offsets = [...new Set(rowsWithVitals.map((r) => r.time_offset))]
    return offsets.sort((a, b) => b - a).slice(0, 3)
  }, [documentationResults])

  const tableData = useMemo<VitalsOverviewTable[]>(() => {
    const getMostRecentValue = (
      timeOffset: number,
      field:
        | "hr"
        | "bp"
        | "rr"
        | "temp"
        | "spo2"
        | "pain"
        | "weight_kg"
    ) => {
      const atOffset = documentationResults
        .filter((r) => r.time_offset === timeOffset)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      return toText(atOffset[0]?.[field])
    }

    const makeRow = (
      label: string,
      field: "hr" | "bp" | "rr" | "temp" | "spo2" | "pain" | "weight_kg"
    ): VitalsOverviewTable => {
      const row: VitalsOverviewTable = { field: label }
      for (const offset of displayTimeOffsets) {
        row[String(offset)] = getMostRecentValue(offset, field)
      }
      return row
    }

    return [
      makeRow("HR", "hr"),
      makeRow("BP", "bp"),
      makeRow("RR", "rr"),
      makeRow("Temp", "temp"),
      makeRow("SpO2", "spo2"),
      makeRow("Pain", "pain"),
      makeRow("Weight (kg)", "weight_kg"),
    ]
  }, [documentationResults, displayTimeOffsets])

  const columns: ColumnDef<VitalsOverviewTable>[] = useMemo(() => [
    {
      accessorKey: "field",
      header: "",
      cell: info => (
        <p className="text-left pl-2 text-xs">{info.row.original.field}</p>
      )
    },
    ...displayTimeOffsets.map(timeKey => {
      return {
        id: String(timeKey),
        accessorKey: String(timeKey) as keyof VitalsOverviewTable,
        header: () => {
          const result = formatTimeFromOffset(timeKey, sessionStartTime)
          if (result.error) {
            return <span>Error</span>
          }

          return (
            <div className="flex flex-col justify-center items-center">
              <h2 className="my-1 text-neutral-500 text-xs font-light">
                {result.date}
              </h2>
              <h1 className="mb-1 text-xs">
                {result.time}
              </h1>
            </div>
          )
        },
        cell: (info: { getValue: () => unknown }) => {
          const value = info.getValue() as string
          return (
            <div className="h-full">
              <p className="text-xs w-full min-w-12 text-right pr-2">
                {value ? value : ""}
              </p>
            </div>
          )
        },
      }
    })
  ], [displayTimeOffsets, sessionStartTime])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderTableContent = () => {
    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 p-0 w-full justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2 h-full w-full py-2">
              <p className="text-sm text-neutral-500">No vitals data available</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        className="h-6 border-sky-200"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="border-sky-200 first:border-0 border-l p-0">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <Card className="relative col-span-1 p-0 gap-3 pt-2 h-fit overflow-hidden">
      <StyledTitle color="bg-sky-200" firstLetter="R" secondLetter="ecent Vitals" />
      <div className="h-fit px-2 pb-6">
        <div className="rounded-md border h-full border-sky-200">
          <Table className="rounded-md h-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-sky-200">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-10 p-0" >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}