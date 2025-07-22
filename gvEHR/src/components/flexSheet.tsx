// Resident attempted to wean sedation again, pt subsequently self-extubated, impromptu SBT failed.
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { tableData, chartingOptions } from "./tableData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { generateInitialVitalsData, getAllInitialHours } from "./tableData";
import { Input } from "./ui/input";
import { Toaster } from "sonner";
import CheckBoxList from "./CheckBoxList";
import { AddTimeColumnButton } from "./addTimeColButton";
import AssessmentSelect from "./AssessmentSelect";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { assessmentToolSidebar } from "./assessmentToolSidebar";
import { assessmentTools } from "./tableData";
import { Button } from "./ui/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

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

export function FlexSheet() {
    // list of predefined and dynamically-generated hours, and map of time-offsets to real-time equivalents
    const { allTimesColumns, predefinedVitalsTimeMap } = useMemo(() => getAllInitialHours(), [])

    const [timeColumns, setTimeColumns] = useState(allTimesColumns)
    const [fieldSelections, setFieldSelections] = useState<Record<string, string[]>>({});
    const [isSidebarOpen, setIsSideBarOpen] = useState<boolean>(false)

    // generate inital dataset to be used by PtTable 
    const initialData = useMemo(() => generateInitialVitalsData(allTimesColumns, predefinedVitalsTimeMap), [allTimesColumns, predefinedVitalsTimeMap]);
    
    const [data, setData] = useState<tableData[]>(initialData);

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
    
    // construct new data object and map in existing user entries upon addition of rows
    const updatedData = useMemo(() => {
        const filteredData: tableData[] = initialData.filter(row => {
            if (row.hideable) {
                // Only show hideable rows if their specific hideableId is in the set
                return row.hideableId && visibleSubsetIds.has(row.hideableId);
            }
            return true; // Always show non-hideable rows
        });

        return filteredData.map(row => {
            const newRow = { ...row };
            timeColumns.forEach(hour => {
                const matchingRow = data.find(d => d.field === row.field);
                newRow[hour] = matchingRow ? matchingRow[hour] : "";
            });
            return newRow;
        });
    }, [visibleSubsetIds, timeColumns]);
    
    // set Data upon addition of rows
    useEffect(() => {
        setData(updatedData);
    }, [updatedData]);

    // updates Data upon submission of Input or AssessmentSelect component 
    const onCellUpdate = useCallback((rowId: string, columnId: string, newValue: string | string[]) => {
        setData(oldData => 
            oldData.map(row => {
                if(row.field === rowId) {
                    return {
                        ...row,
                        [columnId]: newValue,
                    };
                }
                return row
            })
        );
    },  []);


    const handleSubsetSelection = useCallback((field: string, columnId: string, selectedIdsForField: string[]) => {
        const selectionKey = `${field}-${columnId}`;

        setFieldSelections(prev => ({
            ...prev,
            [selectionKey]: selectedIdsForField // Update only the selections for this specific field
        }));
        onCellUpdate(field, columnId, selectedIdsForField)
    }, []);


    const handleColumnAdd = useCallback((newTime: string) => {
        setTimeColumns(prevColumns => {
            const updatedColumns = [...prevColumns, newTime].sort();
            return updatedColumns;
        });

        setData(prevData =>
            prevData.map(row => {
                const newRow = { ...row };
                newRow[newTime] = '';
                return newRow;
            })
        );
    }, []);

    useEffect(() => {
        let shouldOpen = false;
        for (const tool of assessmentTools) {
            if (visibleSubsetIds.has(tool.name)) {
                shouldOpen = true
                break
            }
        }

        if(shouldOpen != isSidebarOpen) {
            setIsSideBarOpen(shouldOpen)
        }
        }, [visibleSubsetIds]);

    const handleManualToggleSidebar = () => {
        setIsSideBarOpen(prev => !prev);
        console.log("called")
    }; 
    
    

    const displayDate = useMemo(() => {
        const todayDate = new Date()
        return todayDate.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
        });
    }, []);

    const columns = useMemo(
        () => [
            columnHelper.accessor("field", {
                id: 'pinned',
                header: () => <h1 className="w-full h-full bg-gray-100"></h1>,
                cell: info => {
                    const rowType = info.row.original.rowType;
                    if (rowType === "titleRow") {
                        const wdlDescription = info.row.original?.wdlDescription;
                        // Conditionally render the entire Tooltip component
                        if (wdlDescription && wdlDescription.length > 0) {
                            return (
                                <Tooltip>
                                    <TooltipTrigger
                                        className="px-2 font-medium text-lime-900"
                                    >
                                        {info.row.original.field}
                                    </TooltipTrigger>
                                    <TooltipPortal>
                                        <TooltipContent className="bg-white shadow shadow-black/30 rounded-xl ml-4 p-4 z-51 max-w-sm">
                                            <h1 className="text-md font-bold">WDL Criteria</h1>
                                            <div className="space-y-2">
                                                {wdlDescription.map((row, index) => (
                                                    <div key={index} className="text-sm">
                                                        <p className="pl-2 font-semibold text-gray-800 text-wrap">{row.assessment}:</p>
                                                        <p className="pl-4 text-gray-600 italic text-wrap">{row.description}</p>
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
                                <p className="min-w-24 h-6 text-left  py-0 pl-2 text-sm px-2 font-medium text-lime-900">
                                    {info.row.original.field}
                                </p>
                            );
                        }
                    } else {
                        // This is for other row types that are not "titleRow"
                        return (
                            <p className="min-w-24 h-6 text-left font-normal py-0 pl-4 text-sm text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">
                                {info.getValue()}
                            </p>
                        );
                    };
                },
            }),

            ...timeColumns.map(timeKey =>
                columnHelper.accessor(timeKey, {
                    id: timeKey,
                    header: () => (
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
                            <h1 className="mb-1">{timeKey}</h1>
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
                        } else if(componentType === "assessmentselect") {
                            const chartingOptions = (row.original.chartingOptions || []) as chartingOptions[];

                            const handleComponentChange = (newValue: string) => {
                                setValue(newValue); 
                                onCellUpdate(row.original.field, column.id, newValue); 
                            };

                            return (
                                <AssessmentSelect
                                    options={chartingOptions} 
                                    value={value}
                                    rowId={row.original.field}
                                    columnId={column.id}
                                    onValueChange={handleComponentChange}
                                    className="p-0 h-6 hover:bg-muted/30"
                                />
                            )
                        } else if (componentType === "checkboxlist") {
                            const assessmentSubsets = row.original.assessmentSubsets || [];
                            
                            // unique key because currentSelectedSubsets are coming from fieldSelections, not Data
                            const selectionKey = `${row.original.field}-${column.id}`
                            const currentSelectedSubsets = fieldSelections[selectionKey] || [];
                            
                            return (
                                <CheckBoxList
                                    options={assessmentSubsets}
                                    selectedOptions={currentSelectedSubsets}
                                    field={row.original.field}
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
                                    onCellUpdate(row.original.field, column.id, value);
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
                }),
            )
            
            
        ],
        [timeColumns]
    );

    const ptTable = useReactTable({
        data,
        columns,
        enablePinning: true,
        initialState: {
            columnPinning: {
                left: ['pinned']
            },
        },
        getCoreRowModel: getCoreRowModel(), 
    });

    useEffect(() => {
        console.log(data)
    }, [data]);

   
    return (
    // <SidebarProvider 
    //     className=""
    //     open={isSidebarOpen}                     // sidebar will have to move up to parent component
    //     onOpenChange={setIsSideBarOpen}
    // >
        <div className="flex flex-col bg-gray-100 h-full p-4">
            {/* <Toaster position="top-right" /> */}
            <div className="flex flex-col h-full justify-center items-center ">
                <div className="w-full flex justify-between">
                    <AddTimeColumnButton 
                        onColumnAdd={handleColumnAdd}
                        existingTimeColumns={timeColumns}
                    />
                    <Button
                        onClick={handleManualToggleSidebar}
                        className="bg-gray-100 text-black mb-4 hover:bg-gray-200 shadow shadow-black/20"
                    >
                        {isSidebarOpen ?
                            <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />
                        }
                    </Button>
                </div>
                <div className="w-full h-full flex-grow overflow-auto border-1 border-gray-200 rounded-md "> 
                    <Table className="w-full rounded-md">
                        <TableHeader className=" bg-gray-100 sticky top-0">
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
                                    className={`p-0 min-w-32 text-sm text-gray-800 border-separate border-gray-200 border-b ${rowType === "titleRow" ? "bg-lime-50" : "bg-white border-r border-separate"}`}
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
        // <AssessmentToolSidebar  />
    // </SidebarProvider>
  );
}
