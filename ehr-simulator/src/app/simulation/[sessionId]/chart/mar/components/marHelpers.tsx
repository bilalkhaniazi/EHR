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
  const brandNameDisplay = `(${medication.brandName})`
  switch (medication.route) {
    case 'IV':
      if (medication.isContinuous) {
        const medTitle = `${medication.genericName} ${medication.brandName ? brandNameDisplay : ''} ${order.dose}${medication.strengthUnit} `
        return (
          <p className="font-semibold">{medTitle}</p>
        )
      }
      else {
        const diluent = `in ${medication.diluent} ${medication.totalVolume}mL`
        const medTitle = `${medication.genericName} ${medication.brandName ? brandNameDisplay : ""} ${order.dose}${medication.strengthUnit} ${medication.diluent ? diluent : ''}`
        return (
          <p className="font-semibold">{medTitle}</p>
        )
      }
    case "SC":
      if (isSlidingScaleInsulin(medication)) {
        const medTitle = `${medication.genericName} ${medication.brandName ? brandNameDisplay : ''}`
        return (
          <p className="font-semibold">{medTitle}</p>
        )
      }
      else {
        const strengthUnit = `${medication.strengthUnit === 'units' ? " units" : medication.strengthUnit}`
        const medTitle = `${medication.genericName} ${medication.brandName ? brandNameDisplay : ''} ${order.dose}${strengthUnit}`
        return (
          <p className="font font-semibold">{medTitle}</p>
        )
      }
    default:
      const medTitle = `${medication.genericName} ${medication.brandName ? brandNameDisplay : ''} ${order.dose}${medication.strengthUnit}`
      return (
        <p className="font font-semibold">{medTitle}</p>

      )
  }
}

export const renderMedCardDetails = (medication: AllMedicationTypes, order: MedicationOrder) => {
  switch (medication.route) {
    case "PO":
    case "SL":
    case "IM":
      return (
        <div className="flex gap-1.5 h-fit flex-wrap">
          <span className="text-nowrap">{medication.route}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.dose / medication.strength} {pluralize(order.dose / medication.strength, medication.orderableUnit)}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.frequency}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.priority}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    case "IV":
      return (
        <div className="flex gap-1.5 h-fit flex-wrap">
          <span className="text-nowrap">{medication.route}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.dose / medication.strength} {pluralize(order.dose / medication.strength, medication.orderableUnit)}</span>
          {order.infusionRate && medication.infusionRateUnit &&
            <>
              <div className="h-5">
                <Separator className="bg-gray-300" orientation="vertical" />
              </div>
              <span className="text-nowrap">{order.infusionRate} {medication.infusionRateUnit}</span>
            </>
          }

          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.frequency}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.priority}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    case "SC":
      if (isSlidingScaleInsulin(medication)) {
        const doseRange = `${medication.bgDosing[0]?.units ?? '0'} - ${medication.bgDosing[medication.bgDosing.length - 1]?.units ?? 'N/A'}`;
        return (
          <div className="flex gap-1.5 h-fit flex-wrap ">
            <span className="text-nowrap">{medication.route}</span>
            <div className="h-5">
              <Separator className="bg-gray-300" orientation="vertical" />
            </div>
            <span className="text-nowrap">{doseRange} units</span>
            <div className="h-5">
              <Separator className="bg-gray-300" orientation="vertical" />
            </div>
            <span className="text-nowrap">{order.frequency}</span>
            <div className="h-5">
              <Separator className="bg-gray-300" orientation="vertical" />
            </div>
            <span className="text-nowrap">{order.priority}</span>
            <div className="h-5">
              <Separator className="bg-gray-300" orientation="vertical" />
            </div>
            <span className="text-nowrap">{order.indication}</span>
          </div>
        )
      }
    case "Inhalation": {
      return (
        <div className="flex gap-1.5 h-fit flex-wrap">
          <span className="text-nowrap">{medication.route}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.dose / medication.strength} {pluralize(order.dose / medication.strength, medication.orderableUnit)}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.frequency}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.priority}</span>
          <div className="h-5">
            <Separator className="bg-gray-300" orientation="vertical" />
          </div>
          <span className="text-nowrap">{order.indication}</span>
        </div>
      )
    }
    default:
  }
}
