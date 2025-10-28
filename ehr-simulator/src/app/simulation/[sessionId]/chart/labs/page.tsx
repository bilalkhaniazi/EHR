'use client'

import type { ImagingData, LabTableData, PathologyReportData } from "./components/labsData"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
// import AddBgDemo from "./addBgDemo";

import { useGetLabsQuery  } from "@/app/store/apiSlice";   //useAddLabColumnMutation
import { Skeleton } from "@/components/ui/skeleton";
import ImagingReport from "./components/imagingReport";
import PathologyReport from "./components/pathologyReport";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { formatTimeFromOffset } from "../charting/page";
import { ShieldAlert } from "lucide-react";

// Define the structure for initial lab results when adding a new column
export interface NewLabResult {
  labName: string;
  value: string;
}

export const getResultStatus = (initialValue: string, normalRange: {low: number, high: number} | undefined, criticalRange: {low: number, high: number} | undefined) => {
  const numericValue = parseFloat(initialValue)

  if (isNaN(numericValue)) {
    return 'invalid';
  }
  if (criticalRange && (numericValue < criticalRange.low || numericValue > criticalRange.high)) {
    return "critical";
  }
  if (normalRange && (numericValue < normalRange.low || numericValue > normalRange.high)) {
    return "abnormal";
  }
  return "normal";
}

const columnHelper = createColumnHelper<LabTableData>();

// left column pinned
function getPinnedStyles(column: any): React.CSSProperties {
  if (!column.getIsPinned()) {
  return {};
  }
  const side = column.getIsPinned();
  return {
  position: 'sticky',
  [side]: `${column.getStart(side)}px`,
  zIndex: side === 'left' ? 2 : 1,
  };
}

