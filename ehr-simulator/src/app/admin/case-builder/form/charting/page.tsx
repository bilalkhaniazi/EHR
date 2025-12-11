'use client'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, Column } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
// import { Skeleton } from "@/components/ui/skeleton";
import { AddTableColumn } from "../labs/components/addTimeCol";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { FlexSheetData } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData";
import { Clipboard } from "lucide-react";
import { TableAssessmentSelectFormCell, TableInputFormCell } from "./components/tableInputFormCell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/context/FormContext";

export const formatTimeOffset = (minuteOffset: number) => {
  const minutesInDay = 1440;
  const minutesInHour = 60;

  const days = Math.floor(minuteOffset / minutesInDay);
  const remainingMinutesAfterDays = minuteOffset % minutesInDay;
  const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);
  const minutes = remainingMinutesAfterDays % minutesInHour;

  return { days, hours, minutes };
}

const columnHelper = createColumnHelper<FlexSheetData>();

// left column pinned
function getPinnedStyles(column: Column<FlexSheetData>): React.CSSProperties {
  const styles: React.CSSProperties = {
    width: `${column.getSize()}px`,
    minWidth: `${column.getSize()}px`,
    maxWidth: `${column.getSize()}px`,
  };
  if (!column.getIsPinned()) {
    return {};
  }
  const side = column.getIsPinned();
  return {
    ...styles,
    position: 'sticky',
    [side as string]: `${column.getStart(side)}px`,
    zIndex: side === 'left' ? 10 : 1,
    borderCollapse: 'separate'
  };
}

