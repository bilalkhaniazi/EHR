import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { tableData, chartingOptions } from "./tableData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../ui/table";
import { Input } from "../ui/input";
import CheckBoxList from "./CheckBoxList";
import { AddTimeColumnButton } from "./addTimeColButton";
import AssessmentSelect from "./AssessmentSelect";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { assessmentTools } from "./tableData";
import { Button } from "../ui/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import AssessmentToolSidebar from "./assessmentToolSidebar";
import { useAddTimeColumnMutation, useGetFlexSheetChartingQuery, useUpdateFlexSheetDataMutation } from "@/app/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setSidebarOpen, updateEditableData, setFieldSelection, initializeEditableData } from "./flexSheetSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const columnHelper = createColumnHelper<tableData>();

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

const formatTimeFromOffset = (offsetMinutes: number) => {
    const now = new Date();
    // Subtract the offset from the current time
    const targetTime = new Date(now.getTime() - offsetMinutes * 60 * 1000);

    const time = targetTime.toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(':', '');

    const date = targetTime.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
    });

    return { time, date };
};


export function calculateColTotal(toolName: string, grouped: tableData[], timeOffsets: number[]) {
    const totalRow: tableData = {
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
        console.log("total score", totalScore.toString())
        totalRow[timeCol] = hasEnteredValue ? totalScore.toString() : "";
    });
    return totalRow
}

