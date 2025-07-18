import { generateAllInitialLabTimes, generateInitialLabData, labTemplate, type LabTableData } from "./labsData"

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { Toaster, toast } from "sonner";
import { AddTimeColumnButton } from "./addTimeColButton";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";


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
  const [fieldSelections, setFieldSelections] = useState<Record<string, string[]>>({});

  // generate inital dataset to be used by PtTable 
  const initialData = useMemo(() => generateInitialLabData(allTimePoints, labTemplate), [allTimePoints]);
  
  const [data, setData] = useState<LabTableData[]>(initialData);

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
    // const filteredData: LabTableData[] = initialData.filter(row => {
    //   if (row.hideable) {
    //     // Only show hideable rows if their specific hideableId is in the set
    //     return row.hideableId && visibleSubsetIds.has(row.hideableId);                       hidden column filter could be removed
    //   }
    //   return true; // Always show non-hideable rows
    // });

    return data.map(row => {
      const newRow = { ...row };
      timePoints.forEach(hour => {
        const matchingRow = data.find(d => d.field === row.field);
        newRow[hour.dateKey] = matchingRow ? matchingRow[hour.dateKey] : "";
      });
      return newRow;
    });
  }, [visibleSubsetIds, timePoints]);
  
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


  // const handleColumnAdd = useCallback((newTime: string) => {
  //   setTimePoints(prevColumns => {
  //     const newTimePoint = {newTime, {field: }}
  //     const updatedColumns = [...prevColumns, newTime].sort();
  //     return updatedColumns;
  //   });

  //   setData(prevData =>
  //     prevData.map(row => {
  //       const newRow = { ...row };
  //       newRow[newTime] = '';
  //       return newRow;
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   let shouldOpen = false;
  //   for (const tool of assessmentTools) {
  //     if (visibleSubsetIds.has(tool.name)) {
  //       shouldOpen = true
  //       break
  //     }
  //   }

  //   if(shouldOpen != isSidebarOpen) {
  //     setIsSideBarOpen(shouldOpen)
  //   }
  //   }, [visibleSubsetIds]);

  // const handleManualToggleSidebar = () => {
  //   setIsSideBarOpen(prev => !prev);
  //   console.log("called")
  // }; 
  
  

  const currentDate = useMemo(() => {
    const todayDate = new Date()
    return todayDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
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
                      <p className="text-right font-normal px-2 text-sm text-neutral-700"> {field}</p>
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
            const displayDate = dateAndTime[0].replace('-', '/')

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
    <div className="flex flex-col h-screen justify-center items-center p-4 ">
    <Toaster position="top-right" />
      <div className="w-full flex justify-between">
        {/* <AddTimeColumnButton 
          onColumnAdd={handleColumnAdd}
          // existingtimePoints={timePoints}
        />
         */}
      </div>
      <div className="w-full overflow-auto border-1 border-gray-200 rounded-md ">
    
        <Table className="w-full  rounded-md">
          <TableHeader className=" bg-gray-100 sticky top-0">
          {ptTable.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead
              style={getPinnedStyles(header.column)}
              key={header.id}
              className="border-b-2 border-gray-200 p-0 "
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