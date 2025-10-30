import type { AllMedicationTypes, InsulinMedication, MedicationOrder } from "./marData";
import { Separator } from "@/components/ui/separator";

export const pluralize = (unitsOrdered: number, unitName: string) => {
    return unitsOrdered > 1 ? unitName + 's' : unitName
  };

export const isSlidingScaleInsulin = (medication: AllMedicationTypes): medication is InsulinMedication => {
  return (
    medication.route === "SC" &&
    'bgDosing' in medication &&
    Array.isArray(medication.bgDosing) &&
    medication.bgDosing.length > 0
  );
};

export function getMedDose(medication: AllMedicationTypes, order: MedicationOrder) {
  if (isSlidingScaleInsulin(medication)) {
    return "Variable"
  } else {
    return `${medication.strength * order.unitsOrdered}${medication.strengthUnit}`
  }
}

export const renderMedTitleRow = (medication: AllMedicationTypes, order: MedicationOrder) => {
  if (medication.route == "IV" && medication.isContinuous) {
    return (
      <div className="flex flex-wrap gap-2 h-fit font-semibold">
        <span className="text-nowrap">{medication.genericName}</span>
        {medication.brandName && (
          <span className="text-nowrap">({medication.brandName})</span>
        )}
        <span className="text-nowrap">{medication.strength * order.unitsOrdered}{medication.strengthUnit}</span>
      </div>
    )
  }
  if (medication.route == "IV" && !medication.isContinuous ) {
    return (
      <div className="flex flex-wrap gap-1.5 h-fit font-semibold">
        <span className="text-nowrap">{medication.genericName}</span>
        {medication.brandName && (
          <span className="text-nowrap">({medication.brandName})</span>
        )}
        <span className="text-nowrap">{medication.strength * order.unitsOrdered}{medication.strengthUnit}</span>
        {medication.diluent &&
          <span className="text-nowrap">in {medication.diluent} {medication.totalVolume}mL</span>
        }
      </div>
    )
  }
  if (isSlidingScaleInsulin(medication)) {
    return(
      <div className="flex flex-wrap gap-2 h-6 font-semibold">
        <span className="text-nowrap">{medication.genericName}</span>
        {medication.brandName && (
          <span className="text-nowrap">({medication.brandName})</span>
        )}
      </div>
    )
  }  
    else {
      return (
        <div className="flex flex-wrap gap-2 h-6 font-semibold">
          <span className="text-nowrap">{medication.genericName}</span>
          {medication.brandName && (
            <span className="text-nowrap">({medication.brandName})</span>
          )}
          <span className="text-nowrap">{medication.strength * order.unitsOrdered}{medication.strengthUnit}</span>
        </div>
      )
    }
  }

export const renderMedCardDetails = (medication: AllMedicationTypes, order: MedicationOrder) => {
  switch (medication.route) {
    case "PO":
      return (
        <div className="flex gap-2 h-5">
          <span className="text-nowrap">{medication.route}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.unitsOrdered} {pluralize(order.unitsOrdered, medication.orderableUnit)}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.frequency}</span>
          <Separator className="bg-gray-300" orientation="vertical"/>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    case "IV": 
      return (
        <div className="flex gap-2 h-5">
          <span className="text-nowrap">{medication.route}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.unitsOrdered} {pluralize(order.unitsOrdered, medication.orderableUnit)}</span>
          {medication.infusionRate && medication.infusionRateUnit &&
            <>
              <Separator className="bg-gray-300" orientation="vertical" />
              <span className="text-nowrap">{medication.infusionRate} {medication.infusionRateUnit}</span>
            </>
          }
          
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.frequency}</span>
          <Separator className="bg-gray-300" orientation="vertical"/>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    case "SC":
      if (isSlidingScaleInsulin(medication)) {
        const doseRange = `${medication.bgDosing[0]?.units ?? '0'} - ${medication.bgDosing[medication.bgDosing.length - 1]?.units ?? 'N/A'}`;
        return (
          <div className="flex gap-2 h-5">
            <span className="text-nowrap">{medication.route}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{doseRange} units</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{order.frequency}</span>
            <Separator className="bg-gray-300" orientation="vertical"/>
            <span className="text-nowrap">{order.indication}</span>
          </div>
        )
      }
    case "Inhalation": {
      return (
        <div className="flex gap-2 h-5">
          <span className="text-nowrap">{medication.route}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.unitsOrdered} {pluralize(order.unitsOrdered, medication.orderableUnit)}</span>
          <Separator className="bg-gray-300" orientation="vertical" />
          <span className="text-nowrap">{order.frequency}</span>
          <Separator className="bg-gray-300" orientation="vertical"/>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    }
  }
}
