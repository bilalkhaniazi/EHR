import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
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
    const [simItems, setSimItems] = useState<SimItem[]>([])
    const [medOrderData, setMedOrdersData] = useState<MedOrderData[]>([])
    const [labOrderData, setLabOrderData] = useState<LabOrderData[]>([])
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const addLabResult = () => {
        setLabOrderData((prev) => [
            ...prev, 
            {
                id: Date.now(),
                labPanelType: ""
            }            
        ])
    };

    const addMedOrder = () => {
        setMedOrdersData((prev) => [
            ...prev,
            {
                id: Date.now(), 
                selectedMed: "",
                dose: "",
                priority: "",
                frequency: "",
                comments: "",
                adminInstructions: "",                
            }])
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

    const removeOrder = (instanceID: number, type: 'medOrder' | 'labOrder') => {
        if(type === 'medOrder'){
            setMedOrdersData(prev => prev.filter(item => item.id != instanceID))
        } else if (type === 'labOrder') {
            setLabOrderData(prev => prev.filter(item => item.id != instanceID))
        }
    };
    

    const submitSimItems = async () => {
        setSubmissionStatus('loading');
        
        const dataToSubmit = {
            labs: labOrderData,
            orders: medOrderData
        }
        console.log(labOrderData, medOrderData)
        try {
            const response = await fetch('api/simstudio', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(dataToSubmit)
            });
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "POST error")
            }

            const responseData = await response.json()
            console.log("Submission successful", responseData)

            setSubmissionStatus('success')
            setLabOrderData([])
            setMedOrdersData([])

        } catch (error: any) {
            console.log("Submission failed", error)
            setSubmissionStatus('error')
        }
    }

    const testGet = async () => {
        try {
            const response = await fetch('api/simstudio')
            if (!response.ok) {
                throw new Error(`GET error ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
        } catch (error: any) {
            console.log('Get failed', error,)
        }
    }

    useEffect (()=> {
        console.log(medOrderData)
    }, [medOrderData])

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar onSubmit={submitSimItems} onAddMedOrder={addMedOrder} onAddOrder={addOrder} onAddLabResult={addLabResult} submissionStatus={submissionStatus} />

            <div className="flex-1 flex flex-col overflow-y-auto gap-y-2 items-center bg-mint-200 border-l-1 border-l-lime-800">
                <button onClick={testGet} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Submit Items</button>

                <div className="w-[95%] flex-1 flex flex-col  mt-2 mb-1 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around w-fit h-fit rounded-tl-lg rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">New Lab Results</h1>
                    </div>
                    <div className="flex flex-1 overflow-x-auto justify-left items-center">
                        {labOrderData.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Click 'Add Lab Result' in the sidebar to begin</p>
                        ) : (
                            labOrderData.map((labOrder)=> (<SimLabResult onUpdate={onLabOrderUpdate} key={labOrder.id} instanceID={labOrder.id} onClose={removeOrder} />)
                        ))}
                    </div>
                </div>
                <div className="w-[95%] flex-1 flex flex-col  mt-2 mb-2 bg-neutral-200 border-1 border-neutral-500 rounded-md shadow-md/30">
                    <div className="flex justify-around  w-fit h-fit rounded-tl-lg rounded-br-lg bg-neutral-300 border-b-1 border-r-1 border-neutral-500 ">
                        <h1 className="p-1 text-lg text-neutral-700 font-bold">New Orders</h1>
                    </div>
                    <div className="flex flex-1 overflow-x-auto justify-left">
                        {medOrderData.length === 0 ? (
                            <p className="h-fit w-fit m-8 text-center text-neutral-500 text-sm">Add Labs and Orders</p>
                        ) : (
                            medOrderData.map((item) => {
                                return(
                                    <SimMedOrder key={item.id} instanceID={item.id} onUpdate={onMedOrderUpdate} onClose={removeOrder}/>
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