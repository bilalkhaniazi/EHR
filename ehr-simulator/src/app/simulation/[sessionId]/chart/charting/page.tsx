'use client'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { FlexSheetData, chartingOptions } from "./components/flexSheetData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import CheckBoxList from "./components/checkBoxList";
import { AddTimeColumnButton } from "./components/addTimeColButton";
import AssessmentSelect from "./components/assessmentSelector";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { assessmentTools, tempFlexSheetData } from "./components/flexSheetData";
import { Button } from "@/components/ui/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useAddTimeColumnMutation, useGetFlexSheetChartingQuery, useUpdateFlexSheetDataMutation } from "@/app/store/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateEditableData, setFieldSelection, initializeEditableData } from "./components/flexSheetSlice";
import type { RootState, AppDispatch } from "@/app/store/store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMilliseconds, format } from "date-fns";
import { useFlexSheetData } from "@/hooks/useFlexSheetData";
import FlexSheetSidebar from "./components/flexSheetSidebar"
import { getAlertFlag } from "./components/flexSheetHelpers";

const columnHelper = createColumnHelper<FlexSheetData>();

// left column pinned
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// helper function for table header display time
export const formatTimeFromOffset = (offsetMinutes: number, nowTimestamp: number | null) => {
  if (!nowTimestamp) {
    return { error: { status: 'TIME_ERROR', data: 'Time has not been initialized.' } };
  }
  const targetTime = differenceInMilliseconds(nowTimestamp, (offsetMinutes * 60 * 1000));

  const time = format(targetTime, 'HHmm')
  const date = format(targetTime, 'MM/dd')

  return { time, date };
};

// for tallying scored assessment tools at the bottom of flexsheet table
export function calculateColTotal(toolName: string, grouped: FlexSheetData[], timeOffsets: number[]) {
  const totalRow: FlexSheetData = {
    id: `${toolName}TotalScore`,
    field: `${toolName} Total Score`,
    componentType: "totalScoreRow", // This will be a static display
    rowType: "totalScoreRow", // A new rowType to identify it
  };

  // Calculate total for each time column
  timeOffsets.forEach(timeCol => {
    let totalScore = 0;
    let hasEnteredValue = false

    grouped.forEach(toolRow => {
      const score = parseInt(toolRow[timeCol]);
      if (!isNaN(score)) {
        totalScore += score;
        hasEnteredValue = true
      }
    });
    totalRow[timeCol] = hasEnteredValue ? totalScore.toString() : "";
  });
  return totalRow
}

