import { ImagingData, LabTableData, MicrobiologyReportData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { getResultStatus } from "@/app/simulation/[sessionId]/chart/labs/page";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import AddMicrobiologyReport from "./addMicrobiologyReport";
import AddImagingReport from "./addImagingReport";

interface CellProps {
  getValue: () => string | number | boolean | object | ImagingData | MicrobiologyReportData | undefined;
  row: Row<LabTableData>;
  column: Column<LabTableData, unknown>;
  table: Table<LabTableData>;
}
export const LabTableInputCell = ({ getValue, row, column, table }: CellProps) => {
  const initialValue = (getValue() as string) || "";
  const abnormalRange = row.original?.normalRange
  const criticalRange = row.original?.criticalRange

  const resultStatus = getResultStatus(initialValue, abnormalRange, criticalRange);
  const isCritical = resultStatus === "critical"
  const isAbnormal = resultStatus === "abnormal"

  const [value, setValue] = useState(initialValue)
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div key={`${row.id}-${column.id}-${row.original.field}`} className="flex h-6 items-center w-full hover:bg-gray-50">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className={`w-full h-6 text-right !text-xs border-0 rounded-none shadow-none focus-visible:ring-0 ${(isAbnormal || isCritical) && "text-red-600 font-medium"}`}
        onKeyDown={onKeyDown}
        key={`${row.id}-${column.id}-${row.original.field}`}
      />
      {isCritical && <TriangleAlert color="#e7000b" size={18} />}
    </div>
  );
};



export function LabTableMicrobioReport({ column, row, table, getValue }: CellProps) {
  const microbiologyReport = getValue() as MicrobiologyReportData || {}
  const isEditMode = Object.keys(microbiologyReport).length > 0;

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleAddorEditReport = (newReportData: MicrobiologyReportData) => {
    table.options.meta?.updateData(row.index, column.id, newReportData);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle />
      <DialogTrigger asChild className="hover:bg-gray-50">
        {isEditMode ? (
          <button type='button' className="w-full h-6 text-center text-xs">
            {microbiologyReport.sampleType}
          </button>
        ) : (
          <button type='button' className="w-full h-6"></button>
        )}
      </DialogTrigger>
      <AddMicrobiologyReport
        handleAddMicrobiologyReport={handleAddorEditReport}
        initialData={isEditMode ? microbiologyReport : undefined}
      />
    </Dialog>
  )
}


export function LabTableImagingReport({ getValue, row, table, column }: CellProps) {
  const imagingReport = (getValue() as ImagingData) || {}
  const [isImageReportOpen, setIsImageReportOpen] = useState(false)
  const isImageEditMode = Object.keys(imagingReport).length > 0;

  const handleAddorEditImageReport = (newReportData: ImagingData) => {
    table.options.meta?.updateData(row.index, column.id, newReportData);
    setIsImageReportOpen(false); // Close the popover on submit
  };

  return (
    <Dialog open={isImageReportOpen} onOpenChange={setIsImageReportOpen}>
      <DialogTitle />
      <DialogTrigger asChild className="hover:bg-gray-50">
        {isImageEditMode ? (
          <button type='button' className="w-full h-6 text-center text-xs">
            {imagingReport.displayName}
          </button>
        ) : (
          <button type='button' className="w-full h-6"></button>
        )}
      </DialogTrigger>
      <AddImagingReport
        imagingType={row.original.field}
        initialData={isImageEditMode ? imagingReport : undefined}
        handleAddImagingReport={handleAddorEditImageReport}
      />
    </Dialog>
  )
}