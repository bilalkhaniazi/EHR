'use client'

import type { LabTableData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, Column } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

import { TestTube2 } from "lucide-react";
import { AddLabColumn } from "./components/addLabCol";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/ui/combobox";
import SubmitButton from "../../components/submitButton";
import { useRouter } from "next/navigation";
import { LabTableImagingReport, LabTableInputCell, LabTableMicrobioReport } from "./components/labTableInputCell";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "@/context/FormContext";

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


const columnHelper = createColumnHelper<LabTableData>();

// left column pinned
function getPinnedStyles(column: Column<LabTableData>): React.CSSProperties {
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
    zIndex: side === 'left' ? 2 : 1,
  };
}

export function LabForm() {
  const [labTableData, setLabTableData] = useState<LabTableData[]>(labData);
  const [timePoints, setTimePoints] = useState([0]);
  const [visibleInPresim, setVisibleInPresim] = useState<boolean>(false);


  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [comboboxValue, setComboboxValue] = useState<string>("");
  const { onDataChange } = useFormContext()
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
      return visibleItems.has(row.field);
    });
  }, [labTableData, visibleItems]);

  // Handler to add an item to visible list
  const handleAddVisibleItem = (fieldName: string) => {
    if (fieldName) {
      setVisibleItems(prev => new Set([...prev, fieldName]));
      setComboboxValue("");
    }
  };

  const handleAddColumn = (offset: number) => {
    if (timePoints.includes(offset)) {

      return
    }
    setTimePoints(prev =>
      [...prev, offset].sort((a, b) => b - a)
    )
  }

  const handleSubmit = () => {
    onDataChange('labs', labTableData)
    router.push('/admin/case-builder/form/charting')
  }

  const columns = useMemo(
    () => [
      // first column has unique formatting
      columnHelper.accessor("field", {
        id: 'pinned',
        minSize: 200,
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
                    <p className="mb-1 ml-1">{days * -1}</p>
                    <p className="text-gray-800 font-light">Hours: </p>
                    <p className="mb-1 ml-1">{hours * -1}</p>
                    <p className="text-gray-800 font-light">Minutes: </p>
                    <p className="mb-1 ml-1">{minutes * -1}</p>
                  </div>
                </div>
              )
            },
            cell: ({ row, column, getValue, table }) => {
              const rowType = row.original.rowType
              const x = row.original.field
              console.log(x)
              switch (rowType) {
                case 'results':
                  return (
                    <LabTableInputCell
                      row={row}
                      getValue={getValue}
                      column={column}
                      table={table}
                      visibleInPresim={visibleInPresim}
                    />
                  );
                case 'imaging':
                  return (
                    <LabTableImagingReport
                      column={column}
                      row={row}
                      table={table}
                      getValue={getValue}
                      visibleInPresim={visibleInPresim}
                    />
                  )
                case 'microbiology':
                  return (
                    <LabTableMicrobioReport
                      column={column}
                      row={row}
                      table={table}
                      getValue={getValue}
                      visibleInPresim={visibleInPresim}
                    />
                  )
              }
            }
          }))
      }
      )
    ],
    [timePoints, visibleInPresim]
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
  console.log(labTableData)
  return (
    <div className="flex flex-col w-[calc(100vw-16rem)] h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10">
        <div className="">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TestTube2 className="text-slate-400" />
            Lab Results
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 5 of 6: Enter laboratory and imaging results</p>
        </div>

        <div>
          <SubmitButton onClick={handleSubmit} buttonText="Save & Continue" />
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 px-6 pt-4 overflow-auto">
        <div className="w-full flex justify-start gap-12 mb-3 px-4 items-end">
          <AddLabColumn handleColumnAdd={handleAddColumn} />
          <div>
            <Label>Imaging Options</Label>
            <Combobox onValueChange={handleAddVisibleItem} value={comboboxValue} displayText="Select scans..." data={hideableOptions}></Combobox>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex items-center space-x-2 border rounded-md p-2 bg-white w-fit h-fit">
              <Switch id="presim" checked={visibleInPresim} onCheckedChange={setVisibleInPresim} />
              <Label htmlFor="presim" className="text-sm font-normal cursor-pointer">{visibleInPresim ? 'Included in Pre-Sim' : 'Excluded from Pre-Sim'}</Label>
            </div>
            <div className="space-y-1.5">
              <p className="w-fit items-center  px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-300 uppercase tracking-wide">
                Not included in Pre-Sim
              </p>
              <p className="w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-lime-50 text-lime-600 border border-lime-300 uppercase tracking-wide">
                Included in Pre-Sim
              </p>
            </div>
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
                        className={`!p-0 m-0 h-6 border-separate border-gray-200 border-b min-w-40 ${rowType === "divider" ? "bg-blue-50" : "bg-white border-r border-separate"}`}
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
        </div>
      </main>
    </div>

  );
}

export default LabForm

