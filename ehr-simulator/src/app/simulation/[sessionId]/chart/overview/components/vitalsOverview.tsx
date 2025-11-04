"use client"
 
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  // type Row,
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
import { useGetFlexSheetChartingQuery } from "@/app/store/apiSlice"
import type { tableData } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import StyledTitle from "./styledTitle"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store/store"
 

export type vitalsOverviewTable = {
  field: string
  [key: string]: string
}

// matching with row ID's in FlexSheet
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
  const sessionStartTime = useSelector((state: RootState) => state.time.sessionStartTime);
  const skip = !sessionStartTime
  const { data, isLoading, isError, error, isFetching } = useGetFlexSheetChartingQuery(sessionStartTime, { skip })

  const timeOffsets = data?.timeOffsets.slice(-3) || [];

  const chartingData = data?.chartingData || [];

  // move to backend
  const filteredData = useMemo(() => {
    return chartingData.filter(row => vitalSignIds.includes(row.id));
  }, [data?.chartingData])

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
    ...timeOffsets.map(timeKey => {
      return {
        id: String(timeKey),
        accessorKey: String(timeKey) as keyof tableData,
       header: () => (
          <div className="flex flex-col justify-center items-center">
            <h2 className="my-1 text-neutral-500 text-xs font-light">7/29</h2>
            <h1 className="mb-1 text-xs">{timeKey}</h1>
          </div>
        ),
        cell: ( ) => {   // { row }: { row: Row<tableData> }
          return (
            <div className="h-full">
              <p className="text-xs w-full min-w-12 text-right pr-2">~</p> {/*row.original[timekey]*/}
            </div>
          )
        }
      }
    })
  ], [timeOffsets])


  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderTableContent = () => {
    if (isLoading || isFetching || skip) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-fit p-0 w-full justify-center items-center">
            <div className="w-full h-full grid grid-cols-4 gap-2 p-2">
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-1" />
              {Array.from({length: 20}, (_, index) => {
                return (
                  <Skeleton key={index} className="h-4 col-span-1" />
                )
              })}

            </div>
          </TableCell>
        </TableRow>
      )
    }

    // from RTK query docs
    if (isError) {
      let errorMessage = "An unknown error occurred.";
      if (error) {
        if ('status' in error && error.status) {
          errorMessage = `Error ${error.status}`;
          if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
            errorMessage += `: ${(error.data as any).message}`;
          }
        } else if ('message' in error) {
          errorMessage = `Error: ${error.message}`;
        } else {
          errorMessage = `Error: ${JSON.stringify(error)}`;
        }
      }
      console.log(errorMessage)

      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 p-0 w-full justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2 h-full w-full py-2">
              <p>Error loading vitals data</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (table.getRowModel().rows?.length) {
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
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 p-0 w-full justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2 h-full w-full py-2">
            <p className="text-sm text-neutral-500">No vitals data available</p>
          </div>
        </TableCell>
      </TableRow>
    )
    
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
