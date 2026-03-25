'use client'

import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSimulationTime } from "../context/SimulationTimeContext";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, type Column } from "@tanstack/react-table";
import { Tooltip, TooltipTrigger, TooltipContent, } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { formatTimeFromOffset } from "../charting/page";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter
} from "@/components/ui/table";

import ImagingReport from "./components/imagingReport";
import PathologyReport from "./components/microbiologyReport";
import {
  type ImagingData,
  type LabTableData,
  type MicrobiologyReportData,
} from "./components/labsData"

import { buildLabFrontendBundle } from "@/lib/labTypes";
import type { Database } from "@/../database.types";

export const getResultStatus = (initialValue: string, normalRange: { low: number, high: number } | undefined, criticalRange: { low: number, high: number } | undefined) => {
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
function getPinnedStyles(column: Column<LabTableData>): React.CSSProperties {
  const isPinned = column.getIsPinned();
  if (!isPinned) {
    return {};
  }
  const side = isPinned as 'left' | 'right';
  return {
    position: 'sticky',
    [side]: `${column.getStart(side)}px`,
    zIndex: side === 'left' ? 2 : 1,
  };
}

export function LabPage() {
  const [simStartTime] = useState(new Date().getTime());
  const [labTableData, setLabTableData] = useState<LabTableData[]>([]);
  const [timePoints, setTimePoints] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isLoading: ctxLoading,
    caseId,
    labResults,
    imagingReports,
    microbiologyReports,
    selectedTimeOffset,
  } = useSimulationTime();
  const tableScrollRef = useRef<HTMLDivElement>(null);

  /** Time column to emphasize: exact match to global selector, else closest offset in this table. */
  const activeTimeColumn = useMemo(() => {
    if (timePoints.length === 0) return null;
    if (timePoints.includes(selectedTimeOffset)) return selectedTimeOffset;
    return timePoints.reduce((closest, t) =>
      Math.abs(t - selectedTimeOffset) < Math.abs(closest - selectedTimeOffset) ? t : closest
    , timePoints[0]!);
  }, [timePoints, selectedTimeOffset]);

  useEffect(() => {
    if (isLoading || activeTimeColumn == null) return;
    const root = tableScrollRef.current;
    if (!root) return;
    const th = root.querySelector(`th[data-lab-col="${activeTimeColumn}"]`);
    th?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [isLoading, activeTimeColumn, selectedTimeOffset, timePoints]);

  useEffect(() => {
    if (ctxLoading) {
      setIsLoading(true);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!caseId) {
        setLabTableData([]);
        setTimePoints([]);
        setIsLoading(false);
        return;
      }

      const transformed = buildLabFrontendBundle({
        labResults: labResults as Database["public"]["Tables"]["lab_results"]["Row"][],
        imagingReports: imagingReports as Database["public"]["Tables"]["imaging_reports"]["Row"][],
        microbiologyReports: microbiologyReports as Database["public"]["Tables"]["microbiology_reports"]["Row"][],
      });

      const timeColumnDateKeys = transformed.timePoints;
      const filteredLabTableData = transformed.labTableData.filter((row) => {
        if (!row.hideable) return true;
        return !timeColumnDateKeys.every((dateKey) => !row[dateKey]);
      });

      setLabTableData(filteredLabTableData);
      setTimePoints(transformed.timePoints);
      setIsLoading(false);
    };

    void run();
  }, [ctxLoading, caseId, labResults, imagingReports, microbiologyReports]);


  const columns = useMemo(() => [
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
                <TooltipContent className="bg-white shadow border border-gray-200 rounded-xl ml-4 z-10">
                  <h1 className="text-md font-semibold text-black">{field}</h1>
                  <div className="">
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
    }),

    // Dynamic Time Columns
    ...timePoints.map(timePoint => {
      const { time: displayTime, date: displayDate } = formatTimeFromOffset(timePoint, simStartTime);
      const isActiveColumn = activeTimeColumn !== null && timePoint === activeTimeColumn;

      return columnHelper.accessor(row => row[timePoint], {
        id: String(timePoint),
        header: () => (
          <div
            className={cn(
              "flex flex-col justify-center items-center py-0.5",
              isActiveColumn && "rounded-md bg-sky-100 ring-2 ring-sky-400 ring-inset"
            )}
          >
            <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
            <p className={cn("mb-1 text-sm", isActiveColumn && "font-semibold text-sky-900")}>{displayTime}</p>
          </div>
        ),
        cell: ({ row, column, getValue }) => {
          const rowType = row.original.rowType;

          if (rowType === "results") {
            const initialValue = (getValue() as string) || '';
            const abnormalRange = row.original?.normalRange
            const criticalRange = row.original?.criticalRange

            const resultStatus = getResultStatus(initialValue, abnormalRange, criticalRange);
            const isCritical = resultStatus === "critical"
            const isAbnormal = resultStatus === "abnormal"

            return (
              <div key={`${row.id}-${column.id}-${row.original.field}`} className="flex items-center w-full px-2">
                {isCritical && <TriangleAlert color="#e7000b" size={18} />}
                <p className={`w-full text-right text-xs ${(isAbnormal || isCritical) && "text-red-600 font-medium"}`}>{initialValue}</p>
              </div>
            );
          }

          // --- IMAGING CELLS ---
          else if (rowType === "imaging") {
            const imagingReport = (getValue() as ImagingData) || { displayName: "", technique: "", findings: [], impressions: [''] }
            if (!imagingReport.displayName) {
              return <></>
            }
            return (
              <ImagingReport
                key={`${row.id}-${column.id}-${row.original.field}`}
                cellName={row.original.field}
                imagingReportContents={imagingReport}
                displayTime={displayTime || ''}
                displayDate={displayDate || ''}
              />
            )
          }

          // --- MICROBIOLOGY CELLS ---
          else if (rowType === "microbiology") {
            const pathologyReport = (getValue() as MicrobiologyReportData) || {}
            if (Object.keys(pathologyReport).length === 0) {
              return <></>
            }
            return (
              <PathologyReport
                key={`${row.id}-${column.id}-${row.original.field}`}
                report={pathologyReport}
                cellLabel={row.original.field}
                displayTime={displayTime || ''}
                displayDate={displayDate || ''}

              />
            )
          }
        }
      })
    })
  ],
    [timePoints, simStartTime, activeTimeColumn]
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


  if (ctxLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-[calc(100vw-16rem)] bg-gray-100 justify-center items-center">
        <p className="text-gray-500 animate-pulse">Loading Labs...</p>
      </div>
    )
  }

  if (!caseId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-[calc(100vw-16rem)] bg-gray-100 justify-center items-center px-6 text-center">
        <p className="max-w-md text-gray-600">
          This simulation session could not be loaded. Sign in, or confirm you have access to this session.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-[calc(100vw-16rem)] bg-gray-100 justify-center items-center">
        <p className="text-gray-500 animate-pulse">Loading Labs...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-[calc(100vw-16rem)] bg-gray-100 justify-center items-center px-4 pt-4 ">
      {timePoints.length === 0 && (
        <p className="mb-2 w-full max-w-4xl text-center text-sm text-gray-600">
          No lab timepoints are available for this case yet. The chart will update when lab results exist.
        </p>
      )}
      <div
        ref={tableScrollRef}
        className="w-full h-full border border-gray-200 rounded-t-lg overflow-auto"
      >
        <Table className="w-full overflow-x-auto">
          <TableHeader className=" bg-gray-50 sticky top-0">
            {ptTable.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    style={getPinnedStyles(header.column)}
                    key={header.id}
                    data-lab-col={header.column.id === "pinned" ? undefined : header.column.id}
                    className={cn(
                      "border-b-2 border-gray-200 p-0",
                      header.column.id !== "pinned" &&
                        activeTimeColumn !== null &&
                        header.column.id === String(activeTimeColumn) &&
                        "bg-sky-50 shadow-[inset_0_0_0_2px_rgb(14_165_233)]"
                    )}
                  >
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

                  const isActiveTimeCell =
                    cell.column.id !== "pinned" &&
                    activeTimeColumn !== null &&
                    cell.column.id === String(activeTimeColumn);

                  return (
                    <TableCell
                      style={getPinnedStyles(cell.column)}
                      key={`${cell.id}-${row.original.field}`}
                      className={cn(
                        "p-0 min-w-24 border-separate border-gray-200 border-b",
                        rowType === "divider" ? "bg-blue-50" : "bg-white border-r border-separate",
                        isActiveTimeCell && rowType !== "divider" && "bg-sky-50/90"
                      )}
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
      </div>
    </div>
  );
}

export default LabPage;