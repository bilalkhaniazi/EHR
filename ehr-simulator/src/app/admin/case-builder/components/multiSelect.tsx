import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  name: string;
  options?: Option[];
  labelText: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultValues?: string[];
}

export function MultiSelect({
  name,
  options = [],
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  defaultValues = [],
  labelText
}: MultiSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const handleSelect = (currentValue: string): void => {
    if (!selectedValues.includes(currentValue)) {
      const newValues = [...selectedValues, currentValue];
      setSelectedValues(newValues);
    }
  };

  const handleRemove = (valueToRemove: string): void => {
    const newValues = selectedValues.filter((value) => value !== valueToRemove);
    setSelectedValues(newValues);
  };

  // Filter out already selected items from the list
  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value)
  );

  return (
    <div className="w-fit space-y-4">
      {name && <input type="hidden" name={name} value={JSON.stringify(selectedValues)} />}

      <label className="case-form-label">{labelText}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full font-normal justify-between"
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {availableOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const option = options.find((option) => option.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="pl-4 py-1.5 shadow flex items-center gap-1"
              >
                {option?.label}
                <button
                  onClick={() => handleRemove(value)}
                  className="ml-1 rounded-full p-0.5 hover:opacity-70"
                  aria-label={`Remove ${option?.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}