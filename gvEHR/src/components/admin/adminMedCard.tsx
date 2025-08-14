import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import type { AllMedicationTypes } from "../mar/marData"
import { Checkbox } from "../ui/checkbox";
import Barcode from 'react-barcode';

interface MedCardProps {
  medication: AllMedicationTypes;
  onSelectionChange: (id: string, checked: boolean ) => void;
  isSelected: boolean;
}

const AdminMedCard = ( {
  medication, 
  onSelectionChange,
  isSelected
}: MedCardProps) => {


  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(medication.id, checked);
  };

  const renderMedCardDetails = () => {
    switch (medication.route) {
      case "PO":
        return (
          <div className="flex gap-2 h-5">
            <span className="text-nowrap">{medication.route}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.strength} {medication.strengthUnit}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.orderableUnit}</span>
          </div>
        )
      case "IV": 
        return (
          <div className="flex gap-2 h-5">
            <span className="text-nowrap">{medication.route}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.strength} {medication.strengthUnit}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.infusionRate}{medication.infusionRateUnit}</span>
            <Separator className="bg-gray-300" orientation="vertical"/>
            <span className="text-nowrap">{medication.totalVolume}mL {medication.diluent}</span>
          </div>
        )
      default:
        return (
          <div className="flex gap-2 h-5">
            <span className="text-nowrap">{medication.route}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.strength} {medication.strengthUnit}</span>
            <Separator className="bg-gray-300" orientation="vertical" />
            <span className="text-nowrap">{medication.orderableUnit}</span>
          </div>
        )
    }
  }

  return (
    <Card className="w-full p-0 overflow-hidden flex-shrink-0">
      <div className="grid grid-cols-2">
        <div className="py-4">  
          <CardHeader className="">
            <CardTitle className="pb-1 flex gap-2 h-fit">
              <Checkbox
                onCheckedChange={handleCheckboxChange}
                checked={isSelected}
                id={`checkbox-${medication.id}`}
                className="" 
              />
              <div className="flex flex-wrap gap-x-2">
                <span className="text-nowrap">{medication.genericName}</span>
                {medication.brandName && (
                  <span className="text-nowrap">({medication.brandName})</span>
                )}
                <span className="text-nowrap">{medication.strength}{medication.strengthUnit}</span>
              </div>
            </CardTitle>
            <CardDescription className="text-xs tracking-tight pb-2">
              {renderMedCardDetails()}
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            {/* {order.instructions && 
              <div className="pb-2">
                <h2 className="font-light">Administration Instructions:</h2>
                <p className="pl-2 text-xs font-light text-gray-700">
                  {medication.instructions}
                </p>
              </div>
            } */}
          
          </CardContent>
        </div>
        <div className="w-full h-full">
          <Barcode value={medication.id} format="CODE128" width={1.2} height={80}/>
        </div>      
      </div>
    </Card>
  )
}

export default AdminMedCard