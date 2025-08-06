import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "../ui/dialog"

import { Button } from "../ui/button"
import { PencilLine } from "lucide-react"
import { useState } from "react"
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./marData";
import MedAdminCard from "./medAdminCard";
import { updateNewAdministration, clearNewAdminstrations, clearSelectedMedications } from "./marSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { useSubmitNewAdministrationsMutation } from "@/app/apiSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  const newAdministrations = useSelector((state: RootState) => state.mar.newAdministrations);
  console.log(newAdministrations)
  const hasSelections = selectedMedIds.length > 0;
  const selectedMedOrders = allOrders.filter(order => {
    if (selectedMedIds.includes(order.id)) {
      return order
    }
  })
  const [submitNewAdministrations] = useSubmitNewAdministrationsMutation();

  const handleSubmit = async () => {
    // Logic to assemble the final payload, adding the time offset and student ID
    const payload = Object.keys(newAdministrations).map(orderId => {
      const currentAdmin = newAdministrations[orderId];
      const offset = Math.floor((realWorldTime.getTime() - sessionStartTime) / 60000);

      return {
        ...currentAdmin,
        medicationOrderId: orderId,
        administratorId: "StudentID", // Or from slice that user data is stored
        adminTimeMinuteOffset: offset,
        status: currentAdmin.status ?? "Held" // need to add check that status is never undefined
      };
    });
    console.log(payload)

    try {
      await submitNewAdministrations({administrations: payload}).unwrap();    // dummy rtk query updating marSlice administrations array
      dispatch(clearNewAdminstrations());
      setIsOpen(false);
      dispatch(clearSelectedMedications())

    } catch (err) {
      console.error("Failed to save administrations", err);
    }
  };
  
  return (
    <Dialog 
      open={isOpen}
      onOpenChange={setIsOpen}
    >
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

      <DialogContent className="flex flex-col md:max-w-3xl xl:max-w-5xl h-[96vh] bg-gray-200">
        <h1 className="text-lg  font-medium">Medication Something</h1>
        <div className="grid place-items-start flex-grow overflow-auto bg-gray-100 rounded-lg border border-gray-300">
          <div className="grid gap-4 w-full p-2 ">
            {selectedMedOrders.map(order => {
              return (
                <MedAdminCard
                  order={order}
                  medication={medicationLookup[order.medicationId]}
                  administrations={administrationsLookup[order.id]}
                  sessionStartTime={sessionStartTime}
                  onStatusChange={(value) => {
                    dispatch(updateNewAdministration({
                      medicationOrderId: order.id,
                      field: "status",
                      value: value,
                    }))
                  }}
                  currentStatus={newAdministrations[order.id]?.status || "Given"}
                />
              )
            })}
          </div>
        </div>
        
        <DialogFooter className="items-center h-fit">
          <Button variant="outline" onClick={handleSubmit}>Accept</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MedAdministrationPanel