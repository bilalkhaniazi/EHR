import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../ui/dialog"

import { Button } from "../ui/button"
import { PencilLine } from "lucide-react"
import { useState } from "react"
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./marData";
import MedAdminCard from "./medAdminCard";

interface MedAdministrationProps {
  selectedMedIds: string[];
  allOrders: MedicationOrder[];
  administrationsLookup: { [key: string]: MedAdministrationInstance[] };
  medicationLookup: {[key: string] : AllMedicationTypes};
  sessionStartTime: number;
}


const MedAdministrationPanel = ({ selectedMedIds, allOrders, medicationLookup, administrationsLookup, sessionStartTime }: MedAdministrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSelections = selectedMedIds.length > 0;

  const selectedMedOrders = allOrders.filter(order => {
    if (selectedMedIds.includes(order.id)) {
      return order
    }
  })
  
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
                />
            )
          })}

         </div>
        </div>
        
        
        <DialogFooter className="items-center h-fit">
          <Button variant="outline">Accept</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MedAdministrationPanel