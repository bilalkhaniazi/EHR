export interface chartingOptions {
    value: string;
    label: string;
};

export interface tableData {
    field: string;
    componentType: string;
    rowType?: string;
    chartingOptions?: chartingOptions[];
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
    "Lung Sounds" : {90: "Clear"}
}

const vitalsTemplate: tableData[] = [
    { field: "General Appearance",
      componentType: "static",
      rowType: "titleRow" 
    },
    {
        field: "General Appearance", 
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Appearance", label: "Appearance" },
            { value: "Safety Checks", label: "Safety Checks" },
        ]
    },
    { 
        field: "Appearance", 
        componentType: "input", 
        hideable: true,
        hideableId: "Appearance" // matches with assessmentSubsets's value above
    },
    { 
        field: "Safety Check", 
        componentType: "input",
        hideable: true,
        hideableId: "Appearance" 
    },
    { field: "Vital Signs",
      componentType: "static",
      rowType: "titleRow" 
    },
    { 
        field: "HR", 
        componentType: "input", 
        normalRange: {low: 60, high: 100 }
    },
    { 
        field: "HR Source", 
        componentType: "autocomplete",
        chartingOptions: [
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
        chartingOptions: [
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
        chartingOptions: [
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
        normalRange: { low: 95, high: 100 }
    },
    { 
        field: "Pain",
        componentType: "input", 
    },
    { 
        field: "Weight (kg)",
        componentType: "input", 
    },
    { 
        field: "HEENT Assessment",
        componentType: "static", 
        rowType: "titleRow" 
    },
    {
        field: "HEENT Status", 
        componentType: "checkboxlist",
        assessmentSubsets: [ 
            { value: "WDL", label: "WDL" },
            { value: "Head & Scalp", label: "Head & Scalp" },
            { value: "Eyes", label: "Eyes" },
            { value: "Ears", label: "Ears" },
            { value: "Nose", label: "Nose" },
            { value: "Mouth & Throat", label: "Mouth & Throat" },
        ]
    },
    {
        field: "Head & Scalp", 
        componentType: "input",
        hideable: true,
        hideableId: "Head & Scalp"
    },
    {
        field: "Eyes", 
        componentType: "input",
        hideable: true,
        hideableId: "Eyes"
    },
    {
        field: "Ears", 
        componentType: "input",
        hideable: true,
        hideableId: "Ears"
    },
    {
        field: "Nose", 
        componentType: "input",
        hideable: true,
        hideableId: "Nose"
    },
    {
        field: "Mouth & Throat", 
        componentType: "input",
        hideable: true,
        hideableId: "Mouth & Throat"
    },
    {
        field: "Neurological Assessment",
        componentType: "static",
        rowType: "titleRow" 
    },
    {
        field: "Neurological Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Orientation", label: "Orientation" }, 
            { value: "Speech", label: "Speech" },
            { value: "Motor Function", label: "Motor Function"}
        ]
    },
    {
        field: "Orientation", 
        componentType: "input",
        hideable: true,
        hideableId: "Orientation"
    },
    {
        field: "Speech", 
        componentType: "input",
        hideable: true,
        hideableId: "Speech"
    },
    {
        field: "Motor Function", 
        componentType: "input",
        hideable: true,
        hideableId: "Motor Function"
    },
    {
        field: "Integumentary Assessment",
        componentType: "static",
        rowType: "titleRow" 
    },
    {
        field: "Integument Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Skin", label: "Skin" }, 
            { value: "Hair & Nails", label: "Hair & Nails" },
            { value: "Turgor", label: "Turgor"},
            { value: "Wound", label: "Wound" }
        ]
    },
    {
        field: "Skin",
        componentType: "input",
        hideable: true,
        hideableId: "Skin" 
    },
    {
        field: "Hair & Nails",
        componentType: "input",
        hideable: true,
        hideableId: "Hair & Nails" 
    },
    {
        field: "Turgor",
        componentType: "input",
        hideable: true,
        hideableId: "Turgor" 
    },
    {
        field: "Wound",
        componentType: "input",
        hideable: true,
        hideableId: "Wound" 
    },
    {
        field: "Cardiovascular Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Cardiovascular Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Heart sounds", label: "Heart Sounds" }, 
            { value: "Extremities", label: "Extremities" },
            { value: "Jugular Distention", label: "Jugular Distention"},
        ]
    },
    {
        field: "Heart sounds",
        componentType: "input",
        hideable: true,
        hideableId: "Heart sounds" 
    },
    {
        field: "Extremities",
        componentType: "input",
        hideable: true,
        hideableId: "Extremities" 
    },
    {
        field: "Jugular Distention",
        componentType: "input",
        hideable: true,
        hideableId: "Jugular Distention" 
    },
    {
        field: "Respiratory Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Respiratory Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Appearance", label: "Appearance" }, 
            { value: "Lung Sounds", label: "Lung Sounds" },
        ]
    },
    {
        field: "Appearance",
        componentType: "input",
        hideable: true,
        hideableId: "Appearance" 
    },
    {
        field: "Lung Sounds",
        componentType: "input",
        hideable: true,
        hideableId: "Lung Sounds" 
    },
    {
        field: "GI Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "GI Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "Abdomen", label: "Abdomen" }, 
            { value: "Bowel Sounds", label: "Bowel Sounds" },
            { value: "Nausea", label: "Bowel Sounds"}
        ]
    },
    {
        field: "Abdomen",
        componentType: "input",
        hideable: true,
        hideableId: "Abdomen" 
    },
    {
        field: "Bowel Sounds",
        componentType: "input",
        hideable: true,
        hideableId: "Bowel Sounds" 
    },
    {
        field: "Nausea",
        componentType: "input",
        hideable: true,
        hideableId: "Nausea" 
    },
    {
        field: "Musculoskeletal Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Musculoskeletal Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "Extremity ROM", label: "Extremity ROM" },
            { value: "Gait", label: "Gait" }, 
        ]
    },
    {
        field: "Extremity ROM",
        componentType: "input",
        hideable: true,
        hideableId: "Extremity ROM" 
    },
    {
        field: "Gait",
        componentType: "input",
        hideable: true,
        hideableId: "Gait" 
    },
    {
        field: "Genitourinary Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Genitourinary Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "Voiding", label: "Voiding" },
            { value: "Urine", label: "Urine" }, 
        ]
    },
    {
        field: "Voiding",
        componentType: "input",
        hideable: true,
        hideableId: "Voiding" 
    },
    {
        field: "Urine",
        componentType: "input",
        hideable: true,
        hideableId: "Urine" 
    },
    {
        field: "Additional Assessment Tools",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Tools",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "CIWA-AR", label: "CIWA-AR" },
            { value: "Braden Scale", label: "Braden Scale" }, 
        ]
    },
    {
        field: "CIWA-AR",
        componentType: "input",
        hideable: true,
        hideableId: "CIWA-AR" 
    },
    {
        field: "Braden Scale",
        componentType: "input",
        hideable: true,
        hideableId: "Braden Scale" 
    },
    
];

export const getInitialDynamicHours = (currHour: number) => {
        return Array.from({length: 2}, (_, index) => {
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
    console.warn("generateInitialVitalsData called")

    return { 
        allTimesColumns: combinedTimes.sort(),
        predefinedVitalsTimeMap: predefinedVitalsTimeMap
    }
};

export const generateInitialVitalsData = (
    allTimesColumns: string[],
    staticTimesMap: Map<string,number>
): tableData[] => {
    const generatedData: tableData[] = []

    vitalsTemplate.forEach(templateRow => {
        const newRow: tableData = {
            field: templateRow.field,
            componentType: templateRow.componentType,
            rowType: templateRow.rowType,
            ...(templateRow.chartingOptions && { chartingOptions: templateRow.chartingOptions }),
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
    console.warn("generateInitialVitalsData called")
    return generatedData
};
