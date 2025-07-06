import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Vitals } from "../tableData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { generateInitialVitalsData, getInitialDynamicHours } from "../tableData";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AutoComplete } from "./autocomplete";
import { Plus } from "lucide-react"

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
    const [timeColumns, setTimeColumns] = useState(() => getInitialDynamicHours())
    const [data, setData] = useState(() => generateInitialVitalsData(timeColumns));

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

    const hrSourceOptions = useMemo(() => [
        { value: "Apical", label: "Apical" },
        { value: "Brachial", label: "Brachial" },
        { value: "Dorsalis pedis", label: "Dorsalis pedis" },
        { value: "Femoral", label: "Femoral" },
        { value: "Monitor", label: "Monitor" },
        { value: "Popliteal", label: "Popliteal" },
        { value: "Radial", label: "Radial" },
    ], []);

    const bpSourceOptions = useMemo(() => [
        { value: "Left upper arm", label: "Left upper arm" },
        { value: "Right upper arm", label: "Right upper arm" },
        { value: "Left lower arm", label: "Left lower arm" },
        { value: "Right lower arm", label: "Right lower arm" },
        { value: "Left thigh", label: "Left thigh" },
        { value: "Right thigh", label: "Right thigh" },
        { value: "Left lower leg", label: "Left lower leg" },
        { value: "Right lower leg", label: "Right lower leg" },
        { value: "Arterial line", label: "Arterial line" },
        { value: "Other", label: "Other" },
    ], []);

    const tempSourceOptions = useMemo(() => [
        { value: "Oral", label: "Oral" },
        { value: "Axillary", label: "Axillary" },
        { value: "Rectal", label: "Rectal" },
        { value: "Tympanic", label: "Tympanic" },
        { value: "Temporal", label: "Temporal" },
        { value: "Bladder", label: "Bladder" },
        { value: "Other", label: "Other" },
    ], []);


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
                    const rowType = info.row.original.field
                    if (rowType === "Vital Signs") {
                        return (
                            <p className="min-w-24 h-6 text-left font-medium py-0 pl-4 text-sm text-lime-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">Vital Signs</p>
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
                            <h2 className="mb-1 text-neutral-500 text-xs font-light">{displayDate()}</h2>
                            <h1 className="mb-1">{timeKey}</h1>
                        </div>
                    ),
                    cell: ({row, column, getValue}) => {
                        const initialValue = getValue()
                        const [value, setValue] = useState(initialValue)

                        const rowType = row.original.field

                        const handleComponentChange = (newValue: string) => {
                            setValue(newValue); // Update local state
                            onCellUpdate(row.original.field, column.id, newValue); // Update global state immediately
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

                        if(rowType === "Vital Signs") {
                            return (
                                <p></p>
                            );
                        } else if(rowType === "BP Source") {
                            return (
                                <AutoComplete
                                    options={bpSourceOptions} 
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        } else if (rowType === "HR Source") {
                            return (
                                <AutoComplete
                                    options={hrSourceOptions} 
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        } else if (rowType === "Temp Source") {
                            return (
                                <AutoComplete
                                    options={tempSourceOptions}
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                )
                        } else {
                            return (
                                <Input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                    onKeyDown={onKeyDown}
                                    className="min-w-12 h-6 text-right pr-2 py-0 text-xs border-none shadow-none rounded-none hover:bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        };
                    }
                }),
            )
            
            
        ],
        [onCellUpdate, hrSourceOptions, bpSourceOptions, timeColumns]
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
        const addedDate = now.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
        });
        
        const addedTime = now.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '')
        console.log(addedDate, addedTime)

        if(timeColumns.includes(addedTime)) {
            alert(`Time at ${addedTime} already exists`)
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

        
    }, [timeColumns, data]);

    return (
    <div className="flex flex-col justify-center items-center p-4">
      <Button onClick={onAddTime} className="bg-gray-100 text-black mb-4">
        <Plus />
        Add Col
      </Button>
      <Table className="w-full border-collapse border-1">
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
                const rowType = row.original.field
                
                return(
                  <TableCell
                    style={getPinnedStyles(cell.column)}
                    key={cell.id}
                    className={`p-0 text-sm text-gray-800 border-b ${rowType === "Vital Signs" ? "" : "border-r"} border-gray-200`}
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
  );
}
