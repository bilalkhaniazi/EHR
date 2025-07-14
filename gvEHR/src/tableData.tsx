export interface chartingOptions {
    value: string;
    label: string;
};

export interface tableData {
    field: string;
    componentType: string;
    rowType?: string;
    chartingOptions?: chartingOptions[];
    wdlDescription?: {assessment: string, description: string }[];
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
      rowType: "titleRow",
      wdlDescription: [
        {assessment: "General Appeareance", description: "Patient appears their stated age, A&O × 4, no acute distress and is cooperative."},
        {assessment: "Safety", description: "call‑light within reach, bed lowest/locked, side‑rails appropriate, room clutter‑free, non-slip socks applied, personal belongings in reach, bed alarm on"}
    ] 
    },
    {
        field: "General Appearance", 
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        hideableId: "Safety Checks" 
    },
    { 
        field: "Psychosocial Assessment",
        componentType: "static",
        rowType: "titleRow",
        wdlDescription: [
            { 
                assessment: "Mood & Affect",
                description: "Appropriate, consistent with situation. Speech coherent, hygiene appropriate, denies suicidal/homicidal ideation."
            },
        ]

    },
    {
        field: "Pyschosocial Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
            { value: "Mood & Affect", label: "Mood & Affect" },
        ]
    },
    {
        field: "Mood & Affect",
        componentType: "input",
        hideable: true, 
        hideableId: "Mood & Affect"
    },
    { 
        field: "Vital Signs",
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Head & Scalp", description: "Normocephalic, no lesions or tenderness"},
            { assessment: "Eyes", description: "Conjunctivae pink, sclera white, pupils equal/reactive (PERRLA), follows light/objects"},
            { assessment: "Ears", description: "No drainage, gross hearing intact" },
            { assessment: "Nose", description: "Nares patent, no drainage, no deformities"},
            { assessment: "Mouth & Throat", description: "mucous membranes pink and moist, no lesions or odor, uvula midline"},
        ] 
    },
    {
        field: "HEENT Status", 
        componentType: "checkboxlist",
        assessmentSubsets: [ 
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow", 
        wdlDescription: [
            { assessment: "Orientation", description: "Alert and oriented × 4, follows commands."},
            { assessment: "Speech", description: "Speech clear and coherent."},
            { assessment: "Motor Function", description: "Gross motor functioning intact."}
    ] 
    },
    {
        field: "Neurological Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Skin", description: "Warm, dry, intact, uniform color appropriate for race, no rashes or swelling. No signs of inflammation, breakdown, or pressure injury" },
            { assessment: "Hair & Skin", description: "Normal distribution; nails smooth; no clubbing or abnormalities, cap refill < 2 seconds" },
            { assessment: "Turgor", description: "Brisk recoil."}
        ]
    },
    {
        field: "Integument Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Heart Sounds", description: "Regular rate (60-100 bpm) & rhythm, S1/S2 audible, no murmurs/rubs/gallops." },
            { assessment: "Extremities", description: "Pulses 2+ bilaterally (radial, dorsalis pedis), cap refill < 2 seconds, no edema, uniform color." },
            { assessment: "Jugular Distention", description: "No venous jugular distention."}
        ]
    },
    {
        field: "Cardiovascular Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Chest Appearance", description: "Chest expansion symmetric, respirations non-labored, regular rate, no accessory muscle use." },
            { assessment: "Lung Sounds", description: "Breath sounds clear bilaterally (anterior/posterior/lateral), no adventitious sounds (crackles, wheezes, rhonchi)." }
        ]
    },
    {
        field: "Respiratory Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
            { value: "Chest Appearance", label: "Chest Appearance" }, 
            { value: "Lung Sounds", label: "Lung Sounds" },
        ]
    },
    {
        field: "Chest Appearance",
        componentType: "input",
        hideable: true,
        hideableId: "Chest Appearance" 
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Abdomen", description: "Soft, non-tender, non-distended. No masses or guarding, no visible scars or lesions." },
            { assessment: "Bowel Sounds", description: "Present and active in all four quadrants." },
            { assessment: "Nausea", description: "No nausea, vomiting, or diarrhea."}
        ]
    },
    {
        field: "GI Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "ROM", description: "Full active and passive in all joints, strength 5/5 bilaterally." },
            { assessment: "Gait", description: "Gait steady, ambulates independently"}
        ]
    },
    {
        field: "Musculoskeletal Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        rowType: "titleRow",
        wdlDescription: [
            { assessment: "Voiding", description: "Without pain, burning, or urgency. No new incontinence."},
            { assessment: "Urine", description: "Clear, yellow, absent of odor."}
        ]
    },
    {
        field: "Genitourinary Status",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "WDL", label: "WDL" },
            { value: "WDL, except:", label: "WDL, except:" },
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
        field: "IV Assessment",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "IV Site",
        componentType: "input"
    },
    {
        field: "IV Type",
        componentType: "input"
    },
    {
        field: "IV Location",
        componentType: 'input'
    },
    {
        field: "Nursing Care",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Nursing Care Provided",
        componentType: "input"
    },
    {
        field: "Assessment Tools",
        componentType: "static",
        rowType: "titleRow"
    },
    {
        field: "Additional Tools",
        componentType: "checkboxlist",
        assessmentSubsets: [
            { value: "CIWA-Ar", label: "CIWA-Ar"},
            { value: "Morse Fall Risk", label: "Morse Fall Risk"},
            { value: "Braden Scale", label: "Braden Scale"}
        ]
    },
    {
        field: "CIWA-Ar",
        componentType: "static",
        rowType: "titleRow",
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Nausea & Vomiting", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No nausea or vomitting" },
            { value: "1", label: "1 - Mild nausea with no vomiting" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Intermittent nausea with no vomiting" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Constant nausea, frequent dry heaves and vomiting" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Tremor", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No tremor" },
            { value: "1", label: "1 - Not visible, but can be felt fingertip to fingertip" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Moderate, with patient's arms extended" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Severe, even with arms not extended" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Paroxysmal Sweats", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No sweat visible" },
            { value: "1", label: "1 - Barely perceptible sweating, palms moist" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Beads of sweat obvious on forehead" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Drenching sweats" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Anxiety", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No anxiety, at ease" },
            { value: "1", label: "1 - Mildly anxious" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Moderately anxious, or guarded, so anxiety is inferred" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Equivalent to acute panic states" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Agitation", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Normal activity" },
            { value: "1", label: "1 - Somewhat more than normal activity" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4  - Moderately fidgety and restless" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Paces back and forth during most of the interview, or constantly thrashes about" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Tactile Disturbances", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - None" },
            { value: "1", label: "1 - Very mild itching, pins and needles, burning, or numbness" },
            { value: "2", label: "2 - Mild itching, pins and needles, burning, or numbness" },
            { value: "3", label: "3 - Moderate itching, pins and needles, burning, or numbness" },
            { value: "4", label: "4 - Moderately severe hallucinations" },
            { value: "5", label: "5 - Severe hallucinations" },
            { value: "6", label: "6 - Extremely severe hallucinations" },
            { value: "7", label: "7 - Continuous hallucinations" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Visual Disturbances", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Not present" },
            { value: "1", label: "1 - Very mild sensitivity" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Moderately severe hallucinations" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Continuous hallucinations" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Headache", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Not Present" },
            { value: "1", label: "1 - Very mild" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 - Moderately severe" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7 - Extremely severe" }
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    { 
        field: "Orientation", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Oriented, can do serial additions" },
            { value: "1", label: "1 - Cannot do serial additions or is uncertain about date" },
            { value: "2", label: "2 - Disoriented for date by no more than 2 calendar days" },
            { value: "3", label: "3 - Disoriented for date by more than 2 calendar days" },
            { value: "4", label: "4 - Disoriented to place or person" },
        ],
        hideable: true,
        hideableId: "CIWA-Ar"
    },
    {
        field: "Morse Fall Risk",
        componentType: "static",
        rowType: "titleRow",
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    { 
        field: "History of Falling", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No falls" },
            { value: "25", label: "25 - Has fallen within 3 months" },
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    { 
        field: "Secondary Diagnosis", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No" },
            { value: "15", label: "15 - Yes" },
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    { 
        field: "Ambulatory Aid", 
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Bedrest/nurse assist" },
            { value: "15", label: "15 - Crutches/cane/walker" },
            { value: "25", label: "25 - Clutches furniture or support"}
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    {
        field: "IV Therapy/Heparin Lock",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - No" },
            { value: "20", label: "20 - Yes" },
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    {
        field: "Gait",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Normal/Bedrest/Wheelchair" },
            { value: "10", label: "10 - Weak" },
            { value: "20", label: "20 - Impaired" }
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    {
        field: "Mental Status",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "0", label: "0 - Oriented to own abilities" },
            { value: "15", label: "15 - Overestimates or forgets limitations" },
        ],
        hideable: true,
        hideableId: "Morse Fall Risk"
    },
    {
        field: "Braden Scale",
        componentType: "static",
        rowType: "titleRow",
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Sensory Perception",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Completely Limited" },
            { value: "2", label: "2 - Very Limited" },
            { value: "3", label: "3 - Slightly Limited" },
            { value: "4", label: "4 - No Impairment" },
        ],
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Moisture",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Constantly Moist" },
            { value: "2", label: "2 - Very Moist" },
            { value: "3", label: "3 - Occasionally Moist" },
            { value: "4", label: "4 - Rarely Moist" },
        ],
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Activity",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Bedfast" },
            { value: "2", label: "2 - Chairfast" },
            { value: "3", label: "3 - Walks Occasionally." },
            { value: "4", label: "4 - Walks Frequently" },
        ],
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Mobility",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Completely Immobile" },
            { value: "2", label: "2 - Very Limited" },
            { value: "3", label: "3 - Slightly Limited" },
            { value: "4", label: "4 - No Limitations" },
        ],
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Nutrition",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Very Poor" },
            { value: "2", label: "2 - Probably Inadequate" },
            { value: "3", label: "3 - Adequate" },
            { value: "4", label: "4 - Excellent" },
        ],
        hideable: true,
        hideableId: "Braden Scale"
    },
    {
        field: "Friction and Shear",
        componentType: "autocomplete",
        chartingOptions: [
            { value: "1", label: "1 - Problem" },
            { value: "2", label: "2 - Potential Problem" },
            { value: "3", label: "3 - No Apparent Problem" },
        ],
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
            ...(templateRow.assessmentSubsets && { assessmentSubsets: templateRow.assessmentSubsets}),
            ...(templateRow.wdlDescription && { wdlDescription: templateRow.wdlDescription })

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

interface AssessmentToolCategories {
    name: string,
    scoringOptions: {rating: string, description: string}[]
}

interface ScoreInterpretation {
    result: string
    range: string,
    description: string,
    action?: string
}

export interface AssessmentTool {
    name: string,
    categories: AssessmentToolCategories[],
    maxScore?: string,
    interpretations?: ScoreInterpretation[]
}


export const assessmentTools: AssessmentTool[] = [
    { 
        name: "CIWA-Ar",
        categories: [
            { 
                name: "Nausea & Vomitting",
                scoringOptions: [
                    { rating: "0", description: "No nausea or vomitting"},
                    { rating: "1", description: "Mild nausea with no vomiting"},
                    { rating: "4", description: "Intermittent nausea with no vomiting"},
                    { rating: "7", description: "Constant nausea, frequent dry heaves and vomiting"} 
                ]
            },
            { 
                name: "Tremor",
                scoringOptions: [
                    { rating: "0", description: "No tremor"},
                    { rating: "1", description: "Not visible, but can be felt fingertip to fingertip"},
                    { rating: "4", description: "Moderate, with patient's arms extended"},
                    { rating: "7", description: "Severe, even with arms not extended"} 
                ]
            },
            {
                name: "Paroxysmal Sweats",
                scoringOptions: [
                { rating: "0", description: "No sweat visible" },
                { rating: "1", description: "Barely perceptible sweating, palms moist" },
                { rating: "4", description: "Beads of sweat obvious on forehead" }, // Scores 2, 3, 5, 6 are often implied intermediate steps
                { rating: "7", description: "Drenching sweats" },
                ],
            },
            {
                name: "Anxiety",
                scoringOptions: [
                { rating: "0", description: "No anxiety, at ease" },
                { rating: "1", description: "Mildly anxious" },
                { rating: "4", description: "Moderately anxious, or guarded, so anxiety is inferred" }, // Scores 2, 3, 5, 6 are often implied intermediate steps
                { rating: "7", description: "Equivalent to acute panic states as seen in severe delirium or acute schizophrenic reactions" },
                ],
            },
            {
                name: "Agitation",
                scoringOptions: [
                { rating: "0", description: "Normal activity" },
                { rating: "1", description: "Somewhat more than normal activity" },
                { rating: "4", description: "Moderately fidgety and restless" }, // Scores 2, 3, 5, 6 are often implied intermediate steps
                { rating: "7", description: "Paces back and forth during most of the interview, or constantly thrashes about" },
                ],
            },
            {
                name: "Tactile Disturbances",
                scoringOptions: [
                { rating: "0", description: "None" },
                { rating: "1", description: "Very mild itching, pins and needles, burning, or numbness" },
                { rating: "2", description: "Mild itching, pins and needles, burning, or numbness" },
                { rating: "3", description: "Moderate itching, pins and needles, burning, or numbness" },
                { rating: "4", description: "Moderately severe hallucinations" },
                { rating: "5", description: "Severe hallucinations" },
                { rating: "6", description: "Extremely severe hallucinations" },
                { rating: "7", description: "Continuous hallucinations" },
                ],
            },
            {
                name: "Auditory Disturbances",
                scoringOptions: [
                { rating: "0", description: "Not present" },
                { rating: "1", description: "Very mild harshness or ability to frighten" },
                { rating: "2", description: "Mild harshness or ability to frighten" },
                { rating: "3", description: "Moderate harshness or ability to frighten" },
                { rating: "4", description: "Moderately severe hallucinations" },
                { rating: "5", description: "Severe hallucinations" },
                { rating: "6", description: "Extremely severe hallucinations" },
                { rating: "7", description: "Continuous hallucinations" },
                ],
            },
            {
                name: "Visual Disturbances",
                scoringOptions: [
                { rating: "0", description: "Not present" },
                { rating: "1", description: "Very mild sensitivity" },
                { rating: "2", description: "Mild sensitivity" },
                { rating: "3", description: "Moderate sensitivity" },
                { rating: "4", description: "Moderately severe hallucinations" },
                { rating: "5", description: "Severe hallucinations" },
                { rating: "6", description: "Extremely severe hallucinations" },
                { rating: "7", description: "Continuous hallucinations" },
                ],
            },
            {
                name: "Headache, Fullness in Head",
                scoringOptions: [
                { rating: "0", description: "Not Present" },
                { rating: "1", description: "Very mild" },
                { rating: "2", description: "Mild" },
                { rating: "3", description: "Moderate" },
                { rating: "4", description: "Moderately severe" },
                { rating: "5", description: "Severe" },
                { rating: "6", description: "Very severe" },
                { rating: "7", description: "Extremely severe" },
                ],
            },
            {
                name: "Orientation and Clouding of Sensorium",
                scoringOptions: [
                { rating: "0", description: "Oriented, can do serial additions" },
                { rating: "1", description: "Cannot do serial additions or is uncertain about date" },
                { rating: "2", description: "Disoriented for date by no more than 2 calendar days" },
                { rating: "3", description: "Disoriented for date by more than 2 calendar days" },
                { rating: "4", description: "Disoriented to place or person" },
                ],
            },
            ],
        maxScore: "67",
        interpretations: [
            { result: "Mild", range: "0-9", description: "Minimal symptoms" },
            { result: "Moderate", range: "10-15", description: "Moderate symptoms" },
            { result: "Severe", range: "16+", description: "Severe symptoms requiring medical attention" }
        ]
    },
    { 
        name: "Morse Fall Risk",
        categories: [
            { 
                name: "History of Falling",
                scoringOptions: [
                    { rating: "0", description: "No falls"},
                    { rating: "25", description: "Has fallen in past 3 months."}
                ]
            },
            { 
                name: "Secondary Diagnosis",
                scoringOptions: [
                    { rating: "0", description: "Yes"},
                    { rating: "15", description: "No"}
                ]
            },
            { 
                name: "Ambulatory Aid",
                scoringOptions: [
                    { rating: "0", description: "Bed rest/nurse assist"},
                    { rating: "15", description: "Crutches/cane/walker"},
                    { rating: "25", description: "Clutches furniture or support"}
                ]
            },
            { 
                name: "IV Inserted",
                scoringOptions: [
                    { rating: "0", description: "Yes"},
                    { rating: "20", description: "No"}
                ]
            },
            { 
                name: "Gait/Transferring",
                scoringOptions: [
                    { rating: "0", description: "Normal/bedrest/immobile"},
                    { rating: "10", description: "Weak"},
                    { rating: "20", description: "Impaired"}
                ]
            },
            { 
                name: "Mental Status",
                scoringOptions: [
                    { rating: "0", description: "Oriented to own ability"},
                    { rating: "15", description: "Forgets limitations"}
                ]
            }
        ],
        interpretations: [
            { result: "No Risk", range: "0-24", description: "Minimal symptoms" },
            { result: "Low Risk", range: "25-50", description: "Moderate symptoms" },
            { result: "High Risk", range: "≥51", description: "Severe symptoms requiring medical attention" }
        ]
    },
    {
        name: "Braden Scale",
        categories: [
            {
                name: "Sensory Perception",
                scoringOptions: [
                    { rating: "1", description: "Completely Limited: Unresponsive to painful stimuli; limited ability to feel pain over most of body." },
                    { rating: "2", description: "Very Limited: Responds only to painful stimuli; cannot communicate discomfort except by moaning/restlessness; sensory impairment over half of body." },
                    { rating: "3", description: "Slightly Limited: Responds to verbal commands but cannot always communicate discomfort or need to be turned; sensory impairment in 1 or 2 extremities." },
                    { rating: "4", description: "No Impairment: Responds to verbal commands; no sensory deficit limiting ability to feel or voice pain/discomfort." },
                ],
            },
            {
                name: "Moisture",
                scoringOptions: [
                    { rating: "1", description: "Constantly Moist: Skin kept moist almost constantly by perspiration, urine, etc.; dampness detected every time patient is moved or turned." },
                    { rating: "2", description: "Very Moist: Skin is often, but not always, moist; linen must be changed at least once a shift." },
                    { rating: "3", description: "Occasionally Moist: Skin is occasionally moist, requiring an extra linen change approximately once a day." },
                    { rating: "4", description: "Rarely Moist: Skin is usually dry; linen only requires changing at routine intervals." },
                ],
            },
            {
                name: "Activity",
                scoringOptions: [
                    { rating: "1", description: "Bedfast: Confined to bed." },
                    { rating: "2", description: "Chairfast: Ability to walk severely limited or non-existent; cannot bear own weight and/or must be assisted into chair/wheelchair." },
                    { rating: "3", description: "Walks Occasionally: Walks occasionally during day, but for very short distances, with or without assistance; spends majority of each shift in bed or chair." },
                    { rating: "4", description: "Walks Frequently: Walks outside the room at least twice a day and inside room at least once every 2 hours during waking hours." },
                ],
            },
            {
                name: "Mobility",
                scoringOptions: [
                    { rating: "1", description: "Completely Immobile: Does not make even slight changes in body or extremity position without assistance." },
                    { rating: "2", description: "Very Limited: Makes occasional slight changes in body or extremity position but unable to make frequent or significant changes independently." },
                    { rating: "3", description: "Slightly Limited: Makes frequent though slight changes in body or extremity position independently." },
                    { rating: "4", description: "No Limitations: Makes major and frequent changes in position without assistance." },
                ],
            },
            {
                name: "Nutrition",
                scoringOptions: [
                    { rating: "1", description: "Very Poor: Never eats a complete meal; rarely eats more than 1/3 of any food offered; eats 2 servings or less of protein per day; takes fluids poorly; does not take a liquid dietary supplement; OR is NPO and/or maintained on clear liquids or IVs for more than 5 days." },
                    { rating: "2", description: "Probably Inadequate: Rarely eats a complete meal and generally eats only about 1/2 of any food offered; protein intake includes only 3 servings of meat or dairy products per day; occasionally will take a dietary supplement; OR receives less than optimum amount of liquid diet or tube feeding." },
                    { rating: "3", description: "Adequate: Eats over half of most meals; eats a total of 4 servings of protein each day; occasionally will refuse a meal, but will usually take a supplement if offered; OR is on a tube feeding or TPN regimen which probably meets most of nutritional needs." },
                    { rating: "4", description: "Excellent: Eats most of every meal; never refuses a meal; usually eats a total of 4 or more servings of protein per day; occasionally eats between meals; does not require supplementation." },
                ],
            },
            {
                name: "Friction and Shear",
                scoringOptions: [
                    { rating: "1", description: "Problem: Requires moderate to maximum assistance in moving; complete lifting without sliding against sheets is impossible; frequently slides down in bed or chair, requiring frequent repositioning with maximum assistance; spasticity, contractures, or agitation lead to almost constant friction." },
                    { rating: "2", description: "Potential Problem: Moves feebly or requires minimum assistance; during a move, skin probably slides to some extent against sheets, chair, restraints, or other devices; maintains relatively good position in chair or bed most of the time but occasionally slides down." },
                    { rating: "3", description: "No Apparent Problem: Moves in bed and in chair independently and has sufficient muscle strength to lift up completely during move; maintains good position in bed or chair at all times." },
                ],
            },
        ],
        maxScore: "23", // Max score for Braden Scale is 23
        interpretations: [
            { result: "No Risk", range: "19-23", description: "Patients are unlikely to develop skin breakdown." },
            { result: "Mild Risk", range: "15-18", description: "Patients demonstrate some risk factors for developing bedsores." },
            { result: "Moderate Risk", range: "13-14", description: "Extra attention should be given; consider environmental safety and balance exercises." },
            { result: "High Risk", range: "10-12", description: "Requires additional equipment and frequent repositioning." },
            { result: "Severe Risk", range: "6-9", description: "At very high risk for skin breakdown; frequent monitoring is essential." },
        ]
    } 
];