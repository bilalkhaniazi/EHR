"use client"
 
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type Row,
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
import { Card } from "../ui/card"
import { useGetFlexSheetChartingQuery } from "@/app/apiSlice"
import type { tableData } from "../flexSheets/tableData"
import { useMemo } from "react"
import { Skeleton } from "../ui/skeleton"
import StyledTitle from "./styledTitle"
 

export type vitalsOverviewTable = {
  field: string
  [key: string]: string
}
const timeColumns = ["1100", "1200", "1300"]

 const vitalSignIds = [
    "hrInput",
    "bpInput",
    "rrInput",
    "tempInput",
    "spo2Input",
    "painInput",
    "weightKgInput",
  ];

export function VitalsOverview() {
  
  const { data, isLoading, isError, error, isFetching } = useGetFlexSheetChartingQuery()

  const tableData = useMemo(() => data?.chartingData || [], [data?.chartingData])
  
  // move to backend
  const filteredData = useMemo(() => tableData.filter(row => {
    return vitalSignIds.includes(row.id)
  }), [tableData])

  const columns: ColumnDef<tableData>[] = useMemo(() => [
    {
      accessorKey: "field",
      header: "",
      cell: info => {
        return (
            <p className="text-left pl-2 text-xs">{info.row.original.field}</p>
        )
      }
    },
    ...timeColumns.map(timeKey => {
      return {
        id: timeKey,
        accessorKey: timeKey as keyof tableData,
       header: () => (
          <div className="flex flex-col justify-center items-center">
            <h2 className="my-1 text-neutral-500 text-xs font-light">7/29</h2>
            <h1 className="mb-1 text-xs">{timeKey}</h1>
          </div>
        ),
        cell: ({ row }: { row: Row<tableData> } ) => {
          return (
            <div className="h-full">
              <p className="text-xs w-full min-w-12 text-right pr-2">12</p> {/*row.original[timekey]*/}
            </div>
          )
        }
      }
    })
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  





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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id} className="h-6 border-sky-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-sky-200 first:border-0 border-l p-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 p-0 w-full justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-2 h-full w-full py-2">
                      <Skeleton className="h-7 w-5/6" />
                      <Skeleton className="h-5 w-5/6" />
                      <Skeleton className="h-5 w-5/6" />
                      <Skeleton className="h-5 w-5/6" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}
