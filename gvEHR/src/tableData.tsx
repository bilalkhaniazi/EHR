export type Vitals = {
    field: string; // e.g., "HR", "BP", "HR Source", "BP Source"
    "0800": string;
    "1200": string;
    "1600": string;
    "2000": string;
};

export const initialVitalsData: Vitals[] = [
    { field: "HR", "0800": "78", "1200": "82", "1600": "74", "2000": '84' },
    { field: "HR Source", "0800": "Radial", "1200": "Monitor", "1600": "Monitor", "2000": 'Monitor' },
    { field: "BP", "0800": "118/76", "1200": "120/80", "1600": "116/74", "2000": '' },
    { field: "BP Source", "0800": "Left upper arm", "1200": "Right upper arm", "1600": "Right upper arm", "2000": 'Right lower arm' },
    { field: "RR", "0800": "16", "1200": "18", "1600": "15", "2000": "17" },
    { field: "Temp", "0800": "98.6", "1200": "99.1", "1600": "98.4", "2000": "98.8" },
    { field: "SpO2", "0800": "97", "1200": "98", "1600": "96", "2000": "95" },
];
