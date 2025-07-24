import type { AppDispatch  } from "@/app/store"
import OrdersTable from "./ordersTable"
import { 
    nursingHeaderNames, 
    respHeaderNames, 
    medHeaderNames,
    labratoryHeaderNames,
    type OrderData, 
} from "@/components/orders/orderData"
import { useDispatch  } from "react-redux"
import { addOrder } from "./orderSlice"
import { Button } from "../ui/button"
import { toast } from "sonner"

import { useGetOrdersQuery } from "@/app/apiSlice"
import { Skeleton } from "../ui/skeleton"

const OrdersPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery();
    const nursingOrderData = data?.nursingOrders || []
    const labratoryOrderData = data?.labratoryOrders || []
    const medicationOrderData = data?.medicationOrders || []
    const respiratoryOrderData = data?.respiratoryOrders || []

    // keys for column header names in OrdersTables
    const orderColumns = ["details", "status", "orderingProvider"]
    const medOrderColumns = ["dose",  "route", "frequency", "priority", "administrationInstructions", "orderingProvider"]
    
    // demo new order
    const addNursingOrder = () => {
        const newOrder: OrderData = { displayName: "Turning/Positioning", orderType: "nursing", details: "Reposition patient a minimum of every 2 hours off of pressure points.", status: "Active", orderingProvider: "Dr. Sammy ZamZam"}
        toast.success(`Added ${newOrder.displayName} to Nursing`);
        dispatch(addOrder(newOrder))
    };

    // const addOrder = <T extends Record<string, any>>(
    //     setOrderData: React.Dispatch<React.SetStateAction<T[]>>,
    //     newOrder: T
    // ) => {
    //     setOrderData(prevOrders => [...prevOrders, newOrder]);
    // };

    // const addMedicationOrder = () => {
    //     const newOrder: MedOrderData = {
    //         displayName: "insulin lispro (Humalog)", orderType: "medication", dose: "4 units", route: "Subcutaneous", frequency: "Before Meals", priority: "Routine", administrationInstructions: "Administer 15 minutes before meal based on blood glucose.", orderingProvider: "Dr. Emily White"};
    //         addOrder(setMedicationOrderData, newOrder);
    //         toast.success(`Added ${newOrder.displayName} to Medication`);

    // };

    // const addRespiratoryOrder = () => {
    //     const newOrder: RespiratoryOrderData = {
    //         displayName: "Chest Physiotherapy",
    //         orderType: "respiratory",
    //         details: "Perform chest physiotherapy twice daily.",
    //         status: "Active",
    //         orderingProvider: "Dr. Alex Green"
    //     };
    //     addOrder(setRespiratoryOrderData, newOrder);
    //     toast.success(`Added ${newOrder.displayName} to Respiratory`);
    // };
    if (isLoading || isFetching) {
        return (
            <div className="flex flex-col h-full w-full pt-16 bg-gray-100 justify-start items-center gap-6">
            <Skeleton className="w-5/6 h-16 rounded-xl bg-gray-200" />
            <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
            <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
            <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
            <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col h-full bg-gray-100 justify-center items-center px-4 py-2">
            <p className="text-red-600">Error: {error ? (error as any).message : 'Unknown error'}</p>
            </div>
        );
    }

    return (
        <div className="px-2 py-4 w-full flex-grow flex flex-col gap-4 justify-start items-center bg-gray-100 overflow-y-auto">
            <div className="flex w-full gap-4 justify-center">
                <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addNursingOrder}>Add Nursing Order</Button>
                {/* <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addMedicationOrder}>Add Med Order</Button> */}
                {/* <Button className="bg-gray-200 shadow shadow-black/30 text-black hover:bg-gray-300" onClick={addRespiratoryOrder}>Add Respiratory Order</Button> */}
            </div>
            <div className="flex w-full flex-col gap-4 px-2 pt-3 pb-20 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
                <OrdersTable color="bg-blue-300" columnNames={orderColumns} headerNames={nursingHeaderNames} data={nursingOrderData} />
                <OrdersTable color="bg-red-300" columnNames={medOrderColumns} headerNames={medHeaderNames} data={medicationOrderData} />
                <OrdersTable color="bg-lime-200" columnNames={orderColumns} headerNames={respHeaderNames} data={respiratoryOrderData} />
                <OrdersTable color="bg-fuchsia-200" columnNames={orderColumns} headerNames={labratoryHeaderNames} data={labratoryOrderData} />

            </div>
        </div>
    )
}

export default OrdersPage