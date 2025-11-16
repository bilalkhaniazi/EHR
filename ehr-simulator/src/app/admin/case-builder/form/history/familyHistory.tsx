import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FamilyHistoryEntry {
  relation: string;
  notes: string;
}

interface FamilyHistoryProps {
  name?: string;
  relations: string[];
  value: FamilyHistoryEntry[];
  onChange: (entries: FamilyHistoryEntry[]) => void;
  labelText?: string;
  placeholder?: string;
  notesPlaceholder?: string;
}

export function FamilyHistory({
  name,
  relations,
  value,
  onChange,
  labelText = "Family History:",
  placeholder = "Select relation...",
  notesPlaceholder = "Enter medical history, conditions, or other relevant information..."
}: FamilyHistoryProps) {
  const addEntry = (): void => {
    const newEntry: FamilyHistoryEntry = {
      relation: '',
      notes: ''
    };
    onChange([...value, newEntry]);
  };

  const updateEntry = (index: number, field: keyof FamilyHistoryEntry, val: string): void => {
    onChange(
      value.map((entry, i) =>
        i === index ? { ...entry, [field]: val } : entry
      )
    );
  };

  const deleteEntry = (index: number): void => {
    onChange(value.filter((_, i) => i !== index));
  };

  relations.sort();

  return (
    <div className="w-full">
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}
      <div className="flex items-center">
        <label className="case-form-label">{labelText}</label>
        <Button
          type="button"
          onClick={addEntry}
          variant="outline"
          size="sm"
          className="inline-flex ml-2 font-normal items-center gap-2"
        >
          Create Entry
          <Plus className="h-4 w-4" />
        </Button>
      </div>


      <div className="space-y-3">
        {value.map((entry, index) => (
          <div
            key={index}
            className="first:mt-4 border rounded-lg p-4 bg-card space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relation</label>
                  <Select
                    required
                    value={entry.relation || undefined}
                    onValueChange={(val) => updateEntry(index, 'relation', val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={placeholder} />
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
                    required
                    value={entry.notes}
                    onChange={(e) => updateEntry(index, 'notes', e.target.value)}
                    placeholder={notesPlaceholder}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => deleteEntry(index)}
                variant="ghost"
                size="icon"
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 h-8 p-1"
                aria-label="Delete entry"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {entry.relation && (
              <Badge variant="secondary" className="w-fit">
                {entry.relation}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}