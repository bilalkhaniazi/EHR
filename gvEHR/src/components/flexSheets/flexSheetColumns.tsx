import { createColumnHelper } from "@tanstack/react-table";
import { assessmentTools, type tableData } from "./tableData";
import { Input } from "../ui/input";
import CheckBoxList from "./CheckBoxList";
import { AddTimeColumnButton } from "./addTimeColButton";
import AssessmentSelect from "./AssessmentSelect";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { useState } from "react";
import type { chartingOptions } from "./tableData";
import { differenceInMilliseconds, format } from "date-fns";

const columnHelper = createColumnHelper<tableData>();

interface ColumnConfig {
    timeOffsets: number[];
    sessionStartTime: number | null;
    fieldSelections: Record<string, string[]>;
    onCellUpdate: (rowId: string, columnId: string, newValue: any) => void;
    handleSubsetSelection: (id: string, columnId: string, selectedIds: string[]) => void;
}

const formatTimeFromOffset = (offsetMinutes: number, nowTimestamp: number | null) => {
    if (!nowTimestamp) {
        return { error: { status: 'TIME_ERROR', data: 'Time has not been initialized.' } }; 
    }
    // Subtract the offset from the current time
    const targetTime = differenceInMilliseconds(nowTimestamp, (offsetMinutes * 60 * 1000));
    
    const time = format(targetTime, 'HHmm')
    const date = format(targetTime, 'MM/dd')

    return { time, date };
};


export const getFlexSheetColumns = ({ timeOffsets, sessionStartTime, fieldSelections, onCellUpdate, handleSubsetSelection }: ColumnConfig) => [
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
    const { time: displayTime, date: displayDate } = formatTimeFromOffset(offsetKey, sessionStartTime);
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
]