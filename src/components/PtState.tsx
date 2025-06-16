import Dropdown from "./Dropdown" 

interface RhythmOption {
    value: string;
    label: string
}

const PtState = () => {

    const rhythms: RhythmOption[] = [
        { value: 'NSR', label: 'Normal Sinus Rhythm (NSR)' },
        { value: 'ST', label: 'Sinus Tachycardia (ST)' },
        { value: 'SB', label: 'Sinus Bradycardia (SB)' },
        { value: 'AFib', label: 'Atrial Fibrillation (AFib)' },
        { value: 'AFlutter', label: 'Atrial Flutter' },
        { value: 'SVT', label: 'Supraventricular Tachycardia (SVT)' },
        { value: 'VT', label: 'Ventricular Tachycardia (VT)' },
        { value: 'VFib', label: 'Ventricular Fibrillation (VFib)' },
        { value: 'Asystole', label: 'Asystole' },
        { value: 'PEA', label: 'Pulseless Electrical Activity (PEA)' },
        { value: 'HeartBlock1', label: '1st Degree Heart Block' },
        { value: 'HeartBlock2M1', label: '2nd Degree Type I (Wenckebach)' },
        { value: 'HeartBlock2M2', label: '2nd Degree Type II' },
        { value: 'HeartBlock3', label: '3rd Degree Heart Block' },
    ];
    
    return (
        <div className="h-fit w-68 flex-shrink-0 rounded-lg my-2 mx-6 border-1 border-neutral-500 shadow-md/30 bg-neutral-300">
            <label htmlFor="ptCond" className="mx-2 text-sm font-medium">Patient Condition</label>
            <input id="ptCond" placeholder="Developing respiratory distress" className="w-[95%]  px-1 py-0.5 mx-2 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" />
            
            <div className="grid grid-cols-[3fr_3fr_4fr] gap-y-3 gap-x-2 mt-3 ">
                <div className="flex items-center ml-2">
                    <label htmlFor="hr" className="mr-1 text-sm font-medium">HR</label>
                    <input type="number" id="hr" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm/20 focus:outline-none focus:border-2" placeholder="68" min="0" />
                </div>
                <div className="flex items-center">
                    <label htmlFor="rr" className="mr-1 text-sm font-medium">RR</label>
                    <input type="number" id="rr" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="16" min="0" />
                </div>
                <div className="flex items-center mr-2">
                    <label htmlFor="spo2" className="mr-1 text-sm font-medium">SpO2</label>
                    <input type="number" id="spo2" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="98" min="0" />
                </div>
                
                <div className="flex flex-col items-center ml-2">
                    <div className="flex flex-col">
                    <label htmlFor="SBP" className="mr-1 text-sm font-medium">BP</label>
                    <input type="number" id="SBP" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="116" min="0" />
                    <input type="number" id="DBP" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="74" min="0" />                
                    </div>
                </div>
                <div className="col-span-2 mr-2 flex flex-col h-20">
                    <label className="mr-1 text-sm font-medium">Cardiac Rhythm</label>
                    <Dropdown dropDownContents={ rhythms }/>
                </div>
            </div>
            <label htmlFor="ptCond" className="mx-2  text-sm font-medium">Facilitator Prompts</label>
            <textarea id="ptCond" className="w-[95%] px-1 py-0.5 mx-2 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" />
        </div>
    )
} 

export default PtState