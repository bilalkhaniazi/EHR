import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";


interface InitialLabResult {
  labName: string;
  value: string;
}

// AddBgDemo Component - for adding a specific Blood Glucose lab value
interface AddBgDemoProps {
  onAddLab: (newLabData: InitialLabResult[]) => void;
}

const AddBgDemo = ({ onAddLab }: AddBgDemoProps) => {
  const [bgValue, setBgValue] = useState<string>('');

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={bgValue}
        type="number"
        placeholder="BG value"
        onChange={(e) => setBgValue(e.target.value)}
        className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button
        variant='secondary'
        className="shadow shadow-black/20 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md px-4 py-2"
        onClick={() => {
          if (bgValue.trim()) { // Ensure the input is not empty
            onAddLab([{ labName: "Glucose", value: bgValue }]);
            setBgValue(''); // Clear input after adding
          } else {
            toast.error("Please enter a glucose value.");
          }
        }}
      >
        Add Blood Glucose
      </Button>
    </div>
  )
}

export default AddBgDemo