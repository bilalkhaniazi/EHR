import React from 'react';
// import { useFormContext } from 'react-hook-form'; // 1. Import this hook
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';


export const BaseMedicationFields = () => {


  return ( 
    <fieldset className="grid lg:grid-cols-4 grid-cols-2 border p-4 rounded w-full gap-4">
        <legend className="font-semibold">Base Information</legend>
        <div className=''>
          <div className='flex gap-3'> 
            <Label htmlFor="genericName" className='text-sm pb-1'>Generic Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={14} color='#939397' />
                </TooltipTrigger>
                <TooltipContent className="w-fit">
                  <p className="max-w-120  text-wrap">Examples: 'metoprolol tartate', 'escitalopram', or 'atorvastatin'</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="genericName" className="" />
          {/* {errors.genericName && <p className="text-xs text-red-800">{errors.genericName.message}</p>} */}
        </div>
        <div className=''>
          <Label htmlFor="brandName" className='text-sm pb-1'>Brand Name</Label>
          <Input id="brandName" className="" />
          {/* {errors.brandName && <p className="text-xs text-red-800">{errors.brandName.message}</p>} */}
        </div>
        <div>
          <div className="flex gap-3 items-center">
            <Label htmlFor="strength" className='text-sm pb-1'>Dose</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={14} color='#939397' />
                </TooltipTrigger>
                <TooltipContent className="w-fit">
                  <p className="max-w-120  text-wrap">The numerical doasge of one tablet, vial, puff, bag, etc.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Input id="strength" type="number" className="" />
          
          {/* {errors.strength && <p className="text-xs text-red-800">{(errors.strength as any).message}</p>} */}
        </div>
        <div>
          <Label htmlFor="strengthUnit" className='text-sm pb-1'>Dose Unit</Label>
          <select id="strengthUnit"  className="border border-gray-200 h-9 rounded-md px-2 shadow-xs w-full text-xs">
            <option value="mg">mg</option>
            <option value="gram">gram</option>
            <option value="units">units</option>
            <option value="mcg">mcg</option>
            <option value="mL">mL</option>
            <option value="%">%</option>

          </select>
          {/* {errors.strengthUnit && <p className="text-xs text-red-800">{(errors.strengthUnit as any).message}</p>} */}
        </div>
    </fieldset>
  )
}

export default BaseMedicationFields