import CardiacRhythmDropdown from "./cardiacDropdown"

const PtState = () => {
    
    return (
        <div className="absolute h-fit w-68 flex-shrink-0 rounded-lg my-2 mx-6 border-1 border-neutral-500 shadow-md/30 bg-neutral-300">
            <label htmlFor="ptCond" className="mx-2 text-sm font-medium">Patient Condition</label>
            <textarea id="ptCond" placeholder="Developing respiratory distress" className="w-[95%] h-12 px-1 py-0.5 mx-2 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" />
            
            <div className="grid grid-cols-[3fr_3fr_4fr] gap-y-6 my-3 ">
                <div className="flex items-center ml-2">
                    <label htmlFor="hr" className="mr-1 text-sm font-medium">HR</label>
                    <input type="number" id="hr" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm/20 focus:outline-none focus:border-2" placeholder="68" min="0" />
                </div>
                <div className="flex items-center ml-2">
                    <label htmlFor="rr" className="mr-1 text-sm font-medium">RR</label>
                    <input type="number" id="rr" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="16" min="0" />
                </div>
                <div className="flex items-center mx-2">
                    <label htmlFor="spo2" className="mr-1 text-sm font-medium">SpO2</label>
                    <input type="number" id="spo2" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="98" min="0" />
                </div>
                
                <div className="flex flex-col items-center mx-2">
                    <div className="flex flex-col">
                    <label htmlFor="SBP" className="mr-1 text-sm font-medium">BP</label>
                    <input type="number" id="SBP" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="116" min="0" />
                    <input type="number" id="DBP" className="w-[95%] h-fit px-1 py-0.5 text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="74" min="0" />                
                    </div>
                </div>
                <div className="col-span-2 mr-2 flex flex-col h-20">
                    <label className="mr-1 text-sm font-medium">Cardiac Rhythm</label>
                    <CardiacRhythmDropdown />
                </div>
            </div>
            <label htmlFor="ptCond" className="mx-2  text-sm font-medium">Facilitator Prompts</label>
            <textarea id="ptCond" className="w-[95%] h-20 px-1 py-0.5 mx-2 resize-y text-md bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" />
        </div>
    )
} 

export default PtState