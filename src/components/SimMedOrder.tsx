import Dropdown from "./Dropdown"

interface dropdownOption {
    value: string;
    label: string;
}

const SimMedOrder = () => {
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
            <label className="mx-2 text-sm font-medium">Medication Order</label>
            <div className="grid grid-cols-4 gap-y-2">
                <div className="mx-2 col-span-3">
                    <Dropdown dropDownContents={meds} />
                </div>
                <div className=" col-span-2 mx-2">
                    <label htmlFor="dose" className="mr-1 text-sm font-medium">Dose</label>
                    <div className="flex">
                        <input type="number" id="dose" className="w-[95%] h-fit px-1 py-0.5 bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" min="0" />
                        <p className="text-neutral-800 text-sm">mg</p>
                    </div>
                </div>
                <div className="col-span-2 mx-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <input id="priority" className="w-[95%] px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="NOW" />
                </div>
                <div className="col-span-2 mx-2">
                    <label htmlFor="freq" className="text-sm font-medium">Frequency</label>
                    <input id="freq" className="w-[95%] px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="Once" />
                </div>
                <div className="col-span-4 mx-2">
                    <label htmlFor="comments" className="text-sm font-medium">Comments</label>
                    <textarea id="comments" className="w-full h-8 px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="" />
                </div>
                <div className="col-span-4 mx-2">
                    <label htmlFor="instruct" className="text-sm font-medium">Administration Instructions</label>
                    <textarea id="instruct" className="w-full  px-1 py-0.5 resize-none text-sm bg-white border border-neutral-400 rounded-md shadow-sm focus:outline-none focus:border-2" placeholder="Administer for sustained HR of >150 bpm." />
                </div>
            </div>
            
        </div>
    )
} 

export default SimMedOrder