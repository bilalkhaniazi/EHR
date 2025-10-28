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
import { updateNewAdministration, clearNewAdminstrations, clearSelectedMedications } from "./marSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
// import { useSubmitNewAdministrationsMutation } from "@/app/store/apiSlice";
import { differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import { useSubmitNewAdministrationsMutation } from "@/app/store/apiSlice"

interface MedAdministrationProps {
  selectedMedIds: string[];
  allOrders: MedicationOrder[];
  administrationsLookup: { [key: string]: MedAdministrationInstance[] };
  medicationLookup: {[key: string] : AllMedicationTypes};
  sessionStartTime: number;
  realWorldTime: Date
}


const MedAdministrationPanel = ({
  selectedMedIds,
  allOrders,
  medicationLookup,
  administrationsLookup,
  sessionStartTime,
  realWorldTime
}: MedAdministrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const newAdministrations = useSelector((state: RootState) => state.mar.newAdministrations);
  console.log(newAdministrations)

  const hasSelections = selectedMedIds.length > 0;
  
  const selectedMedOrders = allOrders.filter(order => {
    if (selectedMedIds.includes(order.id)) {
      return order
    }
  })


  const [submitNewAdministrations, {isLoading}] = useSubmitNewAdministrationsMutation();

  // sending the new medAdministrationInstance to the backend
  const handleSubmit = async () => {
    // Logic to assemble the final payload, adding the time offset and student ID
    const payload = Object.keys(newAdministrations).map(orderId => {
      const currentAdmin = newAdministrations[orderId];
      const offset = differenceInMinutes(realWorldTime, sessionStartTime);

      return {
        ...currentAdmin,
        medicationOrderId: orderId,
        administratorId: "StudentID", // Or from slice that user data is stored
        adminTimeMinuteOffset: offset,
        status: currentAdmin.status     // status always initialized as 'given' by default 
      };
    });

    try {
      await submitNewAdministrations({administrations: payload}).unwrap();    // dummy rtk query updating marSlice administrations array for testing
      dispatch(clearNewAdminstrations());
      setIsOpen(false);
      dispatch(clearSelectedMedications())
      toast.success("Medications successfully documented");

    } catch (err) {
      console.error("Failed to save administrations", err);
    }
  };
  
  return (
    <Dialog 
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTitle></DialogTitle>
      <div className="flex w-full justify-end px-4">
        <DialogTrigger asChild>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-fit h-6 bg-lime-500 text-white hover:bg-lime-600 shadow"
            disabled={!hasSelections}
          >
            <PencilLine />
            <span>Document</span>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="flex flex-col md:max-w-4xl xl:max-w-6xl h-[96vh] bg-gray-200">
        <div className="flex gap-16 justify-between items-center">
          <h1 className="text-2xl font-medium">Medication Administration Panel</h1>
          <div className="flex pr-8 gap-4 items-center">
            {isScanned ? (
              <p className="text-lime-800 bg-lime-200/50 py-1 px-2 rounded-xl">Patient Scanned</p>
            ) : (
              <p className="text-red-800 bg-red-200/50 py-1 px-2 rounded-xl">Patient Not Scanned</p>
            )}
            <Button 
              className="w-fit h-6 bg-lime-500 text-white hover:bg-lime-600 shadow"
              onClick={() => setIsScanned(true)}
              disabled={isScanned}
            >Scan patient
            </Button>  
          </div>

        </div>
        <div className="grid place-items-start flex-grow overflow-auto bg-gray-100 rounded-lg border border-gray-300">
          <div className="grid gap-4 w-full p-2 ">
            {selectedMedOrders.map(order => {
              return (
                <MedAdminCard
                  key={order.id}
                  order={order}
                  medication={medicationLookup[order.medicationId]}
                  administrations={administrationsLookup[order.id]}
                  sessionStartTime={sessionStartTime}
                  realWorldNow={realWorldTime}
                  onStatusChange={(value) => {
                    dispatch(updateNewAdministration({
                      medicationOrderId: order.id,
                      field: "status",    // the property of a medAdministrationInstance that is being updated, could add another prop for 'notes' 
                      value: value,
                    }))
                  }}
                  currentStatus={newAdministrations[order.id].status ?? "Given"}    // will always be "Given" by default, set in MarSlice
                  onDoseChange={(value) => {
                    dispatch(updateNewAdministration({
                      medicationOrderId: order.id,
                      field: "administeredDose",
                      value: value,
                    }))
                  }}
                  currentDose={newAdministrations[order.id].administeredDose}
                />
              )
            })}
          </div>
        </div>
        <DialogFooter className="items-center h-fit">
          <Button variant="outline" disabled={isLoading || !isScanned} onClick={handleSubmit}>{isLoading ? "Saving..." : "Accept"}</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MedAdministrationPanel