export function FlexSheet() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [data1, setData1] = useState<FlexSheetData[]>(tempFlexSheetData)
  const dispatch = useDispatch<AppDispatch>();
  const [triggerUpdateFlexSheetData, { isLoading: isSaving }] = useUpdateFlexSheetDataMutation();
  const [triggerAddTimeColumn] = useAddTimeColumnMutation();
  const sessionStartTime = useSelector((state: RootState) => state.time.sessionStartTime);
  const skip = !sessionStartTime;

  // const isSidebarOpen = useSelector((state: RootState) => state.flexSheet.isSidebarOpen);


  const { data, isLoading, isFetching } = useGetFlexSheetChartingQuery(sessionStartTime, { skip }) // make call only once global time has been initialized

  // chartingData is the starting point of FlexSheet data when the component mounts
  // takes data received from RTK Query and stores it in FlexSheet's own slice
  useEffect(() => {
    if (data?.chartingData) {
      dispatch(initializeEditableData(data.chartingData));
    }
  }, [data, dispatch]);

  const timeOffsets = useMemo(() => data?.timeOffsets || [], [data?.timeOffsets]);

  // editableData is a working copy of chartingData that the user can modify, contains all rows even if hidden
  // filteredData is a subset of rows from editableData that is actually shown to the user
  // custom hook to update editableData and filterData, as well as which rows to display
  const { filteredData, editableData, fieldSelections, visibleSubsetIds } = useFlexSheetData(data?.chartingData, data?.timeOffsets);

  // updates editableData in flexSheetSlice upon student entry
  const onCellUpdate = useCallback((rowId: string, columnId: string, newValue: string | string[]) => {
    dispatch(updateEditableData({ rowId, columnId, newValue }))
  }, [dispatch]);

  // unhides rows based on user's selections, which are applied in useFlexSheetData hook
  const handleSubsetSelection = useCallback((id: string, columnId: string, selectedIdsForField: string[]) => {
    const selectionKey = `${id}-${columnId}`;
    dispatch(setFieldSelection({ key: selectionKey, selectedIds: selectedIdsForField }))

    // Dependent on the function defined above
    onCellUpdate(id, columnId, selectedIdsForField)
  }, [dispatch, onCellUpdate]);

  // add new column to chartingData in the backend (the source of truth) 
  const handleColumnAdd = async (newTimeOffset: number) => {
    if (timeOffsets.includes(newTimeOffset)) {
      toast.error(`A column for time ${newTimeOffset} already exists.`);
      return;
    }
    try {
      const response = await triggerAddTimeColumn({ newTimeOffset }).unwrap();
      toast.success(response.message);
    } catch (err) {
      toast.error(`Failed to add column: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Failed to add time column:', err);
    }
  };

  // open sidebar if an assessment tool (CIWA, Braden Scale) has been expanded
  useEffect(() => {
    let shouldOpen = false;
    for (const tool of assessmentTools) {
      if (visibleSubsetIds.has(tool.name)) {
        shouldOpen = true
        break
      }
    }
    if (shouldOpen != isSidebarOpen) {
      setIsSidebarOpen(shouldOpen)
      // dispatch(setSidebarOpen(shouldOpen))
    }
  }, [visibleSubsetIds, isSidebarOpen, dispatch]);

  const handleManualToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
    // dispatch(toggleSidebar());
  };

  const handleSave = async () => {
    try {
      // Send the current state of editableData to the backend
      await triggerUpdateFlexSheetData(editableData).unwrap();
      toast.success("FlexSheet data saved successfully!");
      // After successful save, RTK Query's invalidatesTags will cause a re-fetch
      // useEffect will  re-initialize editableData with the new saved state.
    } catch (err) {
      toast.error(`Failed to save data: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Failed to save FlexSheet data:", err);
    }
  }

  const hasChanges = useMemo(() => {
    if (!data?.chartingData || !editableData) return false;
    return JSON.stringify(editableData) !== JSON.stringify(data.chartingData);
  }, [editableData, data?.chartingData]);

  // building the table from filteredData
  // Many conditions to determine what a column should contain (input box, static display, dropdown menu, etc.)
  const columns = useMemo(() => [
    // first column is unique, containing row Titles
    columnHelper.accessor("field", {
      id: 'pinned',
      header: () => <h1 className="w-full h-full bg-gray-50"></h1>,
      cell: info => {
        const rowType = info.row.original.rowType;
        if (rowType === "titleRow") {
          const wdlDescription = info.row.original?.wdlDescription;
          // render the entire Tooltip component
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
                        <div key={index} className="">
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
            // If wdlDescription is undefined or empty, just render the field content
            return (
              <p className="min-w-24 h-full text-xs text-left py-0 pl-2 px-2 font-medium text-lime-900">
                {info.row.original.field}
              </p>
            );
          }
        } else if (rowType === "totalScoreRow") { // Handle the new total score row for assessment Tools
          const toolName = info.row.original.field.replace(' Total Score', '');
          const toolInterpretation = assessmentTools.find(tool => tool.name === toolName)?.interpretations;

          // Display total score with interpretation if available
          return (
            <div className="min-w-24 h-full text-xs text-left py-0 pl-4 font-semibold text-neutral-800">
              {info.getValue() && toolInterpretation ? (
                <Tooltip>
                  <TooltipTrigger className="cursor-help">
                    {info.getValue()} Total
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow shadow-black/30 rounded-xl ml-4 p-4 z-51 max-w-sm">
                      <h1 className="text-sm font-bold">{toolName} Interpretation</h1>
                      <div className="pl-2 space-y-2">
                        {toolInterpretation.map((interpretation, index) => (
                          <div key={index}>
                            <p className="text-xs font-semibold text-gray-800">{interpretation.result} ({interpretation.range}):</p>
                            <p className="pl-2 text-xs text-gray-600 italic">{interpretation.description}</p>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              ) : (
                `${info.getValue()} Total`
              )}
            </div>
          )
        } else {
          // This is for other row types that are not "titleRow" or 'totalScoreRow'
          return (
            <p className="min-w-24 h-full text-left text-xs py-0 pl-4 text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">
              {info.getValue()}
            </p>
          );
        };
      },
    }),

    // remaining columns are derived from a specific time offset
    ...timeOffsets.map(offsetKey => {
      const { time: displayTime, date: displayDate } = formatTimeFromOffset(offsetKey, sessionStartTime);
      return columnHelper.accessor(row => row[offsetKey], {
        id: String(offsetKey),
        header: () => (
          <div className="flex flex-col justify-center items-center">
            <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
            <h1 className="mb-1">{displayTime}</h1>
          </div>
        ),
        cell: ({ row, column, getValue }) => {
          const initialValue = (getValue() as string) || '';
          const [value, setValue] = useState(initialValue)
          const componentType = row.original.componentType

          if (componentType === "static") {
            return (
              <p></p>
            );
          } else if (componentType === "totalScoreRow") { // Render total score cell
            return (
              <p className="text-right pr-2 py-0 text-xs font-semibold">
                {initialValue}
              </p>
            )
          }
          else if (componentType === "assessmentselect") {
            const chartingOptions = (row.original.chartingOptions || []) as chartingOptions[];

            const handleComponentChange = (newValue: string) => {
              setValue(newValue);
              onCellUpdate(row.original.id, column.id, newValue);
            };

            return (
              <AssessmentSelect
                options={chartingOptions}
                value={value}
                rowId={row.original.id}
                columnId={column.id}
                onValueChange={handleComponentChange}
                className="p-0 h-6 hover:bg-muted/30"
              />
            )
          } else if (componentType === "checkboxlist") {
            const assessmentSubsets = row.original.assessmentSubsets || [];
            const selectionKey = `${row.original.id}-${column.id}`
            const currentSelectedSubsets = fieldSelections[selectionKey] || [];

            return (
              <CheckBoxList
                options={assessmentSubsets}
                selectedOptions={currentSelectedSubsets}
                rowId={row.original.id}
                columnId={column.id}
                onSelectionChange={handleSubsetSelection}
              />
            );
          } else {
            const alertFlag = getAlertFlag(row.original, value, componentType);

            const onBlur = () => {
              if (value != initialValue) {
                onCellUpdate(row.original.id, column.id, value);
              }
            };

            const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            };

            return (
              <Input
                id={`cell-${row.id}-${column.id}`}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={`min-w-12 h-6 text-right pr-2 py-0 lg:text-xs text-xs border-none shadow-none rounded-none hover:bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 ${alertFlag ? "text-red-600 font-medium" : ""}`}
              />
            )
          };
        }
      })
    })


  ], [timeOffsets, fieldSelections, onCellUpdate, handleSubsetSelection, sessionStartTime] // only rerun if a timeOffset has been added by the user
  );

  const ptTable = useReactTable({
    data: data1,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const filteredRow = filteredData[rowIndex];
        const actualIndex = editableData.findIndex(row => row.field === filteredRow?.field);
        setData1(old =>
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


  if (isLoading || isFetching) {
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


  return (
    <SidebarProvider
      className=""
      open={isSidebarOpen}
      onOpenChange={(isOpen) => setIsSidebarOpen(isOpen)}
    >
      <SidebarInset className="">
        <div className="flex flex-col bg-gray-100 w-[calc(100vw-16rem)] h-[calc(100vh-4rem)] px-4">
          <div className="flex flex-col w-full h-full justify-center items-center gap-2 pt-2 ">
            <div className="w-full flex justify-start gap-2 ">
              <AddTimeColumnButton
                onColumnAdd={handleColumnAdd}
                existingTimeColumns={timeOffsets}
                sessionStartTime={sessionStartTime}
              />
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="h-6 bg-lime-500 text-white hover:bg-lime-600 shadow"
              >
                {isSaving ? "Saving..." : "File"}
              </Button>
              <Button
                onClick={handleManualToggleSidebar}
                className="bg-white h-6 w-4 text-black hover:bg-gray-200 shadow shadow-black/20"
              >
                {isSidebarOpen ?
                  <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />
                }
              </Button>
            </div>
            <div className="flex-grow w-full overflow-auto border border-gray-200 rounded-md ">
              <Table className="w-full rounded-md">
                <TableHeader className=" bg-gray-50 sticky top-0">
                  {ptTable.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableHead
                          style={getPinnedStyles(header.column)}
                          key={header.id}
                          className="border-b-2 p-0 border-gray-200 "
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

                        return (
                          <TableCell
                            style={getPinnedStyles(cell.column)}
                            key={`${cell.id}-${row.original.field}`}
                            className={`p-0 min-w-24 text-gray-800 border-separate border-gray-200 border-b ${rowType === "titleRow" ? "bg-lime-50" : "bg-white border-r border-separate"}`}
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
                          className="h-6 p-0 text-left text-sm font-semibold text-gray-700 border-gray-300">

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
        </div>
      </SidebarInset>
      <FlexSheetSidebar />
    </SidebarProvider>
  );
}


export default FlexSheet