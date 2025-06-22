import Dropdown from "./Dropdown"
import { useEffect, useState } from "react";
import type { MedOrderData } from "../SimStudio";

interface dropdownOption {
    value: string;
    label: string;
}

interface SimMedOrderProps {
    instanceID: number
    onUpdate: (data: MedOrderData) => void
}

const SimMedOrder: React.FC<SimMedOrderProps> = ({ instanceID, onUpdate }) => {
    const [selectedMed, setSelectedMed] = useState<string>("")
    const [dose, setDose] = useState<string>("")
    const [priority, setPriority] = useState<string>("")
    const [frequency, setFrequency] = useState<string>("")
    const [comments, setComments] = useState<string>("")
    const [adminInstructions, setAdminInstructions] = useState<string>("")

    const handleMedChange = (value: string) => setSelectedMed(value);
    const handleDoseChange = (e: React.ChangeEvent<HTMLInputElement>) => setDose(e.target.value);
    const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriority(e.target.value);
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.target.value);
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)
    const handleAdminInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminInstructions(e.target.value)

    useEffect(() => {
        const currentOrderData: MedOrderData = {
            id: instanceID,
            selectedMed,
            dose,
            priority,
            frequency,
            comments,
            adminInstructions
        };
        onUpdate(currentOrderData)
    }, [selectedMed, dose, priority, frequency, comments, adminInstructions])

    const meds: dropdownOption[] = [
        { value: '1', label: 'Select a Medication' }, // Placeholder option
        { value: 'acetaminophen', label: 'Acetaminophen (Tylenol)' },
        { value: 'ibuprofen', label: 'Ibuprofen (Advil, Motrin)' },
        { value: 'aspirin', label: 'Aspirin' },
        { value: 'morphine', label: 'Morphine' },
        { value: 'fentanyl', label: 'Fentanyl' },
        { value: 'ondansetron', label: 'Ondansetron (Zofran)' },
        { value: 'albuterol', label: 'Albuterol' },
        { value: 'ceftriaxone', label: 'Ceftriaxone (Rocephin)' },
        { value: 'vancomycin', label: 'Vancomycin' },
        { value: 'insulin', label: 'Insulin' },
        { value: 'epinephrine', label: 'Epinephrine' },
        { value: 'norepinephrine', label: 'Norepinephrine (Levophed)' },
        { value: 'heparin', label: 'Heparin' },
        { value: 'lisinopril', label: 'Lisinopril' },
        { value: 'metoprolol', label: 'Metoprolol' },
        { value: 'amiodarone', label: 'Amiodarone' },
    ];
    return (
        <div className="h-fit w-76 flex-shrink-0 rounded-lg my-2 mx-6 border-1 border-neutral-500 shadow-md/30 bg-neutral-300">
            <p className="mx-2 text-sm font-medium">Medication Order</p>
            <div className="grid grid-cols-4 gap-y-2">
                <div className="mx-2 col-span-3">
                    <Dropdown dropDownContents={meds} instanceID={instanceID} selectedValue={selectedMed} onSelect={handleMedChange} />
                </div>
                <div className=" col-span-2 mx-2">
                    <p className="text-sm font-medium">Dose</p>
                    <div className="flex">
                        <input type="number" id={`dose-${instanceID}`} onChange={handleDoseChange} className="w-[95%] h-fit px-1 py-0.5 bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" min="0" />
                        <p className="text-neutral-800 text-sm">mg</p>
                    </div>
                </div>
                <div className="col-span-2 mx-2">
                    <p className="text-sm font-medium">Priority</p>
                    <input id={`priority-${instanceID}`} onChange={handlePriorityChange} className="w-[95%] px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="NOW" />
                </div>
                <div className="col-span-2 mx-2">
                    <p className="text-sm font-medium">Frequency</p>
                    <input id={`freq-${instanceID}`} onChange={handleFrequencyChange} className="w-[95%] px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="Once" />
                </div>
                <div className="col-span-4 mx-2">
                    <p className="text-sm font-medium">Comments</p>
                    <textarea id={`comments-${instanceID}`} onChange={handleCommentChange} className="w-full h-8 px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" />
                </div>
                <div className="col-span-4 mx-2">
                    <p className="text-sm font-medium">Administration Instructions</p>
                    <textarea id={`instruct-${instanceID}`} onChange={handleAdminInstructionChange} className="w-full  px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="Administer for sustained HR of >150 bpm." />
                </div>
            </div>
            
        </div>
    )
} 

export default SimMedOrder