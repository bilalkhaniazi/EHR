import OrdersTable from "./ui/ordersTable"
import { 
    nursingOrders,
    nursingHeaderNames, 
    respiratoryOrders, 
    respHeaderNames, 
    medHeaderNames,
    labratoryOrders,
    labratoryHeaderNames, 
    type NursingOrderData,
    type MedOrderData,
    type RespiratoryOrderData,
    // type LabratoryOrderData,
} from "@/components/orderData"
import { medOrders } from "@/components/orderData"
import { useState } from "react"
import { Button } from "./ui/button"
import { Toaster, toast } from "sonner"

const OrdersPage = () => {
    const nursingOrderColumns = ["details", "status", "orderingProvider"]
    const medOrderColumns = ["dose",  "route", "frequency", "priority", "administrationInstructions", "orderingProvider"]
    const respOrderColumns = ["details", "status", "orderingProvider"]

    const [nursingOrderData, setNursingOrderData] = useState(nursingOrders)
    const [medicationOrderData, setMedicationOrderData] = useState(medOrders)
    const [respiratoryOrderData, setRespiratoryOrderData] = useState(respiratoryOrders)
    const [labratoryOrderData] = useState(labratoryOrders)


    const addOrder = <T extends Record<string, any>>(
        setOrderData: React.Dispatch<React.SetStateAction<T[]>>,
        newOrder: T
    ) => {
        setOrderData(prevOrders => [...prevOrders, newOrder]);
    };

    const addNursingOrder = () => {
        const newOrder: NursingOrderData = { displayName: "Turning/Positioning", orderType: "nursing", details: "Reposition patient a minimum of every 2 hours off of pressure points.", status: "Active", orderingProvider: "Dr. Sammy ZamZam"}
        toast.success(`Added ${newOrder.displayName} to Nursing`);
        addOrder(setNursingOrderData, newOrder)
    };

    const addMedicationOrder = () => {
        const newOrder: MedOrderData = {
            displayName: "insulin lispro (Humalog)", orderType: "medication", dose: "4 units", route: "Subcutaneous", frequency: "Before Meals", priority: "Routine", administrationInstructions: "Administer 15 minutes before meal based on blood glucose.", orderingProvider: "Dr. Emily White"};
            addOrder(setMedicationOrderData, newOrder);
            toast.success(`Added ${newOrder.displayName} to Medication`);

    };

    const addRespiratoryOrder = () => {
        const newOrder: RespiratoryOrderData = {
            displayName: "Chest Physiotherapy",
            orderType: "respiratory",
            details: "Perform chest physiotherapy twice daily.",
            status: "Active",
            orderingProvider: "Dr. Alex Green"
        };
        addOrder(setRespiratoryOrderData, newOrder);
        toast.success(`Added ${newOrder.displayName} to Respiratory`);
    };

    return (
        <div className="px-2 w-full h-screen flex flex-col gap-4 justify-start items-center bg-gray-100">
            <Toaster position="top-right" />
            <div className="flex w-full gap-4 justify-center">
                <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addNursingOrder}>Add Nursing Order</Button>
                <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addMedicationOrder}>Add Med Order</Button>
                <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addRespiratoryOrder}>Add Respiratory Order</Button>
            </div>
            <div className="flex w-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
                <OrdersTable color="bg-blue-300" columnNames={nursingOrderColumns} headerNames={nursingHeaderNames} data={nursingOrderData} />
                <OrdersTable color="bg-red-300" columnNames={medOrderColumns} headerNames={medHeaderNames} data={medicationOrderData} />
                <OrdersTable color="bg-lime-200" columnNames={respOrderColumns} headerNames={respHeaderNames} data={respiratoryOrderData} />
                <OrdersTable color="bg-fuschia-200" columnNames={respOrderColumns} headerNames={labratoryHeaderNames} data={labratoryOrderData} />

            </div>
        </div>
    )
}

export default OrdersPage