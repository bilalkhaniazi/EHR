'use client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogTitle
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { PencilLine, UserCheck, UserMinus } from "lucide-react"
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
}

export function isScannedBadge(isScanned: boolean) {
  if (isScanned) {
    return (
      <Badge className="text-lime-700 h-6 bg-white border-lime-700 rounded-xl gap-2 text-sm font-medium">
        <UserCheck className="!size-4" />
        Patient Scanned
      </Badge>
    )
  }
  return (
    <Badge className="text-red-700 h-6 border-red-700 bg-white rounded-xl gap-2 text-sm font-medium">
      <UserMinus className="!size-4" />
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
    <Dialog
      open={isOpen}
      onOpenChange={handlePopoverClose}
    >
      <DialogTitle className="sr-only">Medication Administration</DialogTitle>
      <div className="flex w-full justify-end items-center h-full px-4 gap-12">
        {isScannedBadge(isScanned)}

        <DialogTrigger asChild>
          <Button
            onClick={() => handlePopoverClose(true)}
            className="w-fit h-8 bg-lime-500 text-white hover:bg-lime-600 shadow"
            disabled={!hasSelections}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            <span>Document {selectedMedIds.length > 0 ? `${selectedMedOrders.length} med${selectedMedIds.length > 1 ? 's' : ''}` : ''}</span>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="flex flex-col sm:max-w-3xl md:max-w-3xl xl:max-w-4xl h-[95vh] bg-gray-200">
        <div className="flex gap-16 justify-between items-center">
          <h1 className="text-2xl font-medium">Medication Administration Panel</h1>
          <div className="flex pr-8 gap-4 items-center">
            {isScannedBadge(isScanned)}
            <Button
              className="w-fit size-6 bg-gray-300"
              onClick={() => handleFakeScan(!isScanned)}
            // disabled={isScanned}
            />
          </div>
        </div>
        <div className=" place-items-start flex-grow overflow-auto bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
          <div className="grid gap-6 w-full p-6 ">
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
        <DialogFooter className="flex flex-col items-start sm:justify-between  h-fit w-full">
          <a
            href="https://online.lexi.com/lco/action/ivcompatibility/trissels"
            target="_blank"
            className="text-blue-800 hover:underline text-sm pl-8"
          >
            Trissel&apos;s IV Compatilibity
          </a>
          <div className="flex gap-4">
            <Button
              disabled={isLoading || !isScanned}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 shadow"
            >
              {isLoading ? "Saving..." : "Accept"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MedAdministrationPanel