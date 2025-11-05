import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import BaseMedicationFields from './base-med-form';
import { Button } from '@/components/ui/button';
import { IvMedication, OralMedication } from '@/app/simulation/[sessionId]/chart/mar/components/marData';

export const OralMedForm = ({ onSubmit }: { onSubmit: (data: React.FormEvent<HTMLFormElement>) => void }) => {


  return (
    <form onSubmit={(e) => onSubmit(e)} className="space-y-4 py-4">
      <BaseMedicationFields />
      <fieldset className="border p-4 rounded w-full gap-4">
        <legend className="font-semibold">Route Specific Details</legend>
        <Label className="pb-2" htmlFor="orderableUnit">Form</Label>
        <select name="orderableUnit" className="border border-gray-200 h-9 rounded-md px-2 text-xs shadow-xs">
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Dissolvable Tab">Dissolvable Tab</option>
        </select>
      </fieldset>
      <Button type="submit" className="">Submit Oral Medication</Button>
    </form>
      
  );
};