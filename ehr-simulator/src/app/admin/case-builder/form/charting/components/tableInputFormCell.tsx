import AssessmentSelect from "@/app/simulation/[sessionId]/chart/charting/components/assessmentSelector";
import { chartingOptions, FlexSheetData, FlexSheetFormCellValue } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData";
import { getAlertFlag } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetHelpers";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Row,
  Column,
  Table
} from "@tanstack/react-table";

export function getCellIcon(status: boolean, value: string) {
  if (value && status) {
    return (<div className="size-1.5 rounded-full ml-2 bg-lime-600"></div>)
  } else if (value && !status) {
    return (<div className="size-1.5 rounded-full ml-2 bg-yellow-600"></div>)
  }
}


interface CellProps {
  getValue: () => string | number | boolean | string[] | { subsetId: string; label: string; }[] | { low: number; high: number; } | { assessment: string; description: string; }[] | FlexSheetFormCellValue | undefined;
  row: Row<FlexSheetData>;
  column: Column<FlexSheetData, unknown>;
  table: Table<FlexSheetData>;
  visibleInPresim: boolean
}
export const TableInputFormCell = ({ getValue, row, column, table, visibleInPresim }: CellProps) => {
  const initialData = (getValue() as FlexSheetFormCellValue) || "";
  const cellValue = initialData.value
  const [value, setValue] = useState(cellValue);
  const newData = {
    value,
    visibleInPresim
  }

  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  const alertFlag = getAlertFlag(row.original, value, row.original.componentType);

  const onBlur = () => {
    if (value != cellValue) {
      table.options.meta?.updateData(row.index, column.id, newData);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className={`flex h-6 items-center w-full hover:bg-gray-50 `}>
      {getCellIcon(initialData.visibleInPresim, value)}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className={`w-full h-6 text-right md:text-xs border-0 rounded-none shadow-none focus-visible:ring-0  ${alertFlag ? "text-red-600 font-medium" : ""}`}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export const TableAssessmentSelectFormCell = ({ getValue, row, column, table, visibleInPresim }: CellProps) => {
  const initialData = (getValue() as FlexSheetFormCellValue) || { value: '', visibleInPresim: false };
  const cellValue = initialData.value
  const [selectedValue, setSelectedValue] = useState(cellValue);
  const chartingOptions = (row.original.chartingOptions || []) as chartingOptions[];


  useEffect(() => {
    setSelectedValue(cellValue);
  }, [cellValue]);

  const handleComponentChange = (newValue: string) => {
    setSelectedValue(newValue);
    const newData = {
      value: newValue,
      visibleInPresim
    }
    table.options.meta?.updateData(row.index, column.id, newData);
  };

  return (
    <div className="h-6 flex items-center">
      {getCellIcon(initialData.visibleInPresim, selectedValue)}


      <AssessmentSelect
        options={chartingOptions}
        value={selectedValue}
        rowId={row.original.id}
        columnId={column.id}
        onValueChange={handleComponentChange}
        className={`p-0 h-6 hover:bg-muted/30 `}
      />
    </div>
  );
};