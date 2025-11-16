"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddTimeColumnButtonProps {
  handleColumnAdd: (timeString: number) => void;
}

export function AddLabColumn({ handleColumnAdd }: AddTimeColumnButtonProps) {
  const [days, setDays] = useState<number | ''>(0);
  const [hours, setHours] = useState<number | ''>(0);
  const [minutes, setMinutes] = useState<number | ''>(0);

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const timeOffset = ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0)

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (x: number | '') => void
  ) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setter('');
      return
    }
    const numValue = parseFloat(inputValue);

    if (!isNaN(numValue) && numValue >= 0) {
      setter(numValue);
    }
  };

  const onColumnAdd = (offset: number) => {
    setIsPopoverOpen(false);
    handleColumnAdd(offset);
    setDays('');
    setHours('');
    setMinutes('')
  }

  return (
    <div className="">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-white text-black text-xs hover:bg-gray-100 shadow">
            <Clock className="mr-1" />
            Time Offset
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-100 p-3 flex flex-col bg-white shadow shadow-black/25 rounded-xl" sideOffset={4}>
          <div className="flex mt-2 mb-4 gap-3">
            <div>
              <Label htmlFor='days' className="text-xs">Days</Label>
              <Input id='days' value={days} onChange={(e) => handleTimeChange(e, setDays)} className="w-12 p-0.5 text-center" />
            </div>
            <div>
              <Label htmlFor='hours' className="text-xs">Hours</Label>
              <Input id='hours' value={hours} onChange={(e) => handleTimeChange(e, setHours)} className="w-12 p-0.5 text-center" />
            </div>
            <div>
              <Label htmlFor='minutes' className="text-xs">Minutes</Label>
              <Input id='minutes' value={minutes} onChange={(e) => handleTimeChange(e, setMinutes)} className="w-12 p-0.5 text-center" />
            </div>
          </div>
          <Button
            type='button'
            variant="secondary"
            onClick={() => onColumnAdd(timeOffset)}
            className="w-full shadow shadow-black/20"
          >
            Insert Time
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}