'use client'

import type { ImagingData, LabTableData, MicrobiologyReportData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

import { ShieldAlert, TestTube2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddLabColumn } from "./components/addLabCol";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddMicrobiologyReport from "@/app/admin/case-builder/form/labs/components/addMicrobiologyReport";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/ui/combobox";
import AddImagingReport from "@/app/admin/case-builder/form/labs/components/addImagingReport";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";

// Define the structure for initial lab results when adding a new column
export interface NewLabResult {
  labName: string;
  value: string;
}

export const labData: LabTableData[] = [
  {
    field: "Metabolic",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Sodium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 135, high: 145 },
  },
  {
    field: "Potassium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 3.5, high: 5.0 },
    criticalRange: { low: 3.0, high: 6.0 },

  },
  {
    field: "Chlorine",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 95, high: 105 },

  },
  {
    field: "BUN",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 7, high: 20 },

  },
  {
    field: "Creatinine",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0.6, high: 1.2 },

  },
  {
    field: "Glucose",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 70, high: 100 },

  },
  {
    field: "CO2",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 23, high: 30 },

  },
  {
    field: "Calcium",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 8.5, high: 10.5 },

  },
  {
    field: "Lactate",
    unit: "(mmol/L)",
    rowType: "results",
    normalRange: { low: 0.5, high: 1.0 },

  },
  {
    field: "Hematology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "RBC",
    unit: "(10⁶/µL)",
    rowType: "results",
    normalRange: { low: 4.0, high: 6.0 },

  },
  {
    field: "WBC",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: 4.5, high: 11.0 },

  },
  {
    field: "Platelets",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: 150, high: 450 },

  },
  {
    field: "Hemoglobin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 12.0, high: 17.5 },

  },
  {
    field: "Hematocrit",
    unit: "(%)",
    rowType: "results",
    normalRange: { low: 36, high: 54 },

  },
  {
    field: "MCV",
    unit: "(fL)",
    rowType: "results",
    normalRange: { low: 80, high: 100 },

  },
  {
    field: "MCH",
    unit: "(pg)", // Picograms
    rowType: "results",
    normalRange: { low: 27, high: 33 },

  },
  {
    field: "MCHC",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 32, high: 36 },

  },
  {
    field: "Cardiac",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Troponin",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 0.04 },

  },
  {
    field: "CKMB",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 3 },

  },
  {
    field: "Myoglobin",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 85 },

  },
  {
    field: "Hepatology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "AST",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 10, high: 40 },

  },
  {
    field: "ALT",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 7, high: 56 },

  },
  {
    field: "ALP",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 40, high: 120 },

  },
  {
    field: "Total Bilirubin",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0.1, high: 1.2 },

  },
  {
    field: "Albumin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 3.5, high: 5.0 },

  },
  {
    field: "Ammonia",
    unit: "(mcg/dL)", // Common unit for Ammonia
    rowType: "results",
    normalRange: { low: 15, high: 45 }
  },
  {
    field: "Venous Blood Gas",
    unit: "",
    rowType: "divider",
  },
  {
    field: "pH",
    unit: "", // pH is unitless
    rowType: "results",
    normalRange: { low: 7.35, high: 7.45 },

  },
  {
    field: "pCO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: 40, high: 50 },

  },
  {
    field: "pO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: 30, high: 40 },

  },
  {
    field: "HCO3",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 22, high: 29 },

  },
  {
    field: "Urinalysis",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Specific Gravity",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 1.005, high: 1.030 },

  },
  {
    field: "Urine pH",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 4.5, high: 8.0 },

  },
  {
    field: "Protein",
    unit: "",
    rowType: "results",

  },
  {
    field: "Urine Glucose",
    unit: "", // Often reported as negative/positive
    rowType: "results",

  },
  {
    field: "Ketones",
    unit: "", // Often reported as negative/positive
    rowType: "results",


  },
  {
    field: "Leukocyte Esterase",
    unit: "", // Often reported as negative/positive
    rowType: "results",

  },
  {
    field: "Nitrites",
    unit: "", // Often reported as negative/positive
    rowType: "results",

  },
  {
    field: "Blood",
    unit: "", // Often reported as negative/positive
    rowType: "results",

  },
  {
    field: "Coagulation",
    unit: "",
    rowType: "divider",
  },
  {
    field: "PT",
    unit: "(sec)",
    rowType: "results",
    normalRange: { low: 11.0, high: 13.5 },

  },
  {
    field: "PTT",
    unit: "(sec)",
    rowType: "results",
    normalRange: { low: 25, high: 35 },

  },
  {
    field: "INR",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 0.8, high: 1.1 },
  },
  {
    field: "Inflammatory Markers",
    unit: "",
    rowType: "divider",
  },
  {
    field: "CRP",
    unit: "(mg/L)",
    rowType: "results",
    normalRange: { low: 0, high: 10 },
  },
  {
    field: "ESR",
    unit: "(mm/hr)",
    rowType: "results",
    normalRange: { low: 0, high: 20 },
  },
  {
    field: "Thyroid Function",
    unit: "",
    rowType: "divider",

  },
  {
    field: "TSH",
    unit: "(mIU/L)",
    rowType: "results",
    normalRange: { low: 0.4, high: 4.0 },
  },
  {
    field: "Free T3",
    unit: "(pg/mL)",
    rowType: "results",
    normalRange: { low: 2.3, high: 4.2 },
  },
  {
    field: "Free T4",
    unit: "(ng/dL)",
    rowType: "results",
    normalRange: { low: 0.8, high: 1.8 },
  },
  {
    field: "Lipid Panel",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Total Cholesterol",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 125, high: 200 },

  },
  {
    field: "HDL Cholesterol",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 40, high: 60 },
  },
  {
    field: "LDL Cholesterol",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0, high: 100 },

  },
  {
    field: "Triglycerides",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0, high: 150 },
  },
  {
    field: "Additional Electrolytes",
    unit: "",
    rowType: "divider",

  },
  {
    field: "Magnesium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 1.5, high: 2.5 },

  },
  {
    field: "Phosphate",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 2.5, high: 4.5 },
  },
  {
    field: "Pancreatic Enzymes",
    unit: "",
    rowType: "divider",

  },
  {
    field: "Amylase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: 25, high: 125 },
  },
  {
    field: "Lipase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: 0, high: 160 },
  },
  {
    field: "Imaging",
    unit: "",
    rowType: "divider",
  },
  {
    field: "CT R. Foot",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Head w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Head w/ Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Neck w/ Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Orbits w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Sinuses w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Chest w/ Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Chest w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Abdomen/Pelvis w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT Abdomen/Pelvis w/ Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT C-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT T-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT L-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT L. Foot",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT R. Ankle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT L. Ankle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT R. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "CT L. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI Brain w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI Brain w/ and w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI C-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI T-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI L-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI R. Shoulder",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI L. Shoulder",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI R. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI L. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "MRI Abdomen w/ and w/o Contrast",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Renal",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US RUQ (Gallbladder/Liver)",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Appendix",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Pelvic",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Scrotal",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Thyroid",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Carotid Doppler",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Venous Doppler Bil. U/E",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Venous Doppler Bil. L/E ",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Echocardiogram (TTE)",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "US Echocardiogram (TEE)",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR Chest",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR Abdomen",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR C-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR T-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L-Spine",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Shoulder",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Shoulder",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Clavicle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Clavicle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Humerus",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Humerus",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Elbow",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Elbow",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Forearm",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Forearm",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Wrist",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Wrist",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Hand",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Hand",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR Pelvis",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Hip",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Hip",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Femur",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Femur",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Knee",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Tib/Fib",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Tib/Fib",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Ankle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Ankle",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR R. Foot",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "XR L. Foot",
    unit: "",
    rowType: "imaging",
    hideable: true
  },
  {
    field: "Microbiology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Wound Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true

  },
  {
    field: "Urine Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true
  },
  {
    field: "Stool Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true
  },
  {
    field: "Sputum Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true
  },
  {
    field: "CSF Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true
  },
  {
    field: "Blood Culture",
    unit: "",
    rowType: "microbiology",
    hideable: true
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

const getResultStatus = (initialValue: string, normalRange: { low: number, high: number } | undefined, criticalRange: { low: number, high: number } | undefined) => {
  const numericValue = parseFloat(initialValue)

  if (isNaN(numericValue)) {
    return 'invalid';
  }
  if (criticalRange && (numericValue < criticalRange.low || numericValue > criticalRange.high)) {
    return "critical";
  }
  if (normalRange && (numericValue < normalRange.low || numericValue > normalRange.high)) {
    return "abnormal";
  }
  return "normal";
}

const columnHelper = createColumnHelper<LabTableData>();

// left column pinned
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPinnedStyles(column: any): React.CSSProperties {
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
    [side]: `${column.getStart(side)}px`,
    zIndex: side === 'left' ? 2 : 1,
  };
}

