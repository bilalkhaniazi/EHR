import { useState, useCallback } from "react";
import { Button } from "../ui/button"; 
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"; 
import { TimePickerInput } from "../ui/time-picker-input"; 
import { Clock, Plus } from "lucide-react";
import { toast } from "sonner"; 

interface AddTimeColumnButtonProps {
    onColumnAdd: (timeString: number) => void;
    existingTimeColumns: number[];
}

export function AddTimeColumnButton({ onColumnAdd, existingTimeColumns }: AddTimeColumnButtonProps) {
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(new Date(0, 0, 0, 0, 0));
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const handleAddTime = useCallback(() => {
        const now = new Date();
        const addedTime = now.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '');

        if (existingTimeColumns.includes(addedTime)) {
            toast.error(`Time at ${addedTime} already exists`, {
                description: "Please choose a different time or use an existing column.",
            });
            return;
        }

        onColumnAdd(addedTime); 
    }, [onColumnAdd, existingTimeColumns]); 

    const handleAddUserDefinedTime = useCallback(() => {
        if (!selectedTime) {
            toast.error("Please select a time to add.", {
                description: "The time field cannot be empty.",
            });
            return;
        }

        const addedTime = selectedTime.toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(":", '');

        if (existingTimeColumns.includes(addedTime)) {
            toast.error(`Time at ${addedTime} already exists`, {
                description: "Please choose a different time or use an existing column.",
            });
            return;
        }

        onColumnAdd(addedTime); 
        setIsPopoverOpen(false); 
        setSelectedTime(new Date(0,0,0,0,0,0,0)); 
    }, [selectedTime, existingTimeColumns, onColumnAdd, setIsPopoverOpen]); 
    
    return (
        <div className="flex gap-4 pl-8">
            <Button onClick={handleAddTime} className="bg-white h-6 text-black text-xs hover:bg-gray-100 shadow shadow-black/20">
                <Plus className="" />
                Add Time
            </Button>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className="bg-white h-6 text-black text-xs hover:bg-gray-100 shadow shadow-black/20">
                        <Clock className="mr-1" />
                        Insert Time
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-3 p-3 flex flex-col bg-white shadow shadow-black/25 rounded-xl" sideOffset={4}>
                    <div className="flex justify-around">
                        <h1 className="text-center font-normal text-sm">Hours</h1>
                        <h1 className="text-center font-normal text-sm">Minutes</h1>
                    </div>
                    <div className="flex mt-2 mb-4 gap-1">
                        <TimePickerInput
                            picker={'hours'}
                            setDate={setSelectedTime}
                            date={selectedTime}
                            className="bg-gray-100/50 border border-gray-300 focus:border-0"
                        />
                        <span>:</span>
                        <TimePickerInput
                            picker={'minutes'}
                            setDate={setSelectedTime}
                            date={selectedTime}
                            className="bg-gray-100/50 border border-gray-300 focus:border-0"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleAddUserDefinedTime}
                        className="w-full shadow shadow-black/20"
                    >
                        Insert Time
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}