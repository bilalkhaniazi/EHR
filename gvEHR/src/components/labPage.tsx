import { generateAllInitialLabTimes, generateInitialLabData, labTemplate, type LabTableData, type LabTimePoint } from "./labsData"

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import AddBgDemo from "./addBgDemo";

// Define the structure for initial lab results when adding a new column
export interface NewLabResult {
  labName: string;
  value: string;
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
  const allTimePoints = useMemo(() => generateAllInitialLabTimes(), [])

  const [timePoints, setTimePoints] = useState(allTimePoints)

  // generate inital dataset to be used by PtTable 
  const initialData = useMemo(() => generateInitialLabData(allTimePoints, labTemplate), [allTimePoints]);
  
  const [data, setData] = useState<LabTableData[]>(initialData);

  // updates Data upon submission of Input or AssessmentSelect component 
  // const onCellUpdate = useCallback((rowId: string, columnId: string, newValue: string | string[]) => {
  //   setData(oldData => 
  //     oldData.map(row => {
  //       if(row.field === rowId) {
  //         return {
  //           ...row,
  //           [columnId]: newValue,
  //         };
  //       }
  //       return row
  //     })
  //   );
  // },  []);


  const currentDate = useMemo(() => {
    const todayDate = new Date()
    return todayDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
  }, []);
  
  console.log(currentDate)

  const handleColumnAdd = useCallback((initialLabResults?: NewLabResult[]) => {
    const now = new Date();
    // Format the current date and time to match the existing dateKey format (e.g., "MM/DD/YYYY HH:MM")
    const newDateKey = now.toLocaleDateString("en-US", {
      month: "2-digit", // Ensure two digits for month
      day: "2-digit",   // Ensure two digits for day
    }) + " " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format for consistency
    });

    // Create a new LabTimePoint object for the new column, providing default/derived values
    const newTimePoint: LabTimePoint = {
      dateKey: newDateKey,
      daysOffset: 0, // Default for a newly added column, or calculate based on logic
      hours: now.getHours(), // Get the current hour
      labs: [], // Newly added columns don't have predefined lab results in their LabTimePoint object
    };

    // Update the timePoints state by adding the new time point and sorting them chronologically
    setTimePoints(prevTimePoints => {
      const updatedTimePoints = [...prevTimePoints, newTimePoint].sort((a, b) => {
        const dateA = new Date(a.dateKey);
        const dateB = new Date(b.dateKey);
        return dateA.getTime() - dateB.getTime();
      });
      return updatedTimePoints;
    });
      

    // Update the data state to include the new column and populate it with initial lab results if provided
    setData(prevData => {
      return prevData.map(row => {
        const newRow: LabTableData = { ...row };
        // Initialize the new column for this row with an empty string
        newRow[newDateKey] = ""; 

        // If initialLabResults are provided, find a matching lab result for the current row's field
        if (initialLabResults) {
          const labResult = initialLabResults.find((lr) => lr.labName === row.field);
          // If a matching lab result is found, set the new column's value to it
          if (labResult) {
            newRow[newDateKey] = labResult.value;
          }
        }
        return newRow;
      });
    });

    toast.success(`New column added for ${newDateKey}`);
  }, []); 

  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        id: 'pinned',
        header: () => <h1 className="w-full h-full bg-gray-100"></h1>,
        cell: info => {
          const rowType = info.row.original.rowType;
          const field = info.row.original.field
          if (rowType === "divider") {
            return (
              <p className="text-left text-sm py-0 px-2 font-medium text-blue-900">
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
                  <TooltipTrigger className="w-full font-normal text-sm text-neutral-700 shadow-none rounded-none">
                    <div className="flex justify-end w-full">
                      <p className="text-right font-normal px-2 text-sm text-neutral-700">{field}</p>
                      {unit && <p className="text-right font-normal pr-2 text-xs text-neutral-400">{unit}</p>}
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow border border-gray-200 rounded-xl ml-4 p-2 z-10">
                      <h1 className="text-md font-semibold">{field}</h1>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="pl-2 text-gray-800 text-sm font-medium">
                            <span className="font-normal">Low: </span>
                            &#60;{labRange.low}
                          </p>
                          <p className="pl-2 text-gray-800 text-sm font-medium">
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
                <p className="h-6 text-left font-normal py-0 pl-4 text-sm text-neutral-600">
                  {field}
                </p>
              );
            }
          }
        },
      ),

      // map out remaining columns
      ...timePoints.map(timePoint =>
        columnHelper.accessor(timePoint.dateKey, {
          id: timePoint.dateKey,
          header: () => {
            const dateAndTime = timePoint.dateKey.split(" ")
            const displayTime = dateAndTime[1].replace(':', '')
            const displayDate = dateAndTime[0]

            return (
              <div className="flex flex-col justify-center items-center">
                <h2 className="my-1 text-neutral-500 text-xs font-light">{displayDate}</h2>
                <h1 className="mb-1">{displayTime}</h1>
              </div>
            )
          },
          cell: ({row, column, getValue}) => {
            const initialValue = (getValue() as string) || '';
            const labRanges = row.original?.normalRange
            let alertFlag = false
            if (labRanges) {
              const numericValue = parseFloat(initialValue)
              const numericHigh = parseFloat(labRanges.high)
              const numericLow = parseFloat(labRanges.low)

              alertFlag = initialValue < labRanges.low || initialValue > labRanges.high
              if (!isNaN(numericValue) && !isNaN(numericLow) && !isNaN(numericHigh)) {
                alertFlag = numericValue < numericLow || numericValue > numericHigh;
              }
            }
            return (
              <p key={`${row.id}-${column.id}-${row.original.field}`} className={`text-right px-2 ${alertFlag ? "text-red-600 font-medium" : ''}`}>{initialValue}</p>
            );
          } 
        })
      )
    ],
    [timePoints]
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
    <div className="flex flex-col h-full bg-gray-100 justify-center items-center px-4 ">
      <div className="w-full flex justify-between p-4">
        <AddBgDemo onAddLab={handleColumnAdd} />
      </div>
      <div className="w-full h-full pb-20 border border-gray-200 rounded-t-lg overflow-auto">
        <Table className="w-full overflow-x-auto">
          <TableHeader className=" bg-gray-100 sticky top-0">
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
                  className={`p-0 min-w-32 text-sm border-separate border-gray-200 border-b ${rowType === "divider" ? "bg-blue-50" : "bg-white border-r border-separate"}`}
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

  

  export default LabPage