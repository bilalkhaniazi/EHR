// import React from 'react';
// // import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { Info } from 'lucide-react';
// import BaseMedicationFields from './base-med-form';
// // import { IvFormData, ivSchema } from '@/lib/schemas';
// import { Button } from '@/components/ui/button';

// export const IvMedForm = ({ onSubmit }: { onSubmit: (data: React.FormEvent<HTMLFormElement>) => void }) => {

//   // const isContinuous = methods.watch('isContinuous');
  
//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 py-4">
//         <BaseMedicationFields />
//         <fieldset className="border p-4 rounded w-full gap-4">
//           <legend className="font-semibold">Route Specific Details</legend>
//           <div className="flex items-center gap-2 pb-4">
//             <input id="isContinuous" type="checkbox" {...methods.register('isContinuous')} className="accent-gray-500" />
//             <Label htmlFor="isContinuous">Is this medication a maintenance fluid?</Label>
//           </div>

//           {isContinuous && (
//             <div>
//               <p>Maintenance fluids's dose should be 1000 and dose unit be mL.</p>
//             </div>
//           )}
//             <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 w-full">
//               <div className='pb-4'>
//                 <Label htmlFor="orderableUnit" className='text-sm pb-1'>Medication Form</Label>
//                 <select id="orderableUnit" {...methods.register('orderableUnit')} className="border border-gray-200 h-9 rounded-md w-full px-2 shadow-xs text-xs">
//                   <option value="" disabled hidden>Select form</option>
//                   <option value="Bag">Bag</option>
//                   <option value="Vial">Vial</option>
//                 </select>
//                 {/* {methods.formState.errors.orderableUnit && <p className="text-xs text-red-800">{methods.formState.errors.orderableUnit.message}</p>} */}
//               </div>
//               {!isContinuous && (
//                 <>
//                   <div>
//                     <Label htmlFor='infusionRate' className='text-sm pb-1'>Infusion Rate</Label>
//                     <Input id="infusionRate" type="number" {...methods.register('infusionRate')} className="" />
//                     {/* {methods.formState.errors.infusionRate && <p className="text-xs text-red-800">{methods.formState.errors.infusionRate.message}</p>} */}
//                   </div>
//                   <div>
//                     <Label htmlFor="infusionRateUnit" className='text-sm pb-1'>Infusion Rate Unit</Label>
//                     <select id="infusionRateUnit" {...methods.register('infusionRateUnit')} className="border border-gray-200 h-9 rounded-md px-2 shadow-xs w-full text-xs">
//                       <option value="mg/hr">mg/hr</option>
//                       <option value="units/hr">units/hr</option>
//                       <option value="mL/hr">mL/hr</option>
//                     </select>
//                     {/* {methods.formState.errors.route && <p className="text-xs text-red-800">{methods.formState.errors.route.message}</p>} */}
//                   </div>
//                   <div>
//                     <Label htmlFor='diluent' className='text-sm pb-1'>Diluent</Label>
//                     <Input id="diluent" {...methods.register('diluent')} className="" />
//                   </div>
//                   <div>
//                     <Label htmlFor='totalVolume' className='text-sm pb-1'>Diluent Volume (mL)</Label>
//                     <Input id="totalVolume" type="number" {...methods.register('totalVolume')} className="" />
//                   </div>
//                 </>
//               )}

//             </div>
//         </fieldset>
          
//         <Button type="submit" className="">Submit IV Medication</Button>
//       </form>
//     </FormProvider>
      
//   );
// };