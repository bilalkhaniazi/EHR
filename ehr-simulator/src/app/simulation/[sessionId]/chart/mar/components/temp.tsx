'use client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
  PencilLine,
  UserCheck,
  UserX,
  ScanBarcode,
  ExternalLink,
  Pill,
  AlertCircle
} from "lucide-react"
import { useState } from "react"
import { type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData";
import MedAdminCard from "./medAdminCard";
import { differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import type { NewAdministrationData } from "../page";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MedAdministrationProps {
  selectedMedIds: string[];
  allOrders: MedicationOrder[];
  administrationsLookup: { [key: string]: MedAdministrationInstance[] };
  medicationLookup: { [key: string]: AllMedicationTypes };
  sessionStartTime: number;
  realWorldTime: Date;
  isScanned: boolean;
  onPtScan: (scan: boolean) => void;
  newAdministrations: NewAdministrationData;
  onUpdateAdministration: (orderId: string, field: keyof MedAdministrationInstance, value: string | number) => void;
  onAdministerMeds: (meds: MedAdministrationInstance[]) => void;
  onClearAll: () => void;
  handlePopoverClose: (x: boolean) => void;
  isOpen: boolean;
  onOrderRemove: (id: string) => void;
}

// Helper for status badge
const PatientStatusBadge = ({ isScanned }: { isScanned: boolean }) => {
  if (isScanned) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full transition-all">
        <UserCheck size={16} strokeWidth={2.5} />
        <span className="text-xs font-bold uppercase tracking-wide">Patient Verified</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full animate-pulse transition-all">
      <UserX size={16} strokeWidth={2.5} />
      <span className="text-xs font-bold uppercase tracking-wide">ID Not Verified</span>
    </div>
  )
}

const MedAdministrationPanel = ({
  selectedMedIds,
  allOrders,
  medicationLookup,
  administrationsLookup,
  sessionStartTime,
  realWorldTime,
  newAdministrations,
  onUpdateAdministration,
  isScanned,
  onPtScan,
  onAdministerMeds: handleAdministerMeds,
  isOpen,
  handlePopoverClose,
  onOrderRemove
}: MedAdministrationProps) => {
  const [isLoading] = useState(false)

  const hasSelections = selectedMedIds.length > 0;

  const selectedMedOrders = allOrders.filter(order => {
    if (selectedMedIds.includes(order.id)) {
      return order
    }
  })

  // LOGIC: Unchanged
  const handleFakeScan = (scan: boolean) => {
    onPtScan(scan)
  }

  // LOGIC: Unchanged
  const handleSubmit = async () => {
    const payload = Object.keys(newAdministrations).map(orderId => {
      const currentAdmin = newAdministrations[orderId];
      const offset = differenceInMinutes(realWorldTime, sessionStartTime);

      return {
        ...currentAdmin,
        medicationOrderId: orderId,
        administratorId: "StudentID",
        adminTimeMinuteOffset: offset,
        status: currentAdmin.status     // status always initialized as 'given' by default 
      };
    });

    try {
      handleAdministerMeds(payload)
      console.log(payload)
      handlePopoverClose(false);
      toast.success("Medications successfully documented");

    } catch (err) {
      console.error("Failed to save administrations", err);
      toast.error("Failed to save administrations");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handlePopoverClose}>

      {/* Trigger Button */}
      <div className="flex w-full justify-end items-center h-full px-4 gap-6">
        {/* Small Status Indicator in the Toolbar */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isScanned ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className={`text-xs font-medium ${isScanned ? 'text-emerald-700' : 'text-red-600'}`}>
            {isScanned ? "Pt. Identified" : "Pt. Unknown"}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button
            onClick={() => handlePopoverClose(true)}
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2 px-4"
            disabled={!hasSelections}
          >
            <PencilLine className="w-4 h-4" />
            <span className="font-medium">Document Administration</span>
            {selectedMedIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-500 text-white hover:bg-blue-500 border-none px-1.5 h-5 min-w-5">
                {selectedMedIds.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="flex flex-col md:max-w-4xl max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden bg-white border-slate-200">

        {/* --- HEADER --- */}
        <DialogHeader className="px-6 py-4 bg-gray-100 border-b border-slate-200 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Pill size={20} fill="white" />
                </div>
                Medication Administration
              </DialogTitle>

            </div>

            {/* Patient Scan Controls */}
            <div className="flex items-center gap-4 bg-white  p-2 rounded-lg border border-gray-200-100">
              <PatientStatusBadge isScanned={isScanned} />
              <Separator orientation="vertical" className="h-6 bg-slate-200" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFakeScan(!isScanned)}
                className="text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 gap-2 h-8"
              >
                <ScanBarcode size={16} />
                {isScanned ? "Re-scan Wristband" : "Scan Wristband"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* --- BODY (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isScanned && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Safety Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  Patient identity has not been verified via barcode scan.
                  Please scan the patient wristband before administering medications to ensure 5 Rights of Medication Administration.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 pb-10">
            {selectedMedOrders.map(order => {
              const currentAdminData = newAdministrations[order.id] || { status: "Given", administeredDose: 0 };

              return (
                <MedAdminCard
                  key={order.id}
                  order={order}
                  medication={medicationLookup[order.medicationId]}
                  administrations={administrationsLookup[order.id]}
                  sessionStartTime={sessionStartTime}
                  realWorldNow={realWorldTime}
                  onOrderRemove={onOrderRemove}

                  // State Updates
                  onStatusChange={(value) => {
                    onUpdateAdministration(order.id, "status", value);
                  }}
                  currentStatus={currentAdminData.status ?? "Given"}

                  onDoseChange={(value) => {
                    onUpdateAdministration(order.id, "administeredDose", value);
                  }}
                  currentDose={currentAdminData.administeredDose}
                  onCommentChange={(value) => {
                    onUpdateAdministration(order.id, 'notes', value)
                  }}
                  currentComment={currentAdminData.notes || ''}
                />
              )
            })}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <DialogFooter className="px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0 sm:justify-between gap-4">
          {/* Reference Link (Left aligned on desktop) */}
          <a
            href="https://online.lexi.com/lco/action/ivcompatibility/trissels"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-md border border-slate-200 hover:border-blue-200"
          >
            <ExternalLink size={14} />
            Check IV Compatibility (Trissel&apos;s)
          </a>

          <div className="flex gap-3 w-full sm:w-auto">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 sm:flex-none border-slate-300 text-slate-700">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading || !isScanned}
              onClick={handleSubmit}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm min-w-[120px]"
            >
              {isLoading ? "Signing..." : "Sign & Accept"}
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export default MedAdministrationPanel





// split

// 'use client'

// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogFooter,
//   DialogClose,
//   DialogTitle
// } from "@/components/ui/dialog"

// import { Button } from "@/components/ui/button"
// import { PencilLine, UserCheck, UserMinus } from "lucide-react"
// import { useState } from "react"
// import { type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData";
// import MedAdminCard from "./medAdminCard";
// import { differenceInMinutes } from "date-fns";
// import { toast } from "sonner";
// import type { NewAdministrationData } from "../page";
// import { Badge } from "@/components/ui/badge"

// interface MedAdministrationProps {
//   selectedMedIds: string[];
//   allOrders: MedicationOrder[];
//   administrationsLookup: { [key: string]: MedAdministrationInstance[] };
//   medicationLookup: { [key: string]: AllMedicationTypes };
//   sessionStartTime: number;
//   realWorldTime: Date;
//   isScanned: boolean;
//   onPtScan: (scan: boolean) => void;
//   newAdministrations: NewAdministrationData;
//   onUpdateAdministration: (orderId: string, field: keyof MedAdministrationInstance, value: string | number) => void;
//   onAdministerMeds: (meds: MedAdministrationInstance[]) => void;
//   onClearAll: () => void;
//   handlePopoverClose: (x: boolean) => void;
//   isOpen: boolean;
//   onOrderRemove: (id: string) => void;
// }

// export function isScannedBadge(isScanned: boolean) {
//   if (isScanned) {
//     return (
//       <Badge className="text-lime-700 h-6 bg-white border-lime-700 rounded-xl gap-2 text-sm font-normal">
//         <UserCheck className="!size-4" />
//         Patient Scanned
//       </Badge>
//     )
//   }
//   return (
//     <Badge className="text-red-700 h-6 border-red-700 bg-white rounded-xl gap-2 text-sm font-normal">
//       <UserMinus className="!size-4" />
//       Patient Not Scanned
//     </Badge>
//   )
// }


// const MedAdministrationPanel = ({
//   selectedMedIds,
//   allOrders,
//   medicationLookup,
//   administrationsLookup,
//   sessionStartTime,
//   realWorldTime,
//   newAdministrations,
//   onUpdateAdministration,
//   isScanned,
//   onPtScan,
//   onAdministerMeds: handleAdministerMeds,
//   isOpen,
//   handlePopoverClose,
//   onOrderRemove
// }: MedAdministrationProps) => {
//   const [isLoading] = useState(false)

//   const hasSelections = selectedMedIds.length > 0;

//   const selectedMedOrders = allOrders.filter(order => {
//     if (selectedMedIds.includes(order.id)) {
//       return order
//     }
//   })

//   const handleFakeScan = (scan: boolean) => {
//     onPtScan(scan)
//   }

//   const handleSubmit = async () => {
//     const payload = Object.keys(newAdministrations).map(orderId => {
//       const currentAdmin = newAdministrations[orderId];
//       const offset = differenceInMinutes(realWorldTime, sessionStartTime);

//       return {
//         ...currentAdmin,
//         medicationOrderId: orderId,
//         administratorId: "StudentID",
//         adminTimeMinuteOffset: offset,
//         status: currentAdmin.status     // status always initialized as 'given' by default
//       };
//     });

//     try {
//       handleAdministerMeds(payload)
//       console.log(payload)
//       handlePopoverClose(false);
//       toast.success("Medications successfully documented");

//     } catch (err) {
//       console.error("Failed to save administrations", err);
//       toast.error("Failed to save administrations");
//     }
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={handlePopoverClose}
//     >
//       <DialogTitle className="sr-only">Medication Administration</DialogTitle>
//       <div className="flex w-full justify-end items-center h-full px-4 gap-12">
//         {isScannedBadge(isScanned)}

//         <DialogTrigger asChild>
//           <Button
//             onClick={() => handlePopoverClose(true)}
//             className="w-fit h-8 bg-lime-500 text-white hover:bg-lime-600 shadow"
//             disabled={!hasSelections}
//           >
//             <PencilLine className="mr-2 h-4 w-4" />
//             <span>Document {selectedMedIds.length > 0 ? `${selectedMedOrders.length} med${selectedMedIds.length > 1 ? 's' : ''}` : ''}</span>
//           </Button>
//         </DialogTrigger>
//       </div>

//       <DialogContent className="flex flex-col sm:max-w-3xl md:max-w-3xl xl:max-w-4xl h-[95vh] bg-gray-200">
//         <div className="flex gap-16 justify-between items-center">
//           <h1 className="text-2xl font-medium">Medication Administration Panel</h1>
//           <div className="flex pr-8 gap-4 items-center">
//             {isScannedBadge(isScanned)}
//             <Button
//               className="w-fit size-6 bg-gray-300"
//               onClick={() => handleFakeScan(!isScanned)}
//             // disabled={isScanned}
//             />
//           </div>
//         </div>
//         <div className=" place-items-start flex-grow overflow-auto bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
//           <div className="grid gap-6 w-full p-6 ">
//             {selectedMedOrders.map(order => {
//               const currentAdminData = newAdministrations[order.id] || { status: "Given", administeredDose: 0 };

//               return (
//                 <MedAdminCard
//                   key={order.id}
//                   order={order}
//                   medication={medicationLookup[order.medicationId]}
//                   administrations={administrationsLookup[order.id]}
//                   sessionStartTime={sessionStartTime}
//                   realWorldNow={realWorldTime}
//                   onOrderRemove={onOrderRemove}

//                   // State Updates
//                   onStatusChange={(value) => {
//                     onUpdateAdministration(order.id, "status", value);
//                   }}
//                   currentStatus={currentAdminData.status ?? "Given"}

//                   onDoseChange={(value) => {
//                     onUpdateAdministration(order.id, "administeredDose", value);
//                   }}
//                   currentDose={currentAdminData.administeredDose}
//                   onCommentChange={(value) => {
//                     onUpdateAdministration(order.id, 'notes', value)
//                   }}
//                   currentComment={currentAdminData.notes || ''}
//                 />
//               )
//             })}
//           </div>
//         </div>
//         <DialogFooter className="flex flex-col items-start sm:justify-between  h-fit w-full">
//           <a
//             href="https://online.lexi.com/lco/action/ivcompatibility/trissels"
//             target="_blank"
//             className="text-blue-800 hover:underline text-sm pl-8"
//           >
//             Trissel&apos;s IV Compatilibity
//           </a>
//           <div className="flex gap-4">
//             <Button
//               disabled={isLoading || !isScanned}
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 shadow"
//             >
//               {isLoading ? "Saving..." : "Accept"}
//             </Button>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default MedAdministrationPanel