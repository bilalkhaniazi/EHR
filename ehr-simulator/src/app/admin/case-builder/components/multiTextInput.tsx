import { useState } from "react";
import { X } from "lucide-react"

interface MultiTextInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  name?: string;
  labelText: string
  required?: boolean
  titleCase?: boolean
}

function MultiTextInput({ value = [], onChange, placeholder = "Add item...", name, labelText, required = false, titleCase = false }: MultiTextInputProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [requiredState, setRequiredState] = useState(required)

  const checkRequired = () => {
    if (required) {
      if (currentInput.length > 0) {
        setRequiredState(false)
      }
      else {
        setRequiredState(true)
      }
    }
  }

  const addInput = () => {
    let input = currentInput.trim();
    if (titleCase) {
      input = input.split(' ')
        .map(word => {
          if (word.length === 0) {
            return '';
          }
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    }
    else {
      input = input.charAt(0).toUpperCase() + input.slice(1);
    }

    if (value.includes(input)) {
      // Notify the user they tried adding a duplicate
    }
    else if (input) {
      onChange([...value, input]);
      setCurrentInput('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInput();
      checkRequired();
    }
  };
  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    checkRequired();
  };

  return (
    <div>
      <label className="case-form-label">{labelText}</label>
      <input
        className="case-form-input-text"
        type="text"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={requiredState}
      />
      <button
        className="border-1 border-[#333] rounded bg-[#eaeaea] ml-2 pl-2 pr-2 inline w-fit cursor-pointer"
        type="button"
        onClick={(e) => { e.preventDefault; addInput() }}
      >
        Add
      </button>

      {/* Hidden input holds JSON of inputs for form submission */}
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}

      {/* Display a badge for each input */}
      <div className="grid grid-cols-10 mt-2">
        {value.map((item: string, index: number) => (
          <div className="flex p-1 w-fit bg-accent rounded gap-2" key={index}>
            <span>{item}</span>
            <button className="cursor-pointer" type="button" onClick={() => removeItem(index)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiTextInput