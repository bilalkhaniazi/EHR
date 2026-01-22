import { Button } from "@/components/ui/button";
import { MedCardColumn } from "../components/marHelpers";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { displayColumnShifterDate } from "./marHelpers";

interface ColumnShiftControlProps {
  columns: MedCardColumn[];
  onColumnShift: (offset: number) => void;

}

const ColumnShiftControl = ({ columns, onColumnShift }: ColumnShiftControlProps) => {
  return (
    <div className="flex items-center h-9 border border-slate-200 rounded-lg shadow-sm overflow-hidden w-fit">
      <div className="flex items-center h-full px-3 bg-slate-100 border-r border-slate-200">
        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
          {displayColumnShifterDate(columns[0].startTime, columns[5].startTime)}
        </span>
      </div>
      <div className="flex items-center h-9 px-1 bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          onClick={() => onColumnShift(-6)}
        >
          <ChevronsLeft size={16} />
        </Button>
        <p className="text-xs font-medium font-mono text-slate-600 min-w-[100px] text-center whitespace-nowrap">
          {columns[0].colHeader}
          <span className='mx-2'>–</span>
          {columns[5].colHeader}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          onClick={() => onColumnShift(6)}
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export default ColumnShiftControl;