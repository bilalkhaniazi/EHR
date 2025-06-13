
interface SidebarProps {
    onAddPtState: () => void;
    onAddLab: () => void;
    onAddMedOrder: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ onAddPtState, onAddLab, onAddMedOrder }) => { 
    
    return (
        <div className="w-52 p-3 flex flex-col flex-shrink-0 bg-mint-500">
            <div className="flex-1 flex flex-col justify-around mb-4 rounded-md border border-lime-800 bg-mint-200 shadow-md/30">
                <img src="src\assets\avatar.png" className="mx-9 mt-2 rounded-full border-4 border-white" />
                <p className="text-avatar text-sm font-semibold text-center mt-2 mx-8">Please select a patient profile </p>
                <button className="mx-4 my-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Select Patient</button>
                <button className="mx-4 mb-4 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Edit Patient Chart</button>
            </div>
            <div className="flex-1 flex flex-col justify-start rounded-md border border-lime-800 bg-mint-200 shadow-md/30">
                <button onClick={onAddPtState} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add Patient State</button>
                <button onClick={onAddMedOrder} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add New Order</button>
                <button onClick={onAddLab} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add New Lab</button>
            </div>
        </div>
    )
}

export default Sidebar