export function FlexSheet() {
    const dispatch = useDispatch<AppDispatch>();
    
    const { data, isLoading, isError, error, isFetching } = useGetFlexSheetChartingQuery()

    const [triggerUpdateFlexSheetData, {isLoading: isSaving }] = useUpdateFlexSheetDataMutation();      // isError: saveError, isSuccess: saveSuccess
    const [triggerAddTimeColumn] = useAddTimeColumnMutation();

    const editableData = useSelector((state: RootState) => state.flexSheet.editableData);
    const fieldSelections = useSelector((state: RootState) => state.flexSheet.fieldSelections);
    const isSidebarOpen = useSelector((state: RootState) => state.flexSheet.isSidebarOpen); 
    // console.log(editableData)

    const timeOffsets = data?.timeOffsets || [];

    useEffect(() => {
        if (data?.chartingData && !isSaving) { // Only update if not currently saving (to avoid overwriting unsaved edits)
            dispatch(initializeEditableData(data.chartingData));
        }
    }, [data, isSaving, dispatch]);


    // upon change in rows to display, update 
    const visibleSubsetIds = useMemo(() => {
        const combinedSet = new Set<string>();
        Object.values(fieldSelections).forEach(selectedIdsArray => {
            selectedIdsArray.forEach(id => {
                // WDL is an option in the checkboxlist but doesn't map to a hideableId row.
                if (id !== "WDL") {
                    combinedSet.add(id);
                }
            });
        });
        return combinedSet;
    }, [fieldSelections]);

    const filteredData = useMemo(() => {
        const currentDataToFilter = editableData.length > 0 ? editableData : data?.chartingData || [];
        
        // Group rows by their toolName to calculate totals
        const groupedByTool: Record<string, tableData[]> = {};
        currentDataToFilter.forEach(row => {
            if (row.toolName) {
                if (!groupedByTool[row.toolName]) {
                    groupedByTool[row.toolName] = [];
                }
                groupedByTool[row.toolName].push(row);
            }
        });
        console.log(groupedByTool)
        const newFilteredData: tableData[] = [];

        currentDataToFilter.forEach(row => {
            // Include hideable rows if their hideableId is in visibleSubsetIds
            if (row.hideable) {
                if (row.hideableId && visibleSubsetIds.has(row.hideableId)) {
                    newFilteredData.push(row);
                }
            } else {
                // Always include non-hideable rows (like title rows or vital signs)
                newFilteredData.push(row);
            }

            // Handling assessment tools with numeric score totals
            // After adding all rows for a specific tool, add the total score row
            if (row.rowType === "titleRow" && row.hideableId && visibleSubsetIds.has(row.hideableId)) {
                const toolName = row.hideableId; // Assuming hideableId matches toolName for title rows
                if (groupedByTool[toolName]) {
                    const totalRow = calculateColTotal(toolName, groupedByTool[toolName], timeOffsets);
                    newFilteredData.push(totalRow);
                }
            }

            // if (row.id === "intakeTitle" || row.Id === "outputTitle") {
            //     const toolName = row.id
            //     if (groupedByTool[toolName] && groupedByTool[toolName].some(r => r.hideableId && visibleSubsetIds.has(r.hideableId))) {
            //         const totalRow = calculateColTotal(toolName, groupedByTool[toolName], timeOffsets);
            //         totalRow.id = `${toolName}TotalRow`
            //         newFilteredData.push(totalRow)
            //     }
            // }
        });

        return newFilteredData;
    }, [visibleSubsetIds, editableData, data?.chartingData, timeOffsets]); 

    console.log(filteredData)

    // updates Data upon submission of Input or AssessmentSelect component 
    const onCellUpdate = (rowId: string, columnId: string, newValue: string | string[]) => {
        dispatch(updateEditableData({ rowId, columnId, newValue }))
    }


    const handleSubsetSelection = useCallback((id: string, columnId: string, selectedIdsForField: string[]) => {
        const selectionKey = `${id}-${columnId}`;
        dispatch(setFieldSelection({ key: selectionKey, selectedIds: selectedIdsForField}))
     
        onCellUpdate(id, columnId, selectedIdsForField)
    }, []);


    const handleColumnAdd = async (newTimeOffset: number) => {
        // timeOffsets would be recalculated upon addition on new column with the mutation marking the data as stale
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

    useEffect(() => {
        let shouldOpen = false;
        for (const tool of assessmentTools) {
            if (visibleSubsetIds.has(tool.name)) {
                shouldOpen = true
                break
            }
        }
        if(shouldOpen != isSidebarOpen) {
            dispatch(setSidebarOpen(shouldOpen))
        }
    }, [visibleSubsetIds]);

    const handleManualToggleSidebar = () => {
        dispatch(toggleSidebar());
    };
    
    const handleSave = useCallback(async () => {
        try {
        // Send the current state of editableData to the backend
        await triggerUpdateFlexSheetData(editableData).unwrap();
        toast.success("FlexSheet data saved successfully!");
        // After successful save, RTK Query's invalidatesTags will cause a re-fetch
        // The useEffect will then re-initialize editableData with the new saved state.
        } catch (err) {
        toast.error(`Failed to save data: ${err instanceof Error ? err.message : String(err)}`);
        console.error("Failed to save FlexSheet data:", err);
        }
    }, [editableData, triggerUpdateFlexSheetData]);
    
    const hasChanges = useMemo(() => {
        if (!data?.chartingData || !editableData) return false;
        return JSON.stringify(editableData) !== JSON.stringify(data.chartingData);
    }, [editableData, data?.chartingData]);

    // const displayDate = useMemo(() => {
    //     const todayDate = new Date()
    //     return todayDate.toLocaleDateString("en-US", {
    //         month: "numeric",
    //         day: "numeric",
    //     });
    // }, []);

    const columns = useMemo(
        () => [
            columnHelper.accessor("field", {
                id: 'pinned',
                header: () => <h1 className="w-full h-full bg-gray-50"></h1>,
                cell: info => {
                    const rowType = info.row.original.rowType;
                    if (rowType === "titleRow") {
                        const wdlDescription = info.row.original?.wdlDescription;
                        // Conditionally render the entire Tooltip component
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
                    } else if (rowType === "totalScoreRow") { // Handle the new total score row
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
                        )} else {
                        // This is for other row types that are not "titleRow"
                        return (
                            <p className="min-w-24 h-full text-left text-xs py-0 pl-4 text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">
                                {info.getValue()}
                            </p>
                        );
                    };
                },
            }),

            ...timeOffsets.map(offsetKey => {
                const { time: displayTime, date: displayDate } = formatTimeFromOffset(offsetKey);
                return columnHelper.accessor(row => row[offsetKey], {
                    id: String(offsetKey),
                    header: () => (
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
                            <h1 className="mb-1">{displayTime}</h1>
                        </div>
                    ),
                    cell: ({row, column, getValue}) => {
                        const initialValue = (getValue() as string) || '';
                        const [value, setValue] = useState(initialValue)
                        const componentType = row.original.componentType

                        if(componentType === "static") {
                            return (
                                <p></p>
                            );
                        } else if(componentType === "totalScoreRow") { // Render total score cell
                            return (
                                <p className="text-right pr-2 py-0 text-xs font-semibold">
                                    {initialValue}
                                </p>
                            )
                        } 
                        else if(componentType === "assessmentselect") {
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
                            
                            // unique key because currentSelectedSubsets are coming from fieldSelections, not Data
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
                            const normalRange = row.original?.normalRange
                            let alertFlag = false;
                            if (normalRange && componentType == "input") {
                                const numericValue = parseFloat(value) 
                                if(!isNaN(numericValue)) {
                                    alertFlag = numericValue < normalRange.low || numericValue > normalRange.high;
                                }
                            };   
                            
                            const onBlur = () => {
                                if(value != initialValue) {
                                    onCellUpdate(row.original.id, column.id, value);
                                }
                            };

                            const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                                if(e.key === "Enter") {
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
                                    className={`min-w-12 h-6 text-right pr-2 py-0 text-xs border-none shadow-none rounded-none hover:bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 ${alertFlag ? "text-red-600 font-medium" : ""}`}
                                />
                            )
                        };
                    }
                })
            })
            
            
        ],
        [timeOffsets]
    );

    const ptTable = useReactTable({
        data: filteredData,
        columns,
        enablePinning: true,
        initialState: {
            columnPinning: {
                left: ['pinned']
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

    if (isError) {
        return (
        <div className="flex flex-col h-full bg-gray-100 justify-center items-center px-4 py-2">
            <p className="text-red-600">Error: {error ? (error as any).message : 'Unknown error'}</p>
        </div>
        );
    }
    return (
    <SidebarProvider 
        className=""
        open={isSidebarOpen}                     
        onOpenChange={(isOpen) => dispatch(setSidebarOpen(isOpen))}
    >
        <SidebarInset className="">
        <div className="flex flex-col bg-gray-100 w-[calc(100vw-16rem)] h-[calc(100vh-4rem)] px-4">
            <div className="flex flex-col w-full h-full justify-center items-center gap-2 pt-2 ">
                <div className="w-full flex justify-start gap-2 ">
                    {/* <AddTimeColumnButton 
                        onColumnAdd={handleColumnAdd}
                        existingTimeColumns={timeOffsets}
                    /> */}
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
                                
                                return(
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
        <AssessmentToolSidebar  />
    </SidebarProvider>
  );
}
