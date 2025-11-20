'use client'
import { ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export interface FamilyHistoryData {
  relation: string;
  condition: string;
}

interface FamilyHistoryProps {
  name?: string;
  value: FamilyHistoryData[];
  onChange: (entries: FamilyHistoryData[]) => void;
  labelText?: string;
  placeholder?: string;
  notesPlaceholder?: string;
}

const relations: string[] = [
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Paternal Grandmother',
  'Maternal Grandmother',
  'Paternal Grandfather',
  'Maternal Grandfather',
  'Maternal Aunt',
  'Paternal Aunt',
  'Maternal Uncle',
  'Paternal  Uncle',
  'Maternal Cousin',
  'Paternal Cousin',
];

export function FamilyHistory({
  name,
  value,
  onChange,
  labelText = "Family History:",
  placeholder = "Select relation...",
  notesPlaceholder = "Enter condition..."
}: FamilyHistoryProps) {
  const [relation, setRelation] = useState('');
  const [condition, setCondition] = useState('');


  const addEntry = (): void => {
    const newEntry: FamilyHistoryData = {
      relation: relation,
      condition: condition
    };
    onChange([...value, newEntry]);
  };

  // const updateEntry = (index: number, field: keyof FamilyHistoryData, val: string): void => {
  //   onChange(
  //     value.map((entry, i) =>
  //       i === index ? { ...entry, [field]: val } : entry
  //     )
  //   );
  // };

  const deleteEntry = (index: number): void => {
    onChange(value.filter((_, i) => i !== index));
  };


  return (
    <div className="mb-2">
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}
      <div className="flex items-center">
        <label className="case-form-label">{labelText}</label>
        <div className="flex flex-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Relation</label>
            <Select
              value={relation}
              onValueChange={setRelation}
              defaultValue='Select relation...'
            >
              <SelectTrigger className="w-fit !h-7">
                <SelectValue placeholder={placeholder} />
                <ChevronDown />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Medical Condition</label>
            <input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder={notesPlaceholder}
              className="flex w-full rounded-md h-7 shadow-xs border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />

          </div>
          <Button
            type="button"
            onClick={addEntry}
            variant="outline"
            size="sm"
            className="inline-flex h-7 mt-6 font-normal items-center gap-2"
          >
            Add
            <Plus className="h-4 w-4" />
          </Button>

        </div>
      </div>

      {/* Display a badge for each input */}
      <div className="flex flex-wrap gap-2 mt-2 ml-4">
        {value.map((item: FamilyHistoryData, index: number) => (
          <Badge key={index} variant="secondary" className="pl-4 py-1.5 flex items-center gap-1 shadow">
            {item.relation}: {item.condition}
            <button className="cursor-pointer" type="button" onClick={() => deleteEntry(index)}>
              <X className="w-4 h-4 ml-2" />
            </button>
          </Badge>
        ))}
      </div>
    </div >
  );
}