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
 
interface ataTableProps {
  // columns: ColumnDef<TData, TValue>[]
  data: vitalsOverviewTable[]
}

export type vitalsOverviewTable = {
  field: string
  [key: string]: string
}
const timeColumns = ["1100", "1200", "1300"]


export const vitalsOverviewData: vitalsOverviewTable[] = [ // Renamed from Payment to PaymentData to avoid name collision with the type
  {
    field: "HR",
    "1100": "70", 
    "1200": "75",
    "1300": "80",
  },
  {
    field: "BP",
    "1100": "110",
    "1200": "115",
    "1300": "120",
  },
    {
    field: "RR",
    "1100": "16",
    "1200": "18",
    "1300": "17",
  },
  {
    field: "SpO2",
    "1100": "98",
    "1200": "99",
    "1300": "97",
  },
    {
    field: "Temp",
    "1100": "98.6",
    "1200": "98.2",
    "1300": "99.0",
  },
]
export function VitalsOverview({
  // columns,
  data,
}: ataTableProps) {
  

  const columns: ColumnDef<vitalsOverviewTable>[] = [
    {
      accessorKey: "field",
      header: "",
      cell: info => {
        return (
          <div className="h-full flex justify-center">
            <p className=" w-full text-left p-0  px-2 text-xs">{info.row.original.field}</p>
          </div>
        )
      }
    },
    ...timeColumns.map(timeKey => {
      return {
        id: timeKey,
        accessorKey: timeKey as keyof vitalsOverviewTable,
       header: () => (
          <div className="flex flex-col justify-center items-center">
            <h2 className="my-1 text-neutral-500 text-xs font-light">7/29</h2>
            <h1 className="mb-1 text-xs">{timeKey}</h1>
          </div>
        ),
        cell: ({ row }: { row: Row<vitalsOverviewTable> } ) => {
          return (
            <div className="h-full flex justify-center">
              <p className=" w-full text-xs  text-right p-0  px-2">{row.original[timeKey]}</p>
            </div>
          )
        }
      }
    })
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <Card className="relative p-0 gap-3 overflow-hidden">
      <div className="px-2 pt-2 pb-6">
        <h1 className="text-xl pb-3">
          <span className="relative inline-block px-3 py-1">
            <span
              className={`absolute inset-0 bg-sky-200 rounded-full scale-110`}
              style={{
                top: '6%',
                left: '0%',
                minWidth: '2.5rem', 
                minHeight: '2.2rem', 
              }}
            ></span>
            <span className="relative">
              R 
            </span>
          </span>
          <span className="-ml-3 relative">ecent Vitals</span>
        </h1>
        <div className="rounded-md border border-sky-200">
          <Table className="rounded-md">
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="absolute bottom-0 bg-sky-200 w-full h-4"></div>
    </Card>
  )
}
