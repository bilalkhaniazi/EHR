interface dropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    // The currently selected value (controlled component)
    selectedValue: string;
    // Callback function when an option is selected
    onSelect: (value: string) => void;
        // Optional: Placeholder text (note: native select doesn't support a true "placeholder" option
        // that's not selectable, but we can add a "Select..." option with an empty value)
    dropDownContents: Array<dropdownOption> ;
}

const Dropdown: React.FC<DropdownProps> = ({
    selectedValue,
    onSelect,
    dropDownContents
    }) => {
    const dropdownOptions: dropdownOption[] = dropDownContents

    // Function to handle option selection directly from the native select onChange
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value);
    };

    return (
        <div className="relative w-full">
            <select
                id="medRhythmSelect" // Provide an ID for potential labeling
                value={selectedValue}
                onChange={handleChange}
                className="
                block w-full
                px-2 py-1.5 bg-white
                border border-neutral-400 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:border-blue-400
                text-sm
                appearance-none {/* Removes default OS styling for arrow */}
                pr-8 {/* Space for custom arrow */}
                transition-all duration-300 ease-in-out
                "
            >
                {dropDownContents ? (
                    dropdownOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                    ))
                ) : (
                    <option key="no-options" value="e" disabled>Failed to load options</option>
                )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
                </svg>
            </div>
        </div>
    );
};

export default Dropdown