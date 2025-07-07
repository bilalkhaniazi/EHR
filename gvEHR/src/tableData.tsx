export type AutocompleteOptions = {
    value: string;
    label: string;
};

export type Vitals = {
    field: string;
    componentType: string;
    autocompleteOptions?: AutocompleteOptions[];
    [key: string]: string | AutocompleteOptions[] | undefined;
};

export const getInitialDynamicHours = () => {
        const currHour = new Date().getHours()
        return Array.from({length: 8}, (_, index) => {
            return `${(currHour + index).toString().padStart(2, "0")}00`
        }); 
};

export const getAllInitialHours = (): string[] => {
    const dynamicHours = getInitialDynamicHours();
    const staticTimes = new Set<string>();
    Object.values(staticVitalsData).forEach(timeData => {
        Object.keys(timeData).forEach(time => staticTimes.add(time));
    });
    const combinedTimes = [... new Set([...dynamicHours, ...Array.from(staticTimes)])];
    return combinedTimes.sort()
}

const staticVitalsData: { [field: string]: { [time: string]: string } } = {
    "HR" : {"0715": "82", "0745": "88"},
    "HR Source": {"0715": "Monitor", "0745": "Radial"},
    "BP": {"0715": "83", "0745": "88"},
    "BP Source": {"0715": "86", "0745": "88"},
    "RR": {"0715": "87", "0745": "88"},
    "Temp": {"0715": "88", "0745": "88"},
    "Temp Source": {"0715": "89", "0745": "88"},
    "SpO2": {"0715": "90", "0745": "88"},
}

const vitalsTemplate: {
    field: string;
    componentType: "input" | "autocomplete" | "static";
    autocompleteOptions?: AutocompleteOptions[];
}[] = [
    { field: "Vital Signs", componentType: "static" },
    { field: "HR", componentType: "input" },
    { 
        field: "HR Source", 
        componentType: "autocomplete",
        autocompleteOptions: [
            { value: "Apical", label: "Apical" },
            { value: "Brachial", label: "Brachial" },
            { value: "Dorsalis pedis", label: "Dorsalis pedis" },
            { value: "Femoral", label: "Femoral" },
            { value: "Monitor", label: "Monitor" },
            { value: "Popliteal", label: "Popliteal" },
            { value: "Radial", label: "Radial" },
        ]
    },
    { field: "BP", componentType: "input"},
    { 
        field: "BP Source", 
        componentType: "autocomplete",
        autocompleteOptions: [
            { value: "Left upper arm", label: "Left upper arm" },
            { value: "Right upper arm", label: "Right upper arm" },
            { value: "Left lower arm", label: "Left lower arm" },
            { value: "Right lower arm", label: "Right lower arm" },
            { value: "Left thigh", label: "Left thigh" },
            { value: "Right thigh", label: "Right thigh" },
            { value: "Left lower leg", label: "Left lower leg" },
            { value: "Right lower leg", label: "Right lower leg" },
            { value: "Arterial line", label: "Arterial line" },
            { value: "Other", label: "Other" },
        ]
    },
    { field: "RR", componentType: "input"},
    { field: "Temp", componentType: "input"},
    { 
        field: "Temp Source", 
        componentType: "autocomplete",
        autocompleteOptions: [
            { value: "Oral", label: "Oral" },
            { value: "Axillary", label: "Axillary" },
            { value: "Rectal", label: "Rectal" },
            { value: "Tympanic", label: "Tympanic" },
            { value: "Temporal", label: "Temporal" },
            { value: "Bladder", label: "Bladder" },
            { value: "Other", label: "Other" },
        ]
    },
    { field: "SpO2", componentType: "input" },
];

export const generateInitialVitalsData = (allTimesColumns: string[]): Vitals[] => {
    const generatedData: Vitals[] = []

    vitalsTemplate.forEach(templateRow => {
        const newRow: Vitals = {
            field: templateRow.field,
            componentType: templateRow.componentType,
            ...(templateRow.autocompleteOptions && { autocompleteOptions: templateRow.autocompleteOptions })
        };

        allTimesColumns.forEach(hour => {
            const predefinedValue = staticVitalsData[templateRow.field]?.[hour];

            newRow[hour] = predefinedValue !== undefined ? predefinedValue : '';
        });
        generatedData.push(newRow)
    });
    return generatedData
};
