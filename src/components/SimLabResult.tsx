
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown" 
import type { LabOrderData } from "../SimStudio";

interface LabPanel {
    value: string,
    label: string
};

interface LabValuesState {
    id: number;
    labPanelType: string;
    [key: string] : string | number
}

interface SimLabResultProps {
    instanceID: number;
    onUpdate: (data: LabOrderData) => void;
}

const SimLabResult: React.FC<SimLabResultProps> = ({ instanceID, onUpdate }) => {
    const [labType, setLabType] = useState<string>("")
    const [labValues, setLabValues] = useState<LabValuesState>({
        id: instanceID,
        labPanelType: ""
    });
    
    const handleSelect = (selectedLabType: string) => {
        setLabType(selectedLabType)
        const baseValues: LabValuesState = {
            id: instanceID,
            labPanelType: selectedLabType
        }

        if (labMap[selectedLabType]) {
            labMap[selectedLabType].forEach(item => {
                baseValues[item] = 0
            })
        };
        setLabValues(baseValues)
    };

    const handleLabValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        const [labItem] = id.split('-');

        setLabValues(prevLabValues => ({
            ...prevLabValues, [labItem]: value,
        }))
    };

    useEffect(() =>{
        onUpdate(labValues)
    }, [labValues]
    );
    
    // useEffect(() => {
    //     console.log(labValues)
    // }, [labValues])
    
    const LabPanels: Array<LabPanel> = [
        { value: '', label: 'Select Lab Panel' },
        { value: 'cbc', label: 'Complete Blood Count (CBC)' },
        { value: 'bmp', label: 'Basic Metabolic Panel (BMP)' },
        { value: 'handh', label: 'Hemoglobin and Hematocrit (H&H)' },
        { value: 'cardiac', label: 'Cardiac Enzymes' },
    ];

    const labMap: { [key: string]: string[] } = {
        "cbc": ['WBC', 'RBC', 'Hgb', 'Hct', 'MCV', 'MCH', 'MCHC', 'Plt'],
        "bmp": ['Na', 'K', 'Cl', 'HCO₃–', 'BUN', 'Cr', 'Glc', 'Ca'],
        "handh": ['Hgb', 'Hct'],
        "cardiac": ['Troponin I', 'CK-MB', 'Myoglobin']
    };
    
    return (
        
        <div className="h-fit w-84 flex-shrink-0 rounded-lg my-2 mx-6 border-1 border-neutral-500 shadow-md/30 bg-neutral-300">
            <div className="w-[95%] mx-2 mb-2">
                <p className="text-md font-medium">Lab Result</p>
                <Dropdown selectedValue={labType} onSelect={handleSelect} dropDownContents={LabPanels} instanceID={instanceID}/>
            </div>
            
            {labType && labMap[labType] && (
                <>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-4 mx-2 my-2">
                        {labMap[labType].map((item, index) => (                        
                            <div className=""  key={`${item}-${instanceID}`}>
                                <p className="text-sm font-medium">{item}</p>
                                <input type="number" id={`${item}-${instanceID}`} onChange={handleLabValueChange} className="w-[95%] h-fit px-1 py-0.5 bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" min="0" />
                            </div>
                        ))}
                    </div>
                    <p className="mx-2 text-sm font-medium">Comments</p>
                    <textarea id={`ptCond-${instanceID}`} className="w-[95%] h-12 px-1 py-0.5 mx-2 resize-none text-md bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" />
                </>
            )}
        </div>
    )
} 

export default SimLabResult