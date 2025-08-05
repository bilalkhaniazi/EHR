import { Select, SelectContent, SelectTrigger, SelectItem, SelectGroup, SelectValue } from "../ui/select"    

interface AssessmentSelectProps {
    options: string[];
    value: string;
    onValueChange: (newValue: string) => void;
    className?: string;
}
export default function AssessmentSelect({ 
    options,
    value,
    onValueChange,
}: AssessmentSelectProps) {
    return(
        <div>
            <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="">
                <SelectValue className="text-xs w-full">
                    {value}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="">
                <SelectGroup className="p-0 ">
                    {options.map((option) => (
                        <SelectItem 
                            key={option.subsetId}
                            value={option.subsetId}
                            className="w-full text-xs h-6 m-0 border-b first:focus:rounded-2xl last:border-b-0 rounded-none"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
          </Select>
        </div>
)}