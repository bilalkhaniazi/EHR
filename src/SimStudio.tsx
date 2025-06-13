import { useState } from "react"
import Sidebar from "./components/Sidebar"
import PtState from "./components/PtState"
import SimMedOrder from "./components/SimMedOrder";
import PtOrder from "./components/PtOrder";

export interface LabOrderItem {
  id: number;
  type: 'lab' | 'order';
}

const SimStudio = () => {
    const [ptStates, setPtStates] = useState<number[]>([])
    const [simItems, setSimItems] = useState<LabOrderItem[]>([])

    const addPtState = () => {
        setPtStates((prevStates) => [...prevStates, Date.now()]);
    }

    const addLab = () => {
        setSimItems((prevItems) => [...prevItems, { id: Date.now(), type: 'lab' }])
    }

    const addMedOrder = () => {
        setSimItems((prevItems) => [...prevItems, { id: Date.now(), type: 'order' }])
    }

    return (
        <div className="flex flex-1">
            <Sidebar onAddPtState={addPtState} onAddLab={addLab} onAddMedOrder={addMedOrder} />

            <div className="flex-1 flex flex-col items-center overflow-hidden bg-mint-200 border-l-1 border-l-lime-800">

                <div className="w-[95%] h-[48%] flex flex-col overflow-hidden mt-2 mb-1 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around w-fit h-fit rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">Expected patient states</h1>
                    </div>
                    <div className="relative flex flex-1 min-h-0 overflow-x-auto overflow-y-auto justify-left">
                        {ptStates.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Click 'Add Patient State' in the sidebar to begin</p>
                        ) : (
                            ptStates.map((stateID)=> (<PtState key={stateID} />)
                        ))}

                    </div>
                </div>
                <div className="w-[95%] h-[48%] flex flex-col overflow-hidden mt-2 mb-1 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around  w-fit h-fit rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">Orders and Labs</h1>
                    </div>
                    <div className="flex flex-1 min-h-0 overflow-x-auto overflow-y-auto justify-left">
                        {simItems.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Add Labs and Orders</p>
                        ) : (
                            simItems.map((item) => (item.type === 'lab' ? 
                                <SimMedOrder key={item.id} /> : <PtOrder key={item.id} />)
                        ))}

                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default SimStudio