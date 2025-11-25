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
import { PencilLine } from "lucide-react"
import { useState } from "react"
import { type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from "./marData";
import MedAdminCard from "./medAdminCard";
import { differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import type { NewAdministrationData } from "../page"; // Ensure this imports the interface from Mar.tsx
import { Badge } from "@/components/ui/badge"

interface MedAdministrationProps {
  selectedMedIds: string[];
  allOrders: MedicationOrder[];
  administrationsLookup: { [key: string]: MedAdministrationInstance[] };
  medicationLookup: { [key: string]: AllMedicationTypes };
  sessionStartTime: number;
  realWorldTime: Date;

  newAdministrations: NewAdministrationData;
  onUpdateAdministration: (orderId: string, field: keyof MedAdministrationInstance, value: string | number) => void;
  onClearAll: () => void;
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
  onClearAll
}: MedAdministrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [isLoading] = useState(false)

  const hasSelections = selectedMedIds.length > 0;

  const selectedMedOrders = allOrders.filter(order => {
    if (selectedMedIds.includes(order.id)) {
      return order
    }
  })


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
      // await submitNewAdministrations({ administrations: payload }).unwrap();
      console.log(payload)
      onClearAll();
      setIsOpen(false);
      setIsScanned(false);

      toast.success("Medications successfully documented");

    } catch (err) {
      console.error("Failed to save administrations", err);
      toast.error("Failed to save administrations");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTitle className="sr-only">Medication Administration</DialogTitle>
      <div className="flex w-full justify-end px-4">
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-fit h-8 bg-lime-500 text-white hover:bg-lime-600 shadow"
            disabled={!hasSelections}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            <span>Document</span>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="flex flex-col md:max-w-4xl xl:max-w-6xl h-[96vh] bg-gray-200">
        <div className="flex gap-16 justify-between items-center">
          <h1 className="text-2xl font-medium">Medication Administration Panel</h1>
          <div className="flex pr-8 gap-4 items-center">
            {isScanned ? (
              <Badge className="text-lime-800 bg-lime-200/50 py-1 px-2 rounded-xl">Patient Scanned</Badge>
            ) : (
              <Badge className="text-red-800 bg-red-200/50 py-1 px-2 rounded-xl">Patient Not Scanned</Badge>
            )}
            <Button
              className="w-fit h-6 bg-lime-500 text-white hover:bg-lime-600 shadow"
              onClick={() => setIsScanned(true)}
              disabled={isScanned}
            >Scan patient
            </Button>
          </div>

        </div>
        <div className="grid place-items-start flex-grow overflow-auto bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
          <div className="grid gap-4 w-full p-2 ">
            {selectedMedOrders.map(order => {
              // Safeguard in case the ID exists in selection but object isn't ready yet
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