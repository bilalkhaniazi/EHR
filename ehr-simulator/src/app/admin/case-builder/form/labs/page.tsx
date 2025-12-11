'use client'

import { type LabTableData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, Column } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

import { TestTube2, X } from "lucide-react";
import { AddTableColumn } from "./components/addTimeCol";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/ui/combobox";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { LabTableImagingReport, LabTableInputCell, LabTableMicrobioReport } from "./components/labTableInputCell";
import { useFormContext } from "@/context/FormContext";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { formatTimeOffset } from "../charting/page";

const columnHelper = createColumnHelper<LabTableData>();

// left column pinned
function getPinnedStyles(column: Column<LabTableData>): React.CSSProperties {
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
    zIndex: side === 'left' ? 2 : 1,
  };
}

export function LabForm() {
  const { onDataChange, labData } = useFormContext()

  const [labTableData, setLabTableData] = useState<LabTableData[]>(labData);
  const [timePoints, setTimePoints] = useState([0]);
  const [timePointsInPresim, setTimePointsInPresim] = useState<Set<number>>(new Set());
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [comboboxValue, setComboboxValue] = useState<string>("");

  const router = useRouter()

  // Get all hideable options for Combobox selector
  const hideableOptions = useMemo(() => {
    return labTableData
      .filter(row => row.hideable === true)
      .filter(row => !visibleItems.has(row.field))
      .map(row => ({
        value: row.field,
        label: row.field
      }));
  }, [labTableData, visibleItems]);

  // Filter data to only show visible rows
  const filteredLabTableData = useMemo(() => {
    return labTableData.filter(row => {
      // Always show non-hideable rows
      if (!row.hideable) return true;
      return visibleItems.has(row.field);
    });
  }, [labTableData, visibleItems]);

  // Handler to add an item to visible list
  const handleAddVisibleItem = (fieldName: string) => {
    if (fieldName) {
      setVisibleItems(prev => new Set([...prev, fieldName]));
      setComboboxValue("");
    }
  };

  const handleAddColumn = (offset: number) => {
    if (timePoints.includes(offset)) {
      toast.warning("Time column already added")
      return
    }
    setTimePoints(prev =>
      [...prev, offset].sort((a, b) => b - a)
    )
  }


  const removeTimePoint = (timeToRemove: number) => {
    setTimePoints(prev => {
      return prev.filter(timePoint => timePoint !== timeToRemove);
    })
    setTimePointsInPresim(prev => {
      const newTimePoints = new Set(prev);
      newTimePoints.delete(timeToRemove)
      return newTimePoints
    })
    setLabTableData(prev => {
      return prev.map(row => {
        delete row[timeToRemove]
        return row
      })
    })
  }

  const togglePresimInclusion = (timePoint: number, checked: boolean | 'indeterminate') => {
    setTimePointsInPresim(prev => {
      if (!checked) {
        const timePoints = new Set(prev)
        timePoints.delete(timePoint)
        return timePoints
      }
      return new Set([...prev, timePoint])
    })
  }

  const handleSubmit = () => {
    onDataChange('labs', labTableData)
    router.push('/admin/case-builder/form/charting')
  }

  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        id: 'pinned',
        minSize: 200,
        maxSize: 400,
        header: () => <p></p>,
        cell: info => {
          const rowType = info.row.original.rowType;
          const field = info.row.original.field
          if (rowType === "divider") {
            return (
              <p className="w-full text-left text-xs py-0 px-2 font-medium text-blue-900">
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
                  <TooltipTrigger className="w-full font-normal text-xs text-gray-700 shadow-none rounded-none">
                    <div className="flex justify-end w-full ">
                      <p className="text-right font-normal px-2 text-xs text-gray-700 text-wrap">{field}</p>
                      {unit && <p className="text-right font-normal pr-2 text-xs tracking-tight text-gray-400">{unit}</p>}
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
              <p className="w-full text-right font-normal px-2 text-xs text-gray-700 text-wrap">
                {field}
              </p>
            );
          }
        }
      },
      ),

      // map out remaining columns
      ...timePoints.map(timePoint => {
        const { days, hours, minutes } = formatTimeOffset(timePoint);
        return (

          columnHelper.accessor(row => row[timePoint], {
            id: String(timePoint),
            header: () => {
              return (
                <div className="relative flex gap-1 justify-center items-center border-r last:border-r-0">
                  <div className="grid grid-cols-[80px_20px] gap-x-2 p-1">
                    <p className="text-gray-800 font-light">Days: </p>
                    <p className="mb-1 ml-1">{days * -1}</p>
                    <p className="text-gray-800 font-light">Hours: </p>
                    <p className="mb-1 ml-1">{hours * -1}</p>
                    <p className="text-gray-800 font-light">Minutes: </p>
                    <p className="mb-1 ml-1">{minutes * -1}</p>
                    <p className="text-gray-800 font-light">In Pre-Sim?</p>
                    <Checkbox
                      checked={timePointsInPresim.has(timePoint)}
                      onCheckedChange={(check) => togglePresimInclusion(timePoint, check)}
                      className="bg-white mt-1 border-gray-300"
                      id="presim "
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTimePoint(timePoint)}
                    className="p-1 mt-1 self-start hover:bg-red-100 rounded text-slate-400 hover:text-red-600"
                    title="Remove Column"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            },
            cell: ({ row, column, getValue, table }) => {
              const rowType = row.original.rowType
              switch (rowType) {
                case 'results':
                  return (
                    <LabTableInputCell
                      row={row}
                      getValue={getValue}
                      column={column}
                      table={table}
                      visibleInPresim={timePointsInPresim.has(timePoint)}
                    />
                  );
                case 'imaging':
                  return (
                    <LabTableImagingReport
                      column={column}
                      row={row}
                      table={table}
                      getValue={getValue}
                      visibleInPresim={timePointsInPresim.has(timePoint)}
                    />
                  )
                case 'microbiology':
                  return (
                    <LabTableMicrobioReport
                      column={column}
                      row={row}
                      table={table}
                      getValue={getValue}
                      visibleInPresim={timePointsInPresim.has(timePoint)}
                    />
                  )
              }
            }
          }))
      }
      )
    ],
    [timePoints, timePointsInPresim]
  );

  const ptTable = useReactTable({
    data: filteredLabTableData,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const filteredRow = filteredLabTableData[rowIndex];
        const actualIndex = labTableData.findIndex(row => row.field === filteredRow?.field);
        setLabTableData(old =>
          old.map((row, index) => {
            if (index === actualIndex) {
              return {
                ...old[actualIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10">
        <div className="">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TestTube2 className="text-slate-400" />
            Lab Results
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 5 of 6: Enter laboratory and imaging results</p>
        </div>

        <div>
          <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 px-6 pt-4 overflow-auto">
        <div className="w-full flex justify-start gap-12 mb-3 px-4 items-end">
          <AddTableColumn handleColumnAdd={handleAddColumn} />
          <div>
            <Label>Imaging Options</Label>
            <Combobox onValueChange={handleAddVisibleItem} value={comboboxValue} displayText="Select scans..." data={hideableOptions}></Combobox>
          </div>
          <div className="flex items-end gap-2">
            <div className="space-y-1.5">
              <p className="w-fit items-center  px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-300 uppercase tracking-wide">
                Not included in Pre-Sim
              </p>
              <p className="w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-lime-50 text-lime-600 border border-lime-300 uppercase tracking-wide">
                Included in Pre-Sim
              </p>
            </div>
          </div>


        </div>
        <div className="flex-1 w-full border border-gray-300 rounded-t-lg overflow-auto bg-white shadow-sm relative">
          <Table className="w-full overflow-x-auto">
            <TableHeader className=" bg-gray-50 sticky top-0 z-5">
              {ptTable.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      style={getPinnedStyles(header.column)}
                      key={header.id}
                      className="border-b-2 border-gray-300 p-0 bg-gray-50"
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
                    return (
                      <TableCell
                        style={getPinnedStyles(cell.column)}
                        key={`${cell.id}-${row.original.field}`}
                        className={`p-0 m-0 h-6 border-separate border-gray-300 border-b min-w-40 ${rowType === "divider" ? "bg-blue-50" : "bg-white border-r last:border-r-0"}`}
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
                      className="h-12 p-0 text-left text-gray-700 border-gray-300">
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
      </main>
    </div>

  );
}

export default LabForm

