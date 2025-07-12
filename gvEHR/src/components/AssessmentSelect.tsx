import { Select, SelectContent, SelectTrigger, SelectItem, SelectGroup, SelectLabel, SelectValue } from "./ui/select"    
import { type chartingOptions} from "@/tableData"
import { cn, } from "@/lib/utils"


interface AssessmentSelectProps {
    options: chartingOptions[];
    value: string;
    onValueChange: (newValue: string) => void;
    rowId: string;
    columnId: string;
    className?: string;
}
export default function AssessmentSelect({ 
    options,
    value,
    onValueChange,
    className,
    rowId,
    columnId
}: AssessmentSelectProps) {
     
    return(
        <div className={cn("flex items-center h-6 w-full", className)}>
            <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="h-6 w-full focus-visible:ring-0 py-0 px-2 justify-end text-xs rounded-none shadow-none border-0">
                <SelectValue placeholder="" className="text-xs w-full" />
            </SelectTrigger>
            <SelectContent className="">
                <SelectGroup className="p-0 ">
                    {options.map((option) => (
                        <SelectItem 
                            key={option.value}
                            value={option.label}
                            className="w-full text-xs h-6 m-0 border-b last:border-b-0 rounded-none"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
)}