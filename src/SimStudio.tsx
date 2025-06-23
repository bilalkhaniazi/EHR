import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import PtState from "./components/PtState"
import SimMedOrder from "./components/SimMedOrder";
import PtOrder from "./components/PtOrder";
import SimLabResult from "./components/SimLabResult";

export interface SimItem {
  id: number;
  type: 'medOrder' | 'order';
}

export interface MedOrderData {
    id: number;
    selectedMed: string;
    dose: string;
    priority: string;
    frequency: string;
    comments: string;
    adminInstructions: string;
}

export interface LabOrderData {
    id: number;
    labPanelType: string
    [index: string]: string | number;
}

const SimStudio = () => {
    const [simLabs, setSimLabs] = useState<number[]>([])
    // const [ptStates, setPtStates] = useState<number[]>([])
    const [simItems, setSimItems] = useState<SimItem[]>([])
    const [medOrderData, setMedOrdersData] = useState<MedOrderData[]>([])
    const [labOrderData, setLabOrderData] = useState<LabOrderData[]>([])

    const addPtState = () => {
        setPtStates((prevStates) => [...prevStates, Date.now()]);
    }

    const addLabResult = () => {
        setSimLabs((prevLabs) => [...prevLabs, Date.now()])
    }

    const addMedOrder = () => {
        setSimItems((prevItems) => [...prevItems, { id: Date.now(), type: 'medOrder' }])
    }

    const addOrder = () => {
        setSimItems((prevItems) => [...prevItems, { id: Date.now(), type: 'order' }])
    }
    
    const onMedOrderUpdate = (updatedOrder: MedOrderData) => {
        setMedOrdersData(prevOrders => {
            const existingIndex = prevOrders.findIndex(order => order.id === updatedOrder.id)

            if (existingIndex > -1) { 
                const newOrders = [...prevOrders]
                newOrders[existingIndex] = updatedOrder
                return newOrders
            } else {
                return [...prevOrders, updatedOrder]
            }
        });
    }

    const onLabOrderUpdate = (updatedOrder: LabOrderData) => {
        setLabOrderData(prevOrders => {
            const existingIndex = prevOrders.findIndex(order => order.id === updatedOrder.id)

            if (existingIndex > -1) { 
                const newOrders = [...prevOrders]
                newOrders[existingIndex] = updatedOrder
                return newOrders
            } else {
                return [...prevOrders, updatedOrder]
            }
        });
    }
    // const onLabOrderUpdate = (updatedOrder: LabOrderData) => {
    //     setLabOrderData(prevOrders => {

    //     })
    // }

    useEffect (()=> {
        console.log(labOrderData)
    }, [labOrderData])

    const componentMap = {
        medOrder: SimMedOrder,
        order: PtOrder,
        labResult: SimLabResult
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar onAddPtState={addPtState} onAddMedOrder={addMedOrder} onAddOrder={addOrder} onAddLabResult={addLabResult} />

            <div className="flex-1 flex flex-col overflow-y-auto gap-y-2 items-center bg-mint-200 border-l-1 border-l-lime-800">

                <div className="w-[95%] flex-1 flex flex-col  mt-2 mb-1 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around w-fit h-fit rounded-tl-lg rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">New Lab Results</h1>
                    </div>
                    <div className="flex flex-1 overflow-x-auto justify-left items-center">
                        {simLabs.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Click 'Add Lab Result' in the sidebar to begin</p>
                        ) : (
                            simLabs.map((stateID)=> (<SimLabResult onUpdate={onLabOrderUpdate} key={stateID} instanceID={stateID} />)
                        ))}
                    </div>
                </div>
                <div className="w-[95%] flex-1 flex flex-col  mt-2 mb-2 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around  w-fit h-fit rounded-tl-lg rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">New Orders</h1>
                    </div>
                    <div className="flex flex-1 overflow-x-auto justify-left">
                        {simItems.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Add Labs and Orders</p>
                        ) : (
                            simItems.map((item) => {
                                const SimItem = componentMap[item.type]
                                return(
                                    <SimItem key={item.id} instanceID={item.id} onUpdate={onMedOrderUpdate}/>
                                )
                            }))
                        }

                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default SimStudio