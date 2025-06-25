interface SidebarProps {
    onSubmit: () => void;
    onAddMedOrder: () => void;
    onAddOrder: () => void;
    onAddLabResult: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSubmit, onAddMedOrder, onAddOrder, onAddLabResult }) => { 
    
    return (
        <div className="w-52 sticky top-20 h-[calc(100vh-4rem)] p-3 flex flex-col flex-shrink-0 bg-mint-500">
            <div className="flex flex-col justify-around mb-4 rounded-md border border-lime-800 bg-mint-200 shadow-md/30">
                <img src="src\assets\avatar.png" className="mx-9 xl:mx-12 mt-2 rounded-full border-4 border-white" />
                <p className="text-avatar text-sm font-semibold text-center mt-2 mx-8">Please select a patient profile </p>
                <button className="mx-4 my-4 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Select Patient</button>
                <button className="mx-4 mb-4 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Edit Patient Chart</button>
            </div>
            <div className=" flex-1 flex flex-col justify-start mb-10 rounded-md border border-lime-800 bg-mint-200 shadow-md/30">
                <button onClick={onAddOrder} className="line-through m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add New Order</button>
                <button onClick={onAddMedOrder} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add Med Order</button>
                <button onClick={onAddLabResult} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Add Lab Result</button>
                <button onClick={onSubmit} className="m-2 py-2 rounded-xl font-semibold bg-buttonGray shadow-md/30 hover:bg-neutral-300">Submit Items</button>
            </div>
        </div>
    )
}

export default Sidebar