// src/components/CheckBoxList.tsx
import React, { useState, useEffect } from 'react';
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button"; // Make sure Button is imported
import { Checkbox } from "./ui/checkbox";
import type { AutocompleteOptions } from "@/tableData";

interface CheckBoxListProps {
    options: AutocompleteOptions[]; // The list of available checkboxes (e.g., WDL, Lung Sounds)
    selectedOptions: string[]; // The currently selected options (values) from the parent
    field: string;
    onSelectionChange: (field: string, selectedValues: string[]) => void; // Callback to notify parent of changes
}

const CheckBoxList: React.FC<CheckBoxListProps> = ({ options, selectedOptions, field, onSelectionChange }) => {
    // Local state to manage the checkboxes within the popover
    const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedOptions));
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Sync local state with parent prop when parent's selectedOptions change
    // useEffect(() => {
    //     setLocalSelected(new Set(selectedOptions));
    // }, [selectedOptions]);

    const handleCheckboxChange = (value: string, checked: boolean) => {
        setLocalSelected(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(value);
            } else {
                newSet.delete(value);
            }
            console.log(newSet)
            return newSet;
        });
    };

    const handleApplyClick = () => {
        // When the "Apply" button is clicked, notify the parent of the final selections
        onSelectionChange(field, Array.from(localSelected));
        setIsPopoverOpen(false); // Close the popover after applying
    };

    const handleCancelClick = () => {
        // If "Cancel" is clicked, revert to the parent's current selections and close
        setLocalSelected(new Set(selectedOptions)); // Revert local changes
        setIsPopoverOpen(false);
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
            <PopoverTrigger asChild className='max-w-full justify-start'>
                <Button className="h-6 w-32 rounded-none px-2 overflow-hidden bg-transparent shadow-none hover:bg-muted/30 font-normal text-xs text-black">
                    {[...localSelected].join(', ') || ""}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit bg-white p-0 shadow-md shadow-black/30 border rounded-xl">
                <div className=""> 
                    {options.map((option) => (
                        <Label
                            key={option.value}
                            className="hover:bg-accent/50 flex items-left gap-3 border-b p-2 last:border-b-0 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
                        >
                            <Checkbox
                                id={`checkbox-${option.value}`}
                                checked={localSelected.has(option.value)}
                                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                            />
                            <p className="text-xs text-left leading-none font-normal">
                                {option.label}
                            </p>
                        </Label>
                    ))}
                </div>
                <div className="flex justify-center gap-2 p-2 border-t"> 
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelClick}
                        className='text-xs py-1 px-2'
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleApplyClick}
                        className='text-xs py-1 px-2 bg-lime-700'
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default CheckBoxList;