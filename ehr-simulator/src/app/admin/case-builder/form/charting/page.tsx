'use client'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, Column } from "@tanstack/react-table";
import { useMemo, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
// import { Skeleton } from "@/components/ui/skeleton";
import { AddLabColumn } from "../labs/components/addLabCol";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { FlexSheetData } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData";
import { Clipboard } from "lucide-react";
import { TableAssessmentSelectCell, TableInputCell } from "./components/tableInputCell";


const chartingDataTemplate: FlexSheetData[] = [

  {
    id: "vitalSignsTitle",
    field: "Vital Signs",
    componentType: "static",
    rowType: "titleRow"
  },
  {
    id: "hrInput",
    field: "HR",
    componentType: "input",
    normalRange: { low: 60, high: 100 }
  },
  {
    id: "hrSourceSelect",
    field: "HR Source",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "Apical", label: "Apical" },
      { subsetId: "Brachial", label: "Brachial" },
      { subsetId: "Dorsalis pedis", label: "Dorsalis pedis" },
      { subsetId: "Femoral", label: "Femoral" },
      { subsetId: "Monitor", label: "Monitor" },
      { subsetId: "Popliteal", label: "Popliteal" },
      { subsetId: "Radial", label: "Radial" },
    ]
  },
  {
    id: "bpInput",
    field: "BP",
    componentType: "input"
  },
  {
    id: "bpSourceSelect",
    field: "BP Source",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "Left upper arm", label: "Left upper arm" },
      { subsetId: "Right upper arm", label: "Right upper arm" },
      { subsetId: "Left lower arm", label: "Left lower arm" },
      { subsetId: "Right lower arm", label: "Right lower arm" },
      { subsetId: "Left thigh", label: "Left thigh" },
      { subsetId: "Right thigh", label: "Right thigh" },
      { subsetId: "Left lower leg", label: "Left lower leg" },
      { subsetId: "Right lower leg", label: "Right lower leg" },
      { subsetId: "Arterial line", label: "Arterial line" },
      { subsetId: "Other", label: "Other" },
    ],
  },
  {
    id: "rrInput",
    field: "RR",
    componentType: "input",
    normalRange: { low: 12, high: 20 }
  },
  {
    id: "tempInput",
    field: "Temp",
    componentType: "input",
    normalRange: { low: 36.6, high: 37.2 }
  },
  {
    id: "tempSourceSelect",
    field: "Temp Source",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "Oral", label: "Oral" },
      { subsetId: "Axillary", label: "Axillary" },
      { subsetId: "Rectal", label: "Rectal" },
      { subsetId: "Tympanic", label: "Tympanic" },
      { subsetId: "Temporal", label: "Temporal" },
      { subsetId: "Bladder", label: "Bladder" },
      { subsetId: "Other", label: "Other" },
    ]
  },
  {
    id: "spo2Input",
    field: "SpO2",
    componentType: "input",
    normalRange: { low: 95, high: 100 }
  },
  {
    id: "painInput",
    field: "Pain",
    componentType: "input",
  },
  {
    id: "weightKgInput",
    field: "Weight (kg)",
    componentType: "input",
  },
  {
    id: "intakeTitle",
    field: "Intake",
    componentType: "static",
    rowType: "titleRow",
  },
  {
    id: "intakeCheckbox",
    field: "Intake Fields",
    componentType: "checkboxlist",
    // assessmentSubsets: [
    //   { subsetId: "Oral", label: "Oral" },
    //   { subsetId: "Intravenous", label: "Intravenous" },
    //   { subsetId: "Parenteral Nutrition", label: "Parenteral Nutrition" },
    //   { subsetId: "Enteral Nutrition", label: "Enteral Nutrition" },
    // ]
  },
  {
    id: "oralIntake",
    field: "Oral",
    componentType: "input",
    // hideable: true,
    // hideableId: "Oral",
  },
  {
    id: "ivIntakeInput",
    field: "Intravenous",
    componentType: "input",
    // hideable: true,
    // hideableId: "Intravenous",

  },
  {
    id: "enteralNutritionInput",
    field: "Enteral Nutrition",
    componentType: "input",
    // hideable: true,
    // hideableId: "Enteral Nutrition",
  },
  {
    id: "parenteralNutritionInput",
    field: "Parenteral Nutrition",
    componentType: "input",
    // hideable: true,
    // hideableId: "Parenteral Nutrition",
  },
  {
    id: "outputTitle",
    field: "Output",
    componentType: "static",
    rowType: "titleRow",
  },
  {
    id: "outputCheckbox",
    field: "Output Fields",
    componentType: "checkboxlist",
    // assessmentSubsets: [
    //   { subsetId: "ioUrine", label: "Urine" },
    //   { subsetId: "ioEmesis", label: "Emesis" },
    //   { subsetId: "ioStool", label: "Stool" },
    //   { subsetId: "Wound Drainage", label: "Wound Drainage" },
    //   { subsetId: "Enteral Output", label: "Enteral Output" },
    // ]
  },
  {
    id: "urineInput",
    field: "Urine",
    componentType: "input",
    // hideable: true,
    // hideableId: "ioUrine"
  },
  {
    id: "emesisInput",
    field: "Emesis",
    componentType: "input",
    // hideable: true,
    // hideableId: "ioEmesis"
  },
  {
    id: "stoolInputt",
    field: "Stool",
    componentType: "input",
    // hideable: true,
    // hideableId: "ioStool"
  },
  {
    id: "woundDrainageInput",
    field: "Wound Drainage",
    componentType: "input",
    // hideable: true,
    // hideableId: "Wound Drainage"
  },
  {
    id: "enteralDrainageInput",
    field: "Enteral Output",
    componentType: "input",
    // hideable: true,
    // hideableId: "Enteral Output"
  },
  {
    id: "generalAppearanceTitle",
    field: "General Appearance",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "General Appeareance", description: "Patient appears their stated age, A&O × 4, no acute distress and is cooperative." },
      { assessment: "Safety", description: "call-light within reach, bed lowest/locked, side‑rails appropriate, room clutter‑free, non-slip socks applied, personal belongings in reach, bed alarm on" }
    ]
  },
  {
    id: "generalAppearanceCheckbox",
    field: "General Appearance",
    componentType: "checkboxlist",
    // assessmentSubsets: [
    //   { subsetId: "WDL", label: "WDL" },
    //   { subsetId: "WDL, except:", label: "WDL, except:" },
    //   { subsetId: "Appearance", label: "Appearance" },
    //   { subsetId: "Safety Checks", label: "Safety Checks" },
    // ]
  },
  {
    id: "appearanceInput",
    field: "Appearance",
    componentType: "input",
    // hideable: true,
    // hideableId: "Appearance"
  },
  {
    id: "safetyCheckInput",
    field: "Safety Check",
    componentType: "input",
    // hideable: true,
    // hideableId: "Safety Checks"
  },
  {
    id: "psychosocialAssessmentTitle",
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
    id: "moodAffectInput",
    field: "Mood & Affect",
    componentType: "input",
    // hideable: true,
    // hideableId: "Mood & Affect"
  },
  {
    id: "heentAssessmentTitle",
    field: "HEENT Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Head & Scalp", description: "Normocephalic, no lesions or tenderness" },
      { assessment: "Eyes", description: "Conjunctivae pink, sclera white, pupils equal/reactive (PERRLA), follows light/objects" },
      { assessment: "Ears", description: "No drainage, gross hearing intact" },
      { assessment: "Nose", description: "Nares patent, no drainage, no deformities" },
      { assessment: "Mouth & Throat", description: "Mucous membranes pink and moist, no lesions or odor, uvula midline" },
    ]
  },
  {
    id: "headScalpInput",
    field: "Head & Scalp",
    componentType: "input",
    // hideable: true,
    // hideableId: "Head & Scalp"
  },
  {
    id: "eyesInput",
    field: "Eyes",
    componentType: "input",
    // hideable: true,
    // hideableId: "Eyes"
  },
  {
    id: "earsInput",
    field: "Ears",
    componentType: "input",
    // hideable: true,
    // hideableId: "Ears"
  },
  {
    id: "noseInput",
    field: "Nose",
    componentType: "input",
    // hideable: true,
    // hideableId: "Nose"
  },
  {
    id: "mouthThroatInput",
    field: "Mouth & Throat",
    componentType: "input",
    // hideable: true,
    // hideableId: "Mouth & Throat"
  },
  {
    id: "neurologicalAssessmentTitle",
    field: "Neurological Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Orientation", description: "Alert and oriented × 4, follows commands." },
      { assessment: "Speech", description: "Speech clear and coherent." },
      { assessment: "Motor Function", description: "Gross motor functioning intact." }
    ]
  },
  {
    id: "neurologicalOrientationInput",
    field: "Orientation",
    componentType: "input",
    // hideable: true,
    // hideableId: "Orientation"
  },
  {
    id: "speechInput",
    field: "Speech",
    componentType: "input",
    // hideable: true,
    // hideableId: "Speech"
  },
  {
    id: "motorFunctionInput",
    field: "Motor Function",
    componentType: "input",
    // hideable: true,
    // hideableId: "Motor Function"
  },
  {
    id: "integumentStatusCheckbox",
    field: "Integument Status",
    componentType: "checkboxlist",
    // assessmentSubsets: [
    //   { subsetId: "WDL", label: "WDL" },
    //   { subsetId: "WDL, except:", label: "WDL, except:" },
    //   { subsetId: "Skin", label: "Skin" },
    //   { subsetId: "Hair & Nails", label: "Hair & Nails" },
    //   { subsetId: "Turgor", label: "Turgor" },
    //   { subsetId: "Wound", label: "Wound" }
    // ]
  },
  {
    id: "skinInput",
    field: "Skin",
    componentType: "input",
    // hideable: true,
    // hideableId: "Skin"
  },
  {
    id: "hairNailsInput",
    field: "Hair & Nails",
    componentType: "input",
    // hideable: true,
    // hideableId: "Hair & Nails"
  },
  {
    id: "turgorInput",
    field: "Turgor",
    componentType: "input",
    // hideable: true,
    // hideableId: "Turgor"
  },
  {
    id: "woundInput",
    field: "Wound",
    componentType: "input",
    // hideable: true,
    // hideableId: "Wound"
  },
  {
    id: "cardiovascularAssessmentTitle",
    field: "Cardiovascular Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Heart Sounds", description: "Regular rate (60-100 bpm) & rhythm, S1/S2 audible, no murmurs/rubs/gallops." },
      { assessment: "Extremities", description: "Pulses 2+ bilaterally (radial, dorsalis pedis), cap refill < 2 seconds, no edema, uniform color." },
      { assessment: "Jugular Distention", description: "No venous jugular distention." }
    ]
  },
  {
    id: "heartSoundsInput",
    field: "Heart Sounds",
    componentType: "input",
    // hideable: true,
    // hideableId: "Heart Sounds"
  },
  {
    id: "extremitiesInput",
    field: "Extremities",
    componentType: "input",
    // hideable: true,
    // hideableId: "Extremities"
  },
  {
    id: "jugularDistentionInput",
    field: "Jugular Distention",
    componentType: "input",
    // hideable: true,
    // hideableId: "Jugular Distention"
  },
  {
    id: "respiratoryAssessmentTitle",
    field: "Respiratory Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Chest Appearance", description: "Chest expansion symmetric, respirations non-labored, regular rate, no accessory muscle use." },
      { assessment: "Lung Sounds", description: "Breath sounds clear bilaterally (anterior/posterior/lateral), no adventitious sounds (crackles, wheezes, rhonchi)." }
    ]
  },
  {
    id: "chestAppearanceInput",
    field: "Chest Appearance",
    componentType: "input",
    // hideable: true,
    // hideableId: "Chest Appearance"
  },
  {
    id: "lungSoundsInput",
    field: "Lung Sounds",
    componentType: "input",
    // hideable: true,
    // hideableId: "Lung Sounds"
  },
  {
    id: "giAssessmentTitle",
    field: "GI Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Abdomen", description: "Soft, non-tender, non-distended. No masses or guarding, no visible scars or lesions." },
      { assessment: "Bowel Sounds", description: "Present and active in all four quadrants." },
      { assessment: "Nausea", description: "No nausea, vomiting, or diarrhea." }
    ]
  },
  {
    id: "abdomenInput",
    field: "Abdomen",
    componentType: "input",
    // hideable: true,
    // hideableId: "Abdomen"
  },
  {
    id: "bowelSoundsInput",
    field: "Bowel Sounds",
    componentType: "input",
    // hideable: true,
    // hideableId: "Bowel Sounds"
  },
  {
    id: "nauseaInput",
    field: "Nausea",
    componentType: "input",
    // hideable: true,
    // hideableId: "Nausea"
  },
  {
    id: "musculoskeletalAssessmentTitle",
    field: "Musculoskeletal Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "ROM", description: "Full active and passive in all joints, strength 5/5 bilaterally." },
      { assessment: "Gait", description: "Gait steady, ambulates independently" }
    ]
  },
  {
    id: "extremityRomInput",
    field: "Extremity ROM",
    componentType: "input",
    // hideable: true,
    // hideableId: "Extremity ROM"
  },
  {
    id: "musculoskeletalGaitInput",
    field: "Gait",
    componentType: "input",
    // hideable: true,
    // hideableId: "Gait"
  },
  {
    id: "genitourinaryAssessmentTitle",
    field: "Genitourinary Assessment",
    componentType: "static",
    rowType: "titleRow",
    wdlDescription: [
      { assessment: "Voiding", description: "Without pain, burning, or urgency. No new incontinence." },
      { assessment: "Urine", description: "Clear, yellow, absent of odor." }
    ]
  },
  {
    id: "voidingInput",
    field: "Voiding",
    componentType: "input",
    // hideable: true,
    // hideableId: "Voiding"
  },
  {
    id: "urineInput",
    field: "Urine",
    componentType: "input",
    // hideable: true,
    // hideableId: "Urine"
  },
  {
    id: "ivAssessmentTitle",
    field: "IV Assessment",
    componentType: "static",
    rowType: "titleRow"
  },
  {
    id: "ivSiteInput",
    field: "IV Site",
    componentType: "input"
  },
  {
    id: "ivTypeInput",
    field: "IV Type",
    componentType: "input"
  },
  {
    id: "ivLocationInput",
    field: "IV Location",
    componentType: 'input'
  },
  {
    id: "nursingCareTitle",
    field: "Nursing Care",
    componentType: "static",
    rowType: "titleRow"
  },
  {
    id: "nursingCareProvidedInput",
    field: "Nursing Care Provided",
    componentType: "input"
  },

  {
    id: "assessmentToolsTitle",
    field: "Assessment Tools",
    componentType: "static",
    rowType: "titleRow"
  },
  {
    id: "ciwaArSectionTitle",
    field: "CIWA-Ar",
    componentType: "static",
    rowType: "titleRow",
    hideable: true,
    hideableId: "CIWA-Ar"
  },
  {
    id: "ciwaArNauseaVomitingSelect",
    field: "Nausea & Vomiting",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No nausea or vomitting" },
      { subsetId: "1", label: "1 - Mild nausea with no vomiting" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4 - Intermittent nausea with no vomiting" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Constant nausea, frequent dry heaves and vomiting" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArTremorSelect",
    field: "Tremor",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No tremor" },
      { subsetId: "1", label: "1 - Not visible, but can be felt fingertip to fingertip" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4 - Moderate, with patient's arms extended" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Severe, even with arms not extended" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArParoxysmalSweatsSelect",
    field: "Paroxysmal Sweats",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No sweat visible" },
      { subsetId: "1", label: "1 - Barely perceptible sweating, palms moist" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4 - Beads of sweat obvious on forehead" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Drenching sweats" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArAnxietySelect",
    field: "Anxiety",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No anxiety, at ease" },
      { subsetId: "1", label: "1 - Mildly anxious" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4 - Moderately anxious, or guarded, so anxiety is inferred" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Equivalent to acute panic states" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArAgitationSelect",
    field: "Agitation",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Normal activity" },
      { subsetId: "1", label: "1 - Somewhat more than normal activity" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4  - Moderately fidgety and restless" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Paces back and forth during most of the interview, or constantly thrashes about" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArTactileDisturbancesSelect",
    field: "Tactile Disturbances",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - None" },
      { subsetId: "1", label: "1 - Very mild itching, pins and needles, burning, or numbness" },
      { subsetId: "2", label: "2 - Mild itching, pins and needles, burning, or numbness" },
      { subsetId: "3", label: "3 - Moderate itching, pins and needles, burning, or numbness" },
      { subsetId: "4", label: "4 - Moderately severe hallucinations" },
      { subsetId: "5", label: "5 - Severe hallucinations" },
      { subsetId: "6", label: "6 - Extremely severe hallucinations" },
      { subsetId: "7", label: "7 - Continuous hallucinations" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArVisualDisturbancesSelect",
    field: "Visual Disturbances",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Not present" },
      { subsetId: "1", label: "1 - Very mild sensitivity" },
      { subsetId: "2", label: "2" },
      { subsetId: "3", label: "3" },
      { subsetId: "4", label: "4 - Moderately severe hallucinations" },
      { subsetId: "5", label: "5" },
      { subsetId: "6", label: "6" },
      { subsetId: "7", label: "7 - Continuous hallucinations" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArHeadacheSelect",
    field: "Headache",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Not Present" },
      { subsetId: "1", label: "1 - Very mild" },
      { subsetId: "2", "label": "2" },
      { subsetId: "3", "label": "3" },
      { subsetId: "4", label: "4 - Moderately severe" },
      { subsetId: "5", "label": "5" },
      { subsetId: "6", "label": "6" },
      { subsetId: "7", label: "7 - Extremely severe" }
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "ciwaArOrientationSelect",
    field: "Orientation",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Oriented, can do serial additions" },
      { subsetId: "1", label: "1 - Cannot do serial additions or is uncertain about date" },
      { subsetId: "2", label: "2 - Disoriented for date by no more than 2 calendar days" },
      { subsetId: "3", label: "3 - Disoriented for date by more than 2 calendar days" },
      { subsetId: "4", label: "4 - Disoriented to place or person" },
    ],
    hideable: true,
    hideableId: "CIWA-Ar",
    // toolName: "CIWA-Ar"
  },
  {
    id: "morseFallRiskTitle",
    field: "Morse Fall Risk",
    componentType: "static",
    rowType: "titleRow",
    hideable: true,
    hideableId: "Morse Fall Risk"
  },
  {
    id: "morseHistoryOfFallingSelect",
    field: "History of Falling",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No falls" },
      { subsetId: "25", label: "25 - Has fallen within 3 months" },
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"

  },
  {
    id: "morseSecondaryDiagnosisSelect",
    field: "Secondary Diagnosis",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No" },
      { subsetId: "15", label: "15 - Yes" },
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"

  },
  {
    id: "morseAmbulatoryAidSelect",
    field: "Ambulatory Aid",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Bedrest/nurse assist" },
      { subsetId: "15", label: "15 - Crutches/cane/walker" },
      { subsetId: "25", label: "25 - Clutches furniture or support" }
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"
  },
  {
    id: "morseIvTherapySelect",
    field: "IV Therapy/Heparin Lock",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No" },
      { subsetId: "20", label: "20 - Yes" },
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"

  },
  {
    id: "morseGaitSelect",
    field: "Gait",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Normal/Bedrest/Wheelchair" },
      { subsetId: "10", label: "10 - Weak" },
      { subsetId: "20", label: "20 - Impaired" }
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"

  },
  {
    id: "morseMentalStatusSelect",
    field: "Mental Status",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Oriented to own abilities" },
      { subsetId: "15", label: "15 - Overestimates or forgets limitations" },
    ],
    hideable: true,
    hideableId: "Morse Fall Risk",
    // toolName: "Morse Fall Risk"
  },
  {
    id: "bradenScaleTitle",
    field: "Braden Scale",
    componentType: "static",
    rowType: "titleRow",
    hideable: true,
    hideableId: "Braden Scale",

  },
  {
    id: "bradenSensoryPerceptionSelect",
    field: "Sensory Perception",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Completely Limited" },
      { subsetId: "2", label: "2 - Very Limited" },
      { subsetId: "3", label: "3 - Slightly Limited" },
      { subsetId: "4", label: "4 - No Impairment" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"

  },
  {
    id: "bradenMoistureSelect",
    field: "Moisture",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Constantly Moist" },
      { subsetId: "2", label: "2 - Very Moist" },
      { subsetId: "3", label: "3 - Occasionally Moist" },
      { subsetId: "4", label: "4 - Rarely Moist" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"

  },
  {
    id: "bradenActivitySelect",
    field: "Activity",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Bedfast" },
      { subsetId: "2", label: "2 - Chairfast" },
      { subsetId: "3", label: "3 - Walks Occasionally." },
      { subsetId: "4", label: "4 - Walks Frequently" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"

  },
  {
    id: "bradenMobilitySelect",
    field: "Mobility",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Completely Immobile" },
      { subsetId: "2", label: "2 - Very Limited" },
      { subsetId: "3", label: "3 - Slightly Limited" },
      { subsetId: "4", label: "4 - No Limitations" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"

  },
  {
    id: "bradenNutritionSelect",
    field: "Nutrition",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Very Poor" },
      { subsetId: "2", label: "2 - Probably Inadequate" },
      { subsetId: "3", label: "3 - Adequate" },
      { subsetId: "4", label: "4 - Excellent" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"

  },
  {
    id: "bradenFrictionAndShearSelect",
    field: "Friction and Shear",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "1", label: "1 - Problem" },
      { subsetId: "2", label: "2 - Potential Problem" },
      { subsetId: "3", label: "3 - No Apparent Problem" },
    ],
    hideable: true,
    hideableId: "Braden Scale",
    // toolName: "Braden Scale"
  },
  {
    id: "painadTitle",
    field: "PAINAD",
    componentType: "static",
    rowType: "titleRow",
    hideable: true,
    hideableId: "PAINAD",
  },
  {
    id: "painadBreathingSelect",
    field: "Breathing (Independent of Vocalization)",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Normal" },
      { subsetId: "1", label: "1 - Occasional labored breathing, short periods of hyperventilation" },
      { subsetId: "2", label: "2 - Noisy labored breathing, long periods of hyperventilation, Cheyne-Stokes" },
    ],
    hideable: true,
    hideableId: "PAINAD",
    // toolName: "PAINAD"
  },
  {
    id: "painadNegativeVocalizationSelect",
    field: "Negative Vocalization",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - None" },
      { subsetId: "1", label: "1 - Occasional moan or groan, low-level speech with a negative or disapproving quality" },
      { subsetId: "2", label: "2 - Repeated troubled calling out, loud moaning or groaning, crying" },
    ],
    hideable: true,
    hideableId: "PAINAD",
    // toolName: "PAINAD"
  },
  {
    id: "painadFacialExpressionSelect",
    field: "Facial Expression",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Smiling or inexpressive" },
      { subsetId: "1", label: "1 - Sad, frightened, frown" },
      { subsetId: "2", label: "2 - Facial grimacing" },
    ],
    hideable: true,
    hideableId: "PAINAD",
    // toolName: "PAINAD"
  },
  {
    id: "painadBodyLanguageSelect",
    field: "Body Language",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - Relaxed" },
      { subsetId: "1", label: "1 - Tense, distressed pacing, fidgeting" },
      { subsetId: "2", label: "2 - Rigid, fists clenched, knees pulled up or pushing away, striking out" },
    ],
    hideable: true,
    hideableId: "PAINAD",
    // toolName: "PAINAD"
  },
  {
    id: "painadConsolabilitySelect",
    field: "Consolability",
    componentType: "assessmentselect",
    chartingOptions: [
      { subsetId: "0", label: "0 - No need to console" },
      { subsetId: "1", label: "1 - Distracted or reassured by voice or touch" },
      { subsetId: "2", label: "2 - Unable to console, distract, or reassure" },
    ],
    hideable: true,
    hideableId: "PAINAD",
    // toolName: "PAINAD"
  },
];


const formatTimeOffset = (minuteOffset: number) => {
  const minutesInDay = 1440;
  const minutesInHour = 60;

  const days = Math.floor(minuteOffset / minutesInDay);
  const remainingMinutesAfterDays = minuteOffset % minutesInDay;
  const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);
  const minutes = remainingMinutesAfterDays % minutesInHour;

  return { days, hours, minutes };
}

const columnHelper = createColumnHelper<FlexSheetData>();

// left column pinned
function getPinnedStyles(column: Column<FlexSheetData>): React.CSSProperties {
  const styles: React.CSSProperties = {
    width: `${column.getSize()}px`,
    minWidth: `${column.getSize()}px`,
    maxWidth: `${column.getSize()}px`,
  };
  if (!column.getIsPinned()) {
    return {};
  }
  const side = column.getIsPinned();
  return {
    ...styles,
    position: 'sticky',
    [side as string]: `${column.getStart(side)}px`,
    zIndex: side === 'left' ? 10 : 1,
    borderCollapse: 'separate'
  };
}

export function ChartingForm() {
  const [chartingData, setChartingData] = useState<FlexSheetData[]>(chartingDataTemplate)
  const [timePoints, setTimePoints] = useState<number[]>([180, 60, 30])

  const router = useRouter()

  const handleAddColumn = (offset: number) => {
    if (timePoints.includes(offset)) {
      return
    }
    setTimePoints(prev =>
      [...prev, offset].sort((a, b) => b - a)
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    router.push('/admin/case-builder/form/intake-output')
  }

  useEffect(() => {
    console.log(chartingData)
  }, [chartingData])



  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        minSize: 220,
        maxSize: 400,
        id: 'pinned',
        header: () => <div className="h-20 w-full bg-gray-50"></div>,
        cell: info => {
          const rowType = info.row.original.rowType;
          if (rowType === "titleRow") {
            const wdlDescription = info.row.original?.wdlDescription;
            if (wdlDescription && wdlDescription.length > 0) {
              return (
                <Tooltip>
                  <TooltipTrigger
                    className="px-2 font-medium text-xs text-lime-900"
                  >
                    {info.row.original.field}
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow shadow-black/30 rounded-xl ml-4 p-4 z-51 max-w-sm">
                      <h1 className="text-sm font-bold">WDL Criteria</h1>
                      <div className="space-y-2">
                        {wdlDescription.map((row, index) => (
                          <div key={index} className="text-wrap">
                            <p className="pl-2 text-xs font-semibold text-gray-800 text-wrap">{row.assessment}:</p>
                            <p className="pl-4 text-xs text-gray-600 italic text-wrap">{row.description}</p>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              );
            } else {
              return (
                <div className="flex items-center">
                  <p className="w-full h-full text-xs text-left py-0 pl-2 px-2 font-medium text-lime-900">
                    {info.row.original.field}
                  </p>
                </div>
              );
            }
          } else {
            return (
              <div className="flex items-center">
                <p className="w-full h-full text-left text-xs py-0 pl-4 text-neutral-600 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-wrap">
                  {info.getValue()}
                </p>
              </div>

            );
          };
        },
      }),


      // map out remaining columns
      ...timePoints.map(timePoint => {
        const { days, hours, minutes } = formatTimeOffset(timePoint);
        return (

          columnHelper.accessor(row => row[timePoint], {
            id: String(timePoint),
            header: () => {
              return (
                <div className="flex justify-center items-center">
                  <div className="grid grid-cols-2 gap-x-2">
                    <p className="text-gray-800 font-light">Days: </p>
                    <p className="mb-1">{days}</p>
                    <p className="text-gray-800 font-light">Hours: </p>
                    <p className="mb-1">{hours}</p>
                    <p className="text-gray-800 font-light">Minutes: </p>
                    <p className="mb-1">{minutes}</p>
                  </div>
                </div>
              )
            },
            cell: ({ row, column, getValue, table }) => {
              const componentType = row.original.componentType
              switch (componentType) {
                case 'input':
                  return (
                    <TableInputCell getValue={getValue}
                      row={row}
                      column={column}
                      table={table}
                    />
                  )
                case 'static':
                  return (
                    <p></p>
                  );
                case 'assessmentselect':
                  return (
                    <TableAssessmentSelectCell
                      getValue={getValue}
                      row={row}
                      column={column}
                      table={table}
                    />)
              }
            }
          }))
      }
      )
    ],
    [timePoints]
  );

  const ptTable = useReactTable({
    data: chartingData,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setChartingData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              // 1. Create the new object
              const updatedRow = {
                ...old[rowIndex]!,
                [columnId]: value,
              };

              // 2. Force TypeScript to accept it matches your Interface
              return updatedRow as FlexSheetData;
            }
            return row;
          })
        )
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });



  return (
    <div className="flex flex-col w-[calc(100vw-16rem)] h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div className="">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clipboard className="text-slate-400" />
            Documentation Results
          </h1>

          <p className="text-xs text-slate-500 mt-1">Step 5 of 9: Enter laboratory and imaging results</p>
        </div>

        <form onSubmit={handleSubmit} >
          <input name='labData' type='hidden' value={JSON.stringify(chartingData)} />
          <SubmitButton buttonText="Continue" />
        </form>
      </header>
      <div className="px-8 py-2">
        <AddLabColumn handleColumnAdd={handleAddColumn} />

      </div>

      <div className="w-full px-4 ">
        <main className="h-[calc(100vh-8.5rem)] w-full border border-gray-200 rounded-t-lg overflow-auto bg-white shadow-sm relative">
          <Table className="w-full overflow-x-auto">
            <TableHeader className=" bg-gray-50 ">
              {ptTable.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      style={getPinnedStyles(header.column)}
                      key={header.id}
                      className="border-b-2 border-gray-200 p-0"
                    >
                      {/* Render the header content using flexRender */}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {ptTable.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="h-6">
                  {row.getVisibleCells().map(cell => {
                    const componentType = row.original.componentType
                    return (
                      <TableCell
                        style={getPinnedStyles(cell.column)}
                        key={`${cell.id}-${row.original.field}`}
                        className={`min-w-50 w-120 p-0 m-0 h-6 border-separate border-gray-200 border-b  ${componentType === "static" ? "bg-lime-50" : "bg-white border-r border-separate"}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-gray-100">
              {ptTable.getFooterGroups().map(footerGroup => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="h-6 p-0 text-left text-gray-700 border-gray-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </main>
      </div>
    </div>

  );
}



export default ChartingForm