export function LabPage() {
  const simStartTime = useSelector((state: RootState) => state.time.sessionStartTime);
  const skip = !simStartTime
  
  const { data, isLoading, isFetching, isError, error } = useGetLabsQuery(simStartTime, { skip });

  // const [addLabColumn] = useAddLabColumnMutation();

  const labTableData = data?.labTableData || [];
  const timePoints = data?.timePoints || [];
  
  useEffect(() =>{
    console.log(labTableData)
  }, [labTableData])

// will need backend to add column,   
  // const handleColumnAdd = useCallback( async(initialLabResults?: NewLabResult[]) => {
  //   const now = new Date();
  //   // Format the current date and time to match the existing dateKey format (e.g., "MM/DD/YYYY HH:MM")
  //   const newDateKey = now.toLocaleDateString("en-US", {
  //     month: "2-digit", // Ensure two digits for month
  //     day: "2-digit",   // Ensure two digits for day
  //   }) + " " + now.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false, // Use 24-hour format for consistency
  //   });

  //   try{
  //     await addLabColumn({newDateKey, initialLabResults}).unwrap();
  //     toast.success(`New lab added at ${newDateKey}`)
  //   } catch (err) {
  //     toast.error(`Failed to add column: ${err instanceof Error ? err.message : String(err)}`);
  //     console.error('Failed to add column:', err);
  //   }
  // }, [addLabColumn]);
  
      
  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        id: 'pinned',
        header: () => <h1 className="w-full h-full bg-gray-50"></h1>,
        cell: info => {
          const rowType = info.row.original.rowType;
          const field = info.row.original.field
          if (rowType === "divider") {
            return (
              <p className="text-left text-xs py-0 px-2 font-medium text-blue-900">
                {field}
              </p>
            );
          } 
          else {
            const labRange = info.row.original?.normalRange;
            if (labRange) {
              const unit = info.row.original?.unit || ''
              return (
                <Tooltip>
                  <TooltipTrigger className="w-full font-normal text-xs text-neutral-700 shadow-none rounded-none">
                    <div className="flex justify-end w-full">
                      <p className="text-right font-normal px-2 text-xs text-neutral-700">{field}</p>
                      {unit && <p className="text-right font-normal pr-2 text-xs tracking-tight text-neutral-400">{unit}</p>}
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow border border-gray-200 rounded-xl ml-4 p-2 z-10">
                      <h1 className="text-md font-semibold">{field}</h1>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <p className="pl-2 text-gray-800 text-xs font-medium">
                            <span className="font-normal">Low: </span>
                            &#60;{labRange.low}
                          </p>
                          <p className="pl-2 text-gray-800 text-xs font-medium">
                            <span className="font-normal">High: </span> 
                            &#62;{labRange.high}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              );
            } 
            return (
                <p className="text-right font-normal px-2 text-xs text-neutral-700">
                  {field}
                </p>
              );
            }
          }
        },
      ),

      // map out remaining columns
      ...timePoints.map(timePoint => {
        const { time: displayTime, date: displayDate } = formatTimeFromOffset(timePoint, simStartTime);
        return(
      
        columnHelper.accessor(row => row[timePoint], {
          id: String(timePoint),
          header: () => {
            return (
              <div className="flex flex-col justify-center items-center">
                <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
                <h1 className="mb-1">{displayTime}</h1>
              </div>
            )
          },
          cell: ({row, column, getValue}) => {
            const rowType = row.original.rowType
            if (rowType === "results") {
              const initialValue = (getValue() as string) || '';
              const abnormalRange = row.original?.normalRange
              const criticalRange = row.original?.criticalRange
              
              const resultStatus = getResultStatus(initialValue, abnormalRange, criticalRange);
              const isCritical = resultStatus === "critical"
              const isAbnormal = resultStatus === "abnormal" 

              return (
                <div key={`${row.id}-${column.id}-${row.original.field}`} className="flex items-center w-full px-2">
                  {isCritical && <ShieldAlert color="#e7000b" size={18} />}
                  <p className={`w-full text-right text-xs ${(isAbnormal || isCritical) && "text-red-600 font-medium"}`}>{initialValue}</p>
                </div>
              );
            } else if (rowType === "imaging") {
              const imagingReport = (getValue() as ImagingData) || { displayName: "", technique: "", findings: {}, impressions: ['']}
              if(!imagingReport.displayName) {
                return (
                  <></>
                )
              } else {
                return (
                  <ImagingReport
                    key={`${row.id}-${column.id}-${row.original.field}`}
                    cellName={row.original.field} 
                    imagingReportContents={imagingReport} 
                  />
                )
              }
            } else if (rowType === "pathology") {
              const pathologyReport = (getValue() as PathologyReportData) || {}
              if(Object.keys(pathologyReport).length === 0) {
                return (
                  <></>
                )
              } else {
                return (
                  <PathologyReport
                    key={`${row.id}-${column.id}-${row.original.field}`}
                    report={pathologyReport}
                    cellLabel={row.original.field}
                  />
                )
              }
            }
          } 
        }))}
      )
    ],
    [timePoints]
  );

  const ptTable = useReactTable({
    data: labTableData,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    getCoreRowModel: getCoreRowModel(), 
  });

  
  if (isLoading || isFetching ) {
    return (
      <div className="flex flex-col h-full w-full pt-16 bg-gray-100 justify-start items-center gap-6">
        <Skeleton className="w-5/6 h-16 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full bg-gray-100 justify-center items-center px-4 py-2">
        <p className="text-red-600">Error: {error ? (error as any).message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-[calc(100vw-16rem)] bg-gray-100 justify-center items-center px-4 pt-4 ">
      {/* <div className="w-full flex justify-between p-4">
        <AddBgDemo onAddLab={handleColumnAdd} />
      </div> */}
      <div className="w-full h-full  border border-gray-200 rounded-t-lg overflow-auto">
        <Table className="w-full overflow-x-auto">
          <TableHeader className=" bg-gray-50 sticky top-0">
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
              const rowType = row.original.rowType
              
              return(
                <TableCell
                  style={getPinnedStyles(cell.column)}
                  key={`${cell.id}-${row.original.field}`}
                  className={`p-0 min-w-24 border-separate border-gray-200 border-b ${rowType === "divider" ? "bg-blue-50" : "bg-white border-r border-separate"}`}
                >
                  {/* Render the cell content using flexRender */}
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
      </div>
    </div>

  );
  }

  

  export default LabPage