export function LabForm() {
  const [labTableData, setLabTableData] = useState<LabTableData[]>(labData)
  const [timePoints, setTimePoints] = useState([0])

  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [comboboxValue, setComboboxValue] = useState<string>("");
  const router = useRouter()

  // Get all hideable options
  const hideableOptions = useMemo(() => {
    return labTableData
      .filter(row => row.hideable === true)
      .filter(row => !visibleItems.has(row.field)) // Only show unselected options
      .map(row => ({
        value: row.field,
        label: row.field
      }));
  }, [labTableData, visibleItems]);

  // Filter data to only show visible rows
  const filteredLabTableData = useMemo(() => {
    return labTableData.filter(row => {
      // Always show non-hideable rows
      if (!row.hideable) return true;
      // Show hideable rows only if they're in visibleItems
      return visibleItems.has(row.field);
    });
  }, [labTableData, visibleItems]);

  // Handler to add an item to visible list
  const handleAddVisibleItem = (fieldName: string) => {
    if (fieldName) {
      setVisibleItems(prev => new Set([...prev, fieldName]));
      setComboboxValue(""); // Reset combobox after selection
    }
  };

  const handleAddColumn = (offset: number) => {
    if (timePoints.includes(offset)) {
      // sonner time offset already used
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
    router.push('/admin/case-builder/form/charting')
  }

  useEffect(() => {
    console.log(labTableData)
  }, [labTableData])



  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        id: 'pinned',
        minSize: 200, // Optional: prevents it from getting too small if resizable
        maxSize: 400,
        header: () => <h1 className="h-20 bg-gray-50"></h1>,
        cell: info => {
          const rowType = info.row.original.rowType;
          const field = info.row.original.field
          if (rowType === "divider") {
            return (
              <p className="w-full text-left text-xs py-0 px-2 font-medium text-blue-900">
                {field}
              </p>
            );
          }
          else {
            const labRange = info.row.original?.normalRange;
            if (labRange) {
              const unit = info.row.original?.unit || ''
              return (
                <Tooltip>
                  <TooltipTrigger className="w-full font-normal text-xs text-neutral-700 shadow-none rounded-none">
                    <div className="flex justify-end w-full ">
                      <p className="text-right font-normal px-2 text-xs text-neutral-700 text-wrap">{field}</p>
                      {unit && <p className="text-right font-normal pr-2 text-xs tracking-tight text-neutral-400">{unit}</p>}
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent className="bg-white shadow border border-gray-200 rounded-xl ml-4 p-2 z-10">
                      <h1 className="text-md font-semibold">{field}</h1>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <p className="pl-2 text-gray-800 text-xs font-medium">
                            <span className="font-normal">Low: </span>
                            &#60;{labRange.low}
                          </p>
                          <p className="pl-2 text-gray-800 text-xs font-medium">
                            <span className="font-normal">High: </span>
                            &#62;{labRange.high}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              );
            }
            return (
              <p className="w-full text-right font-normal px-2 text-xs text-neutral-700 text-wrap">
                {field}
              </p>
            );
          }
        }
      },
      ),

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
                    <p className="mb-1 ml-1">{days}</p>
                    <p className="text-gray-800 font-light">Hours: </p>
                    <p className="mb-1 ml-1">{hours}</p>
                    <p className="text-gray-800 font-light">Minutes: </p>
                    <p className="mb-1 ml-1">{minutes}</p>
                  </div>
                </div>
              )
            },
            cell: ({ row, column, getValue, table }) => {
              const rowType = row.original.rowType

              switch (rowType) {
                case 'results':
                  const initialValue = (getValue() as string) || '';
                  const abnormalRange = row.original?.normalRange
                  const criticalRange = row.original?.criticalRange

                  const resultStatus = getResultStatus(initialValue, abnormalRange, criticalRange);
                  const isCritical = resultStatus === "critical"
                  const isAbnormal = resultStatus === "abnormal"

                  const [value, setValue] = useState(initialValue)
                  const onBlur = () => {
                    table.options.meta?.updateData(row.index, column.id, value)
                  }
                  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  };
                  useEffect(() => {
                    setValue(initialValue)
                  }, [initialValue])

                  return (
                    <div key={`${row.id}-${column.id}-${row.original.field}`} className="flex h-6 items-center w-full hover:bg-gray-50">
                      <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        className={`w-full h-6 text-right text-xs border-0 rounded-none shadow-none focus-visible:ring-0 ${(isAbnormal || isCritical) && "text-red-600 font-medium"}`}
                        onKeyDown={onKeyDown}
                        key={`${row.id}-${column.id}-${row.original.field}`}
                      />
                      {isCritical && <ShieldAlert color="#e7000b" size={18} />}
                    </div>
                  );
                case 'imaging':
                  const imagingReport = (getValue() as ImagingData) || {}
                  const [isImageReportOpen, setIsImageReportOpen] = useState(false)
                  const isImageEditMode = Object.keys(imagingReport).length > 0;

                  const handleAddorEditImageReport = (newReportData: ImagingData) => {
                    table.options.meta?.updateData(row.index, column.id, newReportData);
                    setIsImageReportOpen(false); // Close the popover on submit
                  };

                  return (
                    <Dialog open={isImageReportOpen} onOpenChange={setIsImageReportOpen}>
                      <DialogTitle />
                      <DialogTrigger asChild className="hover:bg-gray-50">
                        {isImageEditMode ? (
                          <button type='button' className="w-full h-6 text-center text-xs">
                            {imagingReport.displayName}
                          </button>
                        ) : (
                          <button type='button' className="w-full h-6"></button>
                        )}
                      </DialogTrigger>
                      <AddImagingReport
                        imagingType={row.original.field}
                        initialData={isImageEditMode ? imagingReport : undefined}
                        handleAddImagingReport={handleAddorEditImageReport}
                      />
                    </Dialog>
                  )
                case 'microbiology':
                  const microbiologyReport = (getValue() as MicrobiologyReportData) || {}
                  const isEditMode = Object.keys(microbiologyReport).length > 0;

                  const [isOpen, setIsOpen] = useState<boolean>(false)

                  const handleAddorEditReport = (newReportData: MicrobiologyReportData) => {
                    table.options.meta?.updateData(row.index, column.id, newReportData);
                    setIsOpen(false); // Close the popover on submit
                  };
                  return (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTitle />
                      <DialogTrigger asChild className="hover:bg-gray-50">
                        {isEditMode ? (
                          <button type='button' className="w-full h-6 text-center text-xs">
                            {microbiologyReport.sampleType}
                          </button>
                        ) : (
                          <button type='button' className="w-full h-6"></button>
                        )}
                      </DialogTrigger>
                      <AddMicrobiologyReport
                        handleAddMicrobiologyReport={handleAddorEditReport}
                        initialData={isEditMode ? microbiologyReport : undefined}
                      />
                    </Dialog>
                  )
              }
            }
          }))
      }
      )
    ],
    [timePoints]
  );

  const ptTable = useReactTable({
    data: filteredLabTableData,
    columns,
    enablePinning: true,
    initialState: {
      columnPinning: {
        left: ['pinned']
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const filteredRow = filteredLabTableData[rowIndex];
        const actualIndex = labTableData.findIndex(row => row.field === filteredRow?.field);
        setLabTableData(old =>
          old.map((row, index) => {
            if (index === actualIndex) {
              return {
                ...old[actualIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    getCoreRowModel: getCoreRowModel(),

  });

  return (
    // CHANGED: Replaced 'fixed inset-0' with 'h-[calc(100vh-4rem)]'
    // This respects the sidebar width but locks the height so internal scrolling works.
    <div className="flex flex-col w-[calc(100vw-16rem)] h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10">
        <div className="">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TestTube2 className="text-slate-400" />
            Lab Results
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 5 of 6: Enter laboratory and imaging results</p>
        </div>

        <form onSubmit={handleSubmit} >
          <input name='labData' type='hidden' value={JSON.stringify(labTableData)} />
          <SubmitButton buttonText="Continue" />
        </form>
      </header>

      <main className="flex-1 flex flex-col min-h-0 px-6 pt-4 overflow-auto">
        <div className="flex-none w-full flex gap-24 mb-2 px-1">
          <AddLabColumn handleColumnAdd={handleAddColumn} />
          <div>
            <Label>Imaging Options</Label>
            <Combobox onValueChange={handleAddVisibleItem} value={comboboxValue} displayText="Select scans..." data={hideableOptions}></Combobox>
          </div>
        </div>
        <div className="flex-1 w-full border border-gray-200 rounded-t-lg overflow-auto bg-white shadow-sm relative">
          <Table className="w-full overflow-x-auto">
            <TableHeader className=" bg-gray-50 sticky top-0 z-20">
              {ptTable.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      style={getPinnedStyles(header.column)}
                      key={header.id}
                      className="border-b-2 border-gray-200 p-0 bg-gray-50"
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
                    const rowType = row.original.rowType
                    return (
                      <TableCell
                        style={getPinnedStyles(cell.column)}
                        key={`${cell.id}-${row.original.field}`}
                        className={`p-0 m-0 h-6 border-separate border-gray-200 border-b min-w-40 bg-white ${rowType === "divider" ? "bg-blue-50" : "bg-white border-r border-separate"}`}
                      >
                        {/* Render the cell content using flexRender */}
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
        </div>
      </main>
    </div>

  );
}

export default LabForm

