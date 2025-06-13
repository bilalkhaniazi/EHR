interface RhythmOption {
    value: string;
    label: string;
}

interface CardiacRhythmDropdownProps {
    // The currently selected value (controlled component)
    selectedValue: string;
    // Callback function when an option is selected
    onSelect: (value: string) => void;
        // Optional: Placeholder text (note: native select doesn't support a true "placeholder" option
        // that's not selectable, but we can add a "Select..." option with an empty value)
    placeholder?: string;
}

const CardiacRhythmDropdown: React.FC<CardiacRhythmDropdownProps> = ({
    selectedValue,
    onSelect,
    placeholder = 'Select Cardiac Rhythm',
    }) => {
    const rhythms: RhythmOption[] = [
        { value: '', label: placeholder }, // Add placeholder as the first selectable option
        { value: 'NSR', label: 'Normal Sinus Rhythm (NSR)' },
        { value: 'ST', label: 'Sinus Tachycardia (ST)' },
        { value: 'SB', label: 'Sinus Bradycardia (SB)' },
        { value: 'AFib', label: 'Atrial Fibrillation (AFib)' },
        { value: 'AFlutter', label: 'Atrial Flutter' },
        { value: 'SVT', label: 'Supraventricular Tachycardia (SVT)' },
        { value: 'VT', label: 'Ventricular Tachycardia (VT)' },
        { value: 'VFib', label: 'Ventricular Fibrillation (VFib)' },
        { value: 'Asystole', label: 'Asystole' },
        { value: 'PEA', label: 'Pulseless Electrical Activity (PEA)' },
        { value: 'HeartBlock1', label: '1st Degree Heart Block' },
        { value: 'HeartBlock2M1', label: '2nd Degree Type I (Wenckebach)' },
        { value: 'HeartBlock2M2', label: '2nd Degree Type II' },
        { value: 'HeartBlock3', label: '3rd Degree Heart Block' },
    ];

    // Function to handle option selection directly from the native select onChange
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value);
    };

    return (
        <div className="relative w-full">
        <select
            id="cardiacRhythmSelect" // Provide an ID for potential labeling
            value={selectedValue}
            onChange={handleChange}
            className="
            block w-full
            px-2 py-1.5 bg-white
            border border-neutral-400 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:border-blue-400
            text-xs
            appearance-none {/* Removes default OS styling for arrow */}
            pr-8 {/* Space for custom arrow */}
            transition-all duration-300 ease-in-out
            "
        >
            {rhythms.map((rhythm) => (
            <option
                key={rhythm.value}
                value={rhythm.value}
                // Disable the placeholder option if it's the first one and has an empty value
                disabled={rhythm.value === '' && rhythm.label === placeholder}
            >
                {rhythm.label}
            </option>
            ))}
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

export default CardiacRhythmDropdown