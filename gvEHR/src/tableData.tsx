export interface AutocompleteOptions {
    value: string;
    label: string;
};

export interface Vitals {
    field: string;
    componentType: string;
    rowType?: string;
    autocompleteOptions?: AutocompleteOptions[];
    normalRange?: {low: number, high: number},
    hideable?: boolean,
    hideableId?: string,
    assessmentSubsets?: { value: string, label: string }[];
    [key: string]: any;

};

const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}${minutes}`;
};

const predefinedVitalsData: { [field: string]: { [time: number]: string } } = {
    "HR" : {90: "112", 60: "88"},
    "HR Source": {90: "Monitor", 60: "Radial"},
    "BP": {90: "112/68", 60: "124/72"},
    "BP Source": {90: "Left upper arm", 60: "Left upper arm"},
    "RR": {90: "16", 60: "20"},
    "Temp": {90: "37.0", 60: "36.8"},
    "Temp Source": {90: "Oral", 60: "Oral"},
    "SpO2": {90: "99", 60: "98"},
}

const vitalsTemplate: Vitals[] = [
    { field: "Vital Signs",
      componentType: "static",
      rowType: "titleRow" 
    },
    { 
        field: "HR", 
        componentType: "input", 
        normalRange: {low: 60, high: 100 }},
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
        ],
    },
    { 
        field: "RR",
        componentType: "input",
        normalRange: {low: 12, high: 20}
    },
    { 
        field: "Temp",
        componentType: "input", 
        normalRange: { low: 36.6, high: 37.2}
    },
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
    { 
        field: "SpO2",
        componentType: "input", 
        normalRange: { low: 92, high: 100 }
    },
    { 
        field: "Respiratory",
        componentType: "static", 
        rowType: "titleRow" 
    },
    {
        field: "Respiratory Assessment", // Renamed for clarity, this is the row with the popover checkbox list
        componentType: "checkboxlist",
        // This array defines the options for the popover and links to hideableId
        assessmentSubsets: [
            { value: "WDL", label: "WDL" }, // WDL doesn't control other rows directly, it's just an option
            { value: "Lung Sounds", label: "Lung Sounds" },
            { value: "Cough", label: "Cough" },
            { value: "Effort/Expansion", label: "Effort/Expansion" },
            // ... more assessment subsets
        ]
    },
    // These are the rows that will be hidden/shown
    {
        field: "Lung Sounds",
        componentType: "autocomplete",
        autocompleteOptions: [
            { value: "Clear", label: "Clear" },
            { value: "Diminished", label: "Diminished" },
            { value: "Wheezes", label: "Wheezes" },
            { value: "Crackles", label: "Crackles" },
        ],
        hideable: true,
        hideableId: "Lung Sounds" // Matches the value from controlledSubsets
    },
    {
        field: "Cough",
        componentType: "input", // Or autocomplete, depending on expected input
        hideable: true,
        hideableId: "Cough" // Matches the value from controlledSubsets
    },
    {
        field: "Effort/Expansion",
        componentType: "input", // Or autocomplete
        hideable: true,
        hideableId: "Effort/Expansion" // Matches the value from controlledSubsets
    },
    { 
        field: "Cardiac",
        componentType: "static", 
        rowType: "titleRow" 
    },
    {
        field: "Cardiac Assessment", // Renamed for clarity, this is the row with the popover checkbox list
        componentType: "checkboxlist",
        // This array defines the options for the popover and links to hideableId
        assessmentSubsets: [
            { value: "WDL", label: "WDL" }, // WDL doesn't control other rows directly, it's just an option
            { value: "Heart Sounds", label: "Heart Sounds" },
        ]
    },
    {
        field: "Heart Sounds",
        componentType: "autocomplete",
        autocompleteOptions: [
            { value: "S1, S2", label: "S1, S2" },
            { value: "S3", label: "S3" },
            { value: "Murmur", label: "Murmur" },
        ],
        hideable: true,
        hideableId: "Heart Sounds" // Matches the value from controlledSubsets
    },
];

export const getInitialDynamicHours = (currHour: number) => {
        return Array.from({length: 8}, (_, index) => {
            const adjustedHour = (currHour + index) % 24
            return `${adjustedHour.toString().padStart(2, "0")}00`
        }); 
};

export const getPredefinedHoursMap = (currDate: Date) => {
    const predefinedTimesMap= new Map<string, number>();

    const allOffsetTimes = new Set<number>()
    Object.values(predefinedVitalsData).forEach(fieldData => {
        Object.keys(fieldData).forEach(minuteOffsetStr => {
            allOffsetTimes.add(parseInt(minuteOffsetStr))
        });
    });

    Array.from(allOffsetTimes).sort((a, b) => a - b).forEach(minutesOffset => {
        const tempDate = new Date(currDate)
        tempDate.setMinutes(currDate.getMinutes() - minutesOffset);
        const formattedTime = formatTime(tempDate)
        predefinedTimesMap.set(formattedTime, minutesOffset)
    });
            
    return predefinedTimesMap
};

export const getAllInitialHours = (): { allTimesColumns: string[], predefinedVitalsTimeMap: Map<string, number> } => {
    const currDate = new Date()
    const currHour = currDate.getHours()

    const dynamicTimes = getInitialDynamicHours(currHour);

    const predefinedVitalsTimeMap = getPredefinedHoursMap(currDate);
    const predefinedTimes = Array.from(predefinedVitalsTimeMap.keys())
    const combinedTimes = [... new Set([...dynamicTimes, ...predefinedTimes])];
    console.log(`Combined times: ${combinedTimes}` )
    return { 
        allTimesColumns: combinedTimes.sort(),
        predefinedVitalsTimeMap: predefinedVitalsTimeMap
    }
};

export const generateInitialVitalsData = (
    allTimesColumns: string[],
    staticTimesMap: Map<string,number>
): Vitals[] => {
    const generatedData: Vitals[] = []

    vitalsTemplate.forEach(templateRow => {
        const newRow: Vitals = {
            field: templateRow.field,
            componentType: templateRow.componentType,
            rowType: templateRow.rowType,
            ...(templateRow.autocompleteOptions && { autocompleteOptions: templateRow.autocompleteOptions }),
            ...(templateRow.normalRange && { normalRange: templateRow.normalRange }),
            ...(templateRow.hideable && { hideable: templateRow.hideable }),
            ...(templateRow.hideableId && { hideableId: templateRow.hideableId }),
            ...(templateRow.assessmentSubsets && { assessmentSubsets: templateRow.assessmentSubsets})

        };

        allTimesColumns.forEach(hour => {
            const correspondingMinuteOffset = staticTimesMap.get(hour)

            let predefinedValue: string | undefined

            if ( correspondingMinuteOffset !== undefined) {
                predefinedValue = predefinedVitalsData[templateRow.field]?.[correspondingMinuteOffset];
            } else {
                predefinedValue = ''
            }
            newRow[hour] = predefinedValue !== undefined ? predefinedValue : '';
        });
        generatedData.push(newRow)
    });
    return generatedData
};
