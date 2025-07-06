export type Vitals = {
    field: string;
    [key: string]: string;
};

export const getInitialDynamicHours = () => {
        const currHour = new Date().getHours()
        return Array.from({length: 8}, (_, index) => {
            return `${(currHour + index).toString().padStart(2, "0")}00`
        }); 
    };

const vitalsTemplate: {field: string}[] = [
    { field: "HR" },
    { field: "HR Source"},
    { field: "BP"},
    { field: "BP Source"},
    { field: "RR"},
    { field: "Temp"},
    { field: "Temp Source"},
    { field: "SpO2"},
];

export const generateInitialVitalsData = (dynamicTimeColumns: string[]): Vitals[] => {
    const generatedData: Vitals[] = []

    const vitalsLabelRow: Vitals = {field: "Vital Signs"};
    dynamicTimeColumns.forEach(hour => {
        vitalsLabelRow[hour] = ''        
    });
    generatedData.push(vitalsLabelRow)

    vitalsTemplate.map(row => {
        const newRow: Vitals = {...row}
        dynamicTimeColumns.forEach(hour =>
            newRow[hour] = ''
        );
        generatedData.push(newRow)
    });
    return generatedData
};