export function ChartingForm() {
  const { onDataChange, chartingData: initialChartingData } = useFormContext()
  const [chartingData, setChartingData] = useState<FlexSheetData[]>(initialChartingData)
  const [timePoints, setTimePoints] = useState<number[]>([180, 60, 30])
  const [visibleInPresim, setVisibleInPresim] = useState(true)

  const router = useRouter()

  const handleAddColumn = (offset: number) => {
    if (timePoints.includes(offset)) {
      return
    }
    setTimePoints(prev =>
      [...prev, offset].sort((a, b) => b - a)
    )
  }

  const handleSubmit = () => {
    onDataChange('charting', chartingData)
    console.log(chartingData)
    router.push('/admin/case-builder/form/intake-output')
  }

  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        minSize: 220,
        maxSize: 400,
        id: 'pinned',
        header: () => <div className="h-20 w-full bg-gray-50"></div>,
        cell: info => {
          const rowType = info.row.original.rowType;
          if (rowType === "titleRow") {
            const wdlDescription = info.row.original?.wdlDescription;
            if (wdlDescription && wdlDescription.length > 0) {
              return (
                <Tooltip>
                  <TooltipTrigger
                    className="px-2 font-medium text-xs text-lime-900"
                  >
                    {info.row.original.field}
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow shadow-black/30 rounded-xl ml-4 p-4 z-51 max-w-sm">
                      <h1 className="text-sm font-bold">WDL Criteria</h1>
                      <div className="space-y-2">
                        {wdlDescription.map((row, index) => (
                          <div key={index} className="text-wrap">
                            <p className="pl-2 text-xs font-semibold text-gray-800 text-wrap">{row.assessment}:</p>
                            <p className="pl-4 text-xs text-gray-600 italic text-wrap">{row.description}</p>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              );
            } else {
              return (
                <div className="flex items-center">
                  <p className="w-full h-full text-xs text-left py-0 pl-2 px-2 font-medium text-lime-900">
                    {info.row.original.field}
                  </p>
                </div>
              );
            }
          } else {
            return (
              <div className="flex items-center">
                <p className="w-full h-full text-left text-xs py-0 pl-4 text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-wrap">
                  {info.getValue()}
                </p>
              </div>

            );
          };
        },
      }),


      // map out remaining columns
      ...timePoints.map(timePoint => {
        const { days, hours, minutes } = formatTimeOffset(timePoint);
        return (

          columnHelper.accessor(row => row[timePoint], {
            id: String(timePoint),
            header: () => {
              return (
                <div className="flex justify-center items-center">
                  <div className="grid grid-cols-2 gap-x-2">
                    <p className="text-gray-800 font-light">Days: </p>
                    <p className="mb-1">{-1 * days}</p>
                    <p className="text-gray-800 font-light">Hours: </p>
                    <p className="mb-1">{-1 * hours}</p>
                    <p className="text-gray-800 font-light">Minutes: </p>
                    <p className="mb-1">{-1 * minutes}</p>
                  </div>
                </div>
              )
            },
            cell: ({ row, column, getValue, table }) => {
              const componentType = row.original.componentType
              switch (componentType) {
                case 'input':
                  return (
                    <TableInputFormCell getValue={getValue}
                      row={row}
                      column={column}
                      table={table}
                      visibleInPresim={visibleInPresim}
                    />
                  )
                case 'static':
                  return (
                    <p></p>
                  );
                case 'assessmentselect':
                  return (
                    <TableAssessmentSelectFormCell
                      getValue={getValue}
                      row={row}
                      column={column}
                      table={table}
                      visibleInPresim={visibleInPresim}
                    />)
              }
            }
          }))
      }
      )
    ],
    [timePoints, visibleInPresim]
  );

  const ptTable = useReactTable({
    data: chartingData,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setChartingData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              // 1. Create the new object
              const updatedRow = {
                ...old[rowIndex]!,
                [columnId]: value,
              };

              return updatedRow as FlexSheetData;
            }
            return row;
          })
        )
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });



  return (
    <div className="flex flex-col w-[calc(100vw-16rem)] h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div className="">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clipboard className="text-slate-400" />
            Documentation Results
          </h1>

          <p className="text-xs text-slate-500 mt-1">Step 5 of 9: Enter laboratory and imaging results</p>
        </div>

        <div>
          <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
        </div>
      </header>
      <div className="flex gap-12 items-end px-8 py-2">
        <AddTableColumn handleColumnAdd={handleAddColumn} />
        <div className="flex items-end gap-2">
          <div className="flex items-center space-x-2 border rounded-md p-2 bg-white w-fit h-fit">
            <Switch id="presim" checked={visibleInPresim} onCheckedChange={setVisibleInPresim} />
            <Label htmlFor="presim" className="text-sm font-normal cursor-pointer">{visibleInPresim ? 'Included in Pre-Sim' : 'Excluded from Pre-Sim'}</Label>
          </div>
          <div className="space-y-1.5">
            <p className="w-fit items-center justify-center flex gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-300 uppercase tracking-wide">
              <span className="size-1.5 rounded full bg-yellow-600"></span>
              Not included in Pre-Sim
            </p>
            <p className="w-fit items-center flex gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-lime-50 text-lime-600 border border-lime-300 uppercase tracking-wide">
              <span className="size-1.5 rounded full bg-lime-600"></span>
              Included in Pre-Sim
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 ">
        <main className="h-[calc(100vh-9rem)] w-full border border-gray-200 rounded-t-lg overflow-auto bg-white shadow-sm relative">
          <Table className="w-full overflow-x-auto">
            <TableHeader className=" bg-gray-50 ">
              {ptTable.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      style={getPinnedStyles(header.column)}
                      key={header.id}
                      className="border-b-2 border-gray-200 p-0"
                    >
                      {/* Render the header content using flexRender */}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {ptTable.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="h-6">
                  {row.getVisibleCells().map(cell => {
                    const componentType = row.original.componentType
                    return (
                      <TableCell
                        style={getPinnedStyles(cell.column)}
                        key={`${cell.id}-${row.original.field}`}
                        className={`min-w-50 w-120 p-0 m-0 h-6 border-separate border-gray-200 border-b  ${componentType === "static" ? "bg-lime-50" : "bg-white border-r border-separate"}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-gray-100">
              {ptTable.getFooterGroups().map(footerGroup => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="h-6 p-0 text-left text-gray-700 border-gray-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </main>
      </div>
    </div>

  );
}



export default ChartingForm