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
} from "lucide-react"
import { useState } from "react"
import { type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData";
import MedAdminCard from "./medAdminCard";
import { differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import type { NewAdministrationData } from "../page";
import { Badge } from "@/components/ui/badge"

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

      <Badge className="text-emerald-700 h-6  border-emerald-700 bg-emerald-50 rounded-xl gap-2 text-sm font-normal">
        <UserCheck className="!size-4" />
        Patient Scanned
      </Badge>
    )
  }
  return (
    <Badge className="text-red-700 h-6 border-red-700 bg-red-50 rounded-xl gap-2 text-sm font-normal">
      <UserX className="!size-4" />
      Patient Not Scanned
    </Badge>
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

  const handleFakeScan = (scan: boolean) => {
    onPtScan(scan)
  }

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

      <div className="flex w-full justify-end items-center h-full px-4 gap-12">
        <PatientStatusBadge isScanned={isScanned} />
        <DialogTrigger asChild>
          <Button
            onClick={() => handlePopoverClose(true)}
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2 px-4"
            disabled={!hasSelections}
          >
            <PencilLine className="w-4 h-4" />
            <span className="">Document</span>
            {selectedMedIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-400/80 text-white border-none px-1.5 h-5 min-w-5">
                {selectedMedIds.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="flex flex-col md:max-w-4xl xl:max-w-6xl max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden bg-white border-slate-200">

        <DialogHeader className="px-6 py-4 bg-gray-100 border-b border-gray-300 flex-shrink-0 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-blue-200 rounded-lg text-blue-700">
                  <Pill size={20} fill="white" />
                </div>
                Medication Administration
              </DialogTitle>
            </div>

            <div className="flex items-center gap-3 mr-6">
              <PatientStatusBadge isScanned={isScanned} />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFakeScan(!isScanned)}
                className="text-xs border size-6 border-blue-600 hover:bg-blue-100"
              >
                <ScanBarcode className="text-blue-600" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* {!isScanned && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-2 flex items-start gap-3">
              <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Safety Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  Patient identity has not been verified via barcode scan.
                  Please scan the patient wristband to complete 5 Rights of Medication Administration.
                </p>
              </div>
            </div>
          )} */}

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

        <DialogFooter className=" w-full px-6 py-4 bg-gray-100 border-t border-gray-200  flex-shrink-0 sm:justify-between gap-4 shadow-[0_-2px_15px_-6px_rgba(0,0,0,0.1)]">
          <a
            href="https://online-lexi-com.ezproxy.gvsu.edu/lco/action/ivcompatibility/trissels"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-medium bg-white text-gray-700 hover:text-blue-600 transition-colors hover:bg-bue-50 px-3 py-2 rounded-md border border-gray-300 hover:border-blue-600"
          >
            <ExternalLink size={14} />
            Check IV Compatibility (Trissel&apos;s)
          </a>

          <div className="flex gap-3 justify-between">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 sm:flex-none text-gray-700">
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