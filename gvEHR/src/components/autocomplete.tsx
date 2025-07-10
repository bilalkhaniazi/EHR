// src/components/autocomplete.tsx
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput, 
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input"; // Import Input for the visual input field

// Define the shape of an option for the AutoComplete
interface chartingOptions {
  value: string;
  label: string;
}

// Define the props for the AutoComplete component
interface AutoCompleteProps {
  options: chartingOptions[]; // Array of options to display
  value?: string; // The currently selected value (controlled by the parent component)
  onValueChange: (value: string) => void; // Callback when the value changes
  placeholder?: string; // Placeholder text for the input
  className?: string; // Optional class names for the outer div
}

export function AutoComplete({
  options,
  value,
  onValueChange,
  placeholder = "",
  className,
}: AutoCompleteProps) {
  const [open, setOpen] = React.useState(false); // State to control the popover open/close
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value);

  // Effect to synchronize internal states with the external 'value' prop
  React.useEffect(() => {
    setSelectedValue(value);
    const currentLabel = options.find(option => option.value === value)?.label || "";
    if (currentLabel !== searchValue) {
      setSearchValue(currentLabel);
    }
  }, [value, options]);

  // Filter options based on the text currently in the searchValue.
  const filteredItems = React.useMemo(() => {
    if (!searchValue) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, options]);

  // Handles updates from the CommandInput
  const onSearchValueChange = React.useCallback((newSearchValue: string) => {
    setSearchValue(newSearchValue);
    setOpen(true); // Open the popover if there's input or if it was just focused
  }, []);

  // Handles selecting an item from the CommandList
  const onSelectItem = React.useCallback((currentValue: string) => {
    const selectedOption = options.find(
      (option) => option.value.toLowerCase() === currentValue.toLowerCase()
    );

    if (selectedOption) {
      setSelectedValue(selectedOption.value);
      onValueChange(selectedOption.value);
      setSearchValue(selectedOption.label);
    } else {
      onValueChange(searchValue);
    }
    setOpen(false);
  }, [options, searchValue, onValueChange]);

  // Handles blur event on the input field
  const onInputBlur = React.useCallback(() => {
      setOpen(false);
      const currentLabelOfSelected = options.find(opt => opt.value === selectedValue)?.label;
      if (searchValue !== currentLabelOfSelected && searchValue !== "") {
          onValueChange(searchValue);
      } else if (searchValue === "" && selectedValue !== "") {
          onValueChange("");
          setSelectedValue("");
      }
  }, [searchValue, selectedValue, options, onValueChange]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };


  return (
    <div className={cn("flex items-center", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandInput
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                    setOpen(false);
                } else if (e.key !== "Tab") {
                    setOpen(true);
                }
              }}
              onMouseDown={() => {
                setOpen((currentOpen) => !!searchValue || !currentOpen);
              }}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input
                onFocus={handleInputFocus}
                placeholder={placeholder}
                className="w-full h-auto rounded-none pr-2 py-0 text-xs text-gray-800 bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </CommandInput>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList className="border-1 rounded-md font-xs">
                <CommandGroup>
                  {filteredItems.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                      className="text-xs"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
