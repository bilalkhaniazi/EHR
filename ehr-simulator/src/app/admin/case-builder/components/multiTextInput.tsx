import { useState } from "react";
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

    // Avoid duplicates and empty strings
    if (!value.includes(input) && input !== '') {
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
      {/* Hidden input holds JSON of inputs for form submission */}
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}

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

      <Button
        type="button"
        onClick={(e) => { e.preventDefault; addInput() }}
        variant="outline"
        size="sm"
        className="inline-flex ml-2 font-normal items-center gap-2"
      >
        Add
        <Plus className="h-4 w-4" />
      </Button>


      {/* Display a badge for each input */}
      <div className="flex flex-wrap gap-2">
        {value.map((item: string, index: number) => (
          <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-1">
            {item}
            <button className="cursor-pointer" type="button" onClick={() => removeItem(index)}>
              <X className="w-4 h-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default MultiTextInput