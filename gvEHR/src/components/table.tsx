import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback } from "react";
import type { Vitals } from "../tableData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { initialVitalsData } from "../tableData";
import { Input } from "./ui/input";
import { AutoComplete } from "./autocomplete";

const columnHelper = createColumnHelper<Vitals>();

export function PtTable() {
    const [data, setData] = useState(() => [...initialVitalsData]);
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
        { value: "Radial", label: "Radial" },
        { value: "Apical", label: "Apical" },
        { value: "Femoral", label: "Femoral" },
        { value: "Monitor", label: "Monitor" },
        { value: "Palpation", label: "Palpation" },
        { value: "Auscultation", label: "Auscultation" },
    ], []);

    const bpSourceOptions = useMemo(() => [
        { value: "Left upper arm", label: "Left upper arm" },
        { value: "Right upper arm", label: "Right upper arm" },
        { value: "Left lower arm", label: "Left lower arm" },
        { value: "Right lower arm", label: "Right lower arm" },
        { value: "Thigh", label: "Thigh" },
        { value: "Calf", label: "Calf" },
        { value: "Other", label: "Other" },
    ], []);

    const columns = useMemo(
        () => [
            columnHelper.accessor("field", {
                id: 'vitals',
                header: () => "Vital Signs",
                cell: info => (
                    <p className="min-w-24 h-6 text-left font-light py-0 pl-4 text-sm text-neutral-500 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0">{info.getValue()}</p>
                )
            }),

            ...(["0800", "1200", "1600", "2000"] as const).map(timeKey =>
                columnHelper.accessor(timeKey, {
                    id: timeKey,
                    header: () => timeKey,
                    cell: ({row, column, getValue}) => {
                        const initialValue = getValue()
                        const [value, setValue] = useState(initialValue)

                        const isBPSourceRow = row.original.field === "BP Source"
                        const isHRSourceRow = row.original.field === "HR Source"


                        const handleComponentChange = (newValue: string) => {
                            setValue(newValue); // Update local state
                            onCellUpdate(row.original.field, column.id as keyof Vitals, newValue); // Update global state immediately
                        };
                            
                        const onBlur = () => {
                            if(value != initialValue) {
                                onCellUpdate(row.original.field, column.id as keyof Vitals, value);
                            }
                        };

                        const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                            if(e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                            }
                        }

                        if(isBPSourceRow) {
                            return (
                                <AutoComplete
                                    options={bpSourceOptions} 
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        } else if (isHRSourceRow) {
                            return (
                                <AutoComplete
                                    options={hrSourceOptions} 
                                    value={value}
                                    onValueChange={handleComponentChange}
                                    className="w-full h-auto hover:bg-muted/30 border-0 px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            )
                        }
                        else {
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
        [onCellUpdate, bpSourceOptions]
    );

    const ptTable = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(), 
    });

      return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Basic TanStack Table</h2>
      <Table className="w-full border-collapse border border-gray-300">
        <TableHeader className="bg-gray-100">
          {ptTable.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="h-6 text-center font-medium"
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
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                  className="p-0 text-sm text-gray-800 border-b border-r border-gray-200"
                >
                  {/* Render the cell content using flexRender */}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {/* Optional: Table footer */}
        <TableFooter className="bg-gray-100">
          {ptTable.getFooterGroups().map(footerGroup => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <TableHead key={header.id} className="h-6 p-0 text-left text-sm font-semibold text-gray-700 border-t border-r border-gray-300">
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
