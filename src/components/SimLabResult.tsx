
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown" 

interface LabPanel {
    value: string,
    label: string
};

interface LabValuesState {
    [key: string] : string | number
}

interface SimLabResultProps {
    instanceID: number
}

const SimLabResult: React.FC<SimLabResultProps> = ({ instanceID }) => {
    const [labType, setLabType] = useState<string>("")
    const [labValues, setLabValues] = useState<LabValuesState>({})
    
    const handleSelect = (value: string) => {
        setLabType(value)
    }

    const handleLabValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setLabValues(prevLabValues => ({
            ...prevLabValues, [id]: value,
        }))
    };

    useEffect(() => {
        if (labType && labMap[labType]) {
            const initialValues: LabValuesState = {};
            labMap[labType].forEach(item => {
                const uniqueKey = `${item}-${instanceID}`
                initialValues[uniqueKey] = 0; 
            });
            setLabValues(initialValues);
        }
    }, [labType]);

    useEffect(() => {
        console.log(labValues)
    }, [labValues])
    
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