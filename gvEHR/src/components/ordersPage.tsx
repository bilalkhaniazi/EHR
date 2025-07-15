import OrdersTable from "./ui/ordersTable"
import { nursingOrders, nursingHeaderNames, respiratoryOrders, respHeaderNames, medHeaderNames, type NursingOrderData } from "@/orderData"
import { medOrders } from "@/orderData"
import { useState } from "react"
import { Button } from "./ui/button"

const OrdersPage = () => {
    const nursingOrderColumns = ["details", "status", "orderingProvider"]
    const medOrderColumns = ["dose",  "route", "frequency", "priority", "administrationInstructions", "orderingProvider"]
    const respOrderColumns = ["details", "status", "orderingProvider"]

    const [nursingOrderData, setNursingOrderData] = useState(nursingOrders)

    const addOrder = <T extends Record<string, any>>(
        setOrderData: React.Dispatch<React.SetStateAction<T[]>>,
        newOrder: T
    ) => {
        setOrderData(prevOrders => [...prevOrders, newOrder]);
    };
    
    const addNursingOrder = () => {
        const newOrder: NursingOrderData = { displayName: "Turning/Positioning", orderType: "nursing", details: "Reposition patient a minimum of every 2 hours off of pressure points.", status: "Active", orderingProvider: "Dr. Sammy ZamZam"}
        addOrder(setNursingOrderData, newOrder)
    };

    return (
        <div className="p-4 w-full h-screen overflow-y-auto flex flex-col gap-6 justify-start items-center bg-gray-100">
            <Button className="bg-gray-200 shadow shadow-black/30" onClick={addNursingOrder}  />
            <OrdersTable color="bg-blue-300" columnNames={nursingOrderColumns} headerNames={nursingHeaderNames} data={nursingOrderData} />
            <OrdersTable color="bg-red-300" columnNames={medOrderColumns} headerNames={medHeaderNames} data={medOrders} />
            <OrdersTable color="bg-lime-200" columnNames={respOrderColumns} headerNames={respHeaderNames} data={respiratoryOrders} />
        </div>
    )
}

export default OrdersPage