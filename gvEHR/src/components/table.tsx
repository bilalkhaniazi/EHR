import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Vitals, AutocompleteOptions } from "../tableData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { generateInitialVitalsData, getAllInitialHours } from "../tableData";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AutoComplete } from "./autocomplete";
import { Clock, Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { TimePickerInput } from "./ui/time-picker-input";
import { Toaster, toast } from "sonner";
import CheckBoxList from "./CheckBoxList";

const columnHelper = createColumnHelper<Vitals>();

function getPinnedStyles(column: any): React.CSSProperties {
  if (!column.getIsPinned()) return {};
  const side = column.getIsPinned();
  return {
    position: 'sticky',
    [side]: `${column.getStart(side)}px`,
    zIndex: side === 'left' ? 2 : 1,
  };
}

export function PtTable() {
    const { allTimesColumns, predefinedVitalsTimeMap } = useMemo(() => getAllInitialHours(), [])

    const [selectedTime, setSelectedTime] = useState<Date | undefined>(new Date())
    const [timeColumns, setTimeColumns] = useState(allTimesColumns)
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
    const [data, setData] = useState(() => generateInitialVitalsData(allTimesColumns, predefinedVitalsTimeMap));

    const onCellUpdate = useCallback((rowID: string, columnID: string, newValue: string) => {
        setData(oldData => 
            oldData.map(row => {
                if(row.field === rowID) {
                    return {
                        ...row,
                        [columnID]: newValue,
                    };
                }
                return row
            })
        );
    },  [])

    const displayDate = () => {
        const todayDate = new Date()
        return todayDate.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
        });
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor("field", {
                id: 'Vital Signs',
                header: () => "",
                cell: info => {
                    const rowType = info.row.original.rowType
                    console.log(rowType)
                    if (rowType === "titleRow") {
                        return (
                            <p className="min-w-24 h-6 text-left font-medium py-0 pl-4 text-sm text-lime-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">{info.row.original.field}</p>
                        )
                    } 
                    else {
                        return (
                            <p className="min-w-24 h-6 text-left font-light py-0 pl-4 text-sm text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">{info.getValue()}</p>

                        )
                    };
                }, 
            }),

            ...timeColumns.map(timeKey =>
                columnHelper.accessor(timeKey, {
                    id: timeKey,
                    header: () => (
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate()}</h2>
                            <h1 className="mb-1">{timeKey}</h1>
                        </div>
                    ),
                    cell: ({row, column, getValue}) => {
                        const initialValue = (getValue() as string) || '';
                        const [value, setValue] = useState(initialValue)
                        const componentType = row.original.componentType
                        const autocompleteOptions = (row.original.autocompleteOptions || []) as AutocompleteOptions[];
                        const normalRange = row.original?.normalRange
                        const handleComponentChange = (newValue: string) => {
                            setValue(newValue); 
                            onCellUpdate(row.original.field, column.id, newValue); 
                        };

                        let alertFlag = false;
                        if (normalRange && componentType == "input") {
                            const numericValue = parseFloat(value) 
                            if(!isNaN(numericValue)) {
                                alertFlag = numericValue < normalRange.low || numericValue > normalRange.high;
                            }
                        }
                            
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

                        if(componentType === "static") {
                            return (
                                <p></p>
                            );
                        } else if(componentType === "solidRow") {
                            return (
                                <div className="h-6 w-full bg-gray-100"></div>
                            )
                        } else if(componentType === "autocomplete") {
                            return (
                                <AutoComplete
                                    options={autocompleteOptions} 
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        } else if (componentType === "checkboxlist") {
                            return (
                                <CheckBoxList></CheckBoxList>
                            )
                        } else {
                            return (
                                <Input
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
        [onCellUpdate, timeColumns]
    );

    const ptTable = useReactTable({
        data,
        columns,
        enablePinning: true,
        initialState: {
            columnPinning: {
                left: ['Vital Signs']
            }
        },
        getCoreRowModel: getCoreRowModel(), 
    });

    useEffect(() => {
        console.log(data)
    }, [data]);

    const onAddTime = useCallback(() => {
        const now = new Date()
        
        const addedTime = now.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '')
        console.log(addedTime)

        if(timeColumns.includes(addedTime)) {   
            toast.error(`Time at ${addedTime} already exists`, {
                description: "Please choose a different time or use an existing column.",
            });
            return;
        }

        setTimeColumns(prevColumns => {
            const updatedColumns = [...prevColumns, addedTime ].sort();
            return updatedColumns;
        });

        setData(prevData =>
            prevData.map(row => {
                const newRow = {...row};
                newRow[addedTime] = '';
                return newRow
            })
        );

        toast.success(`Time column added at ${addedTime}`)
        
    }, [timeColumns, data]);

    const onAddUserDefinedTime = useCallback(() => {
        if (!selectedTime) {
            alert("Please select a time to add.");
            return;
        }

        const addedTime = selectedTime.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '');

        if (timeColumns.includes(addedTime)) {
            toast.error(`Time at ${addedTime} already exists`, {
                description: "Please choose a different time or use an existing column.",
            });
            return;
        }

        setTimeColumns(prevColumns => {
            const updatedColumns = [...prevColumns, addedTime].sort();
            return updatedColumns;
        });

        setData(prevData =>
            prevData.map(row => {
                const newRow = { ...row };
                newRow[addedTime] = ''; 
                return newRow
            })
        );
        setIsPopoverOpen(false)
        setSelectedTime(new Date(0, 0, 0, 0))
        toast.success(`Time column added at ${addedTime}`)
        }, [selectedTime, timeColumns, setData, setTimeColumns]);
   
    return (
    <div className="flex flex-col justify-center items-center mt-4">
      <Toaster position="top-right" />
      <div className="flex gap-4">
        <Button onClick={onAddTime} className="bg-gray-100 text-black mb-4 hover:bg-gray-200">
            <Plus />
            Add Col
        </Button>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} >
            <PopoverTrigger asChild className="">
                <Button 
                    className="bg-gray-100 text-black mb-4 hover:bg-gray-200"
                >
                    <Clock />
                    Insert Col
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-3 p-3 flex flex-col bg-white shadow shadow-black/25 rounded-xl" sideOffset={4}>
                <div className="flex justify-around">
                    <h1 className="text-center font-normal text-sm">Hours</h1>
                    <h1 className="text-center font-normal text-sm">Minutes</h1>
                </div>
                <div className="flex mt-2 mb-4 gap-1">
                    <TimePickerInput
                        picker={'hours'}
                        setDate={setSelectedTime}
                        date={selectedTime} 
                        className="bg-gray-100/50 border border-gray-300 focus:border-0"
                    />
                    <span>:</span>
                    <TimePickerInput 
                        picker={'minutes'} 
                        setDate={setSelectedTime} 
                        date={selectedTime}
                        className="bg-gray-100/50 border border-gray-300 focus:border-0"
                    />
                </div>
                    <Button 
                        variant="secondary"
                        onClick={onAddUserDefinedTime}
                        className=""
                    >    
                        Insert Time
                    </Button>
            </PopoverContent>
        </Popover>
      </div>
      <div className="relative w-full overflow-x-auto border-1 border-gray-200 rounded-md">
      <Table className="w-full">
        <TableHeader className="bg-gray-100">
          {ptTable.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  style={getPinnedStyles(header.column)}
                  key={header.id}
                  className="h-6 text-center font-medium border-b-2 border-gray-200"
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
                    key={cell.id}
                    className={`p-0 min-w-32 text-sm bg-white text-gray-800 border-gray-200 border-b ${rowType === "titleRow" ? "" : "border-r"}`}
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
  );
}
