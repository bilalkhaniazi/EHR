import {
  AlertCircle,
  CheckCircle2,
  Pill,
  Clock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AllMedicationTypes, MedicationOrder } from "@/app/simulation/[sessionId]/chart/mar/components/marData";

interface MultiMedPopoverProps {
  isOpen: boolean;
  associatedOrders: MedicationOrder[];
  handleSelection: (orderId: string) => void;
  handleClose: (open: boolean) => void;
  medication: AllMedicationTypes;
}

export function MultiMedPopover({
  isOpen,
  associatedOrders,
  handleSelection,
  handleClose,
  medication
}: MultiMedPopoverProps) {

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] h-200 sm:max-w-lg md:max-w-2xl p-0 gap-0 overflow-hidden bg-gray-50">
        <DialogHeader className="px-4 py-3 gap-0 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="p-1.5 bg-amber-100 rounded-full">
              <AlertCircle size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Verification Required</span>
          </div>
          <DialogTitle className="text-lg  text-gray-800">Which order are you administering?</DialogTitle>
          <DialogDescription className="text-gray-400">
            The scanned medication matches multiple active orders. Please select the specific order to document.
          </DialogDescription>
        </DialogHeader>

        {/* Order Selection List */}
        <div className="p-6 grid bg-white gap-3 overflow-y-auto">
          {associatedOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => handleSelection(order.id)}
              className="group relative flex flex-col items-start w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="flex justify-between w-full items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                    <Pill size={16} />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 leading-none">
                      {order.dose}
                      {/* Assuming 'unit' might be on the order or linked med, defaulting context here */}
                    </h4>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                      {medication.route} route here
                    </span>
                  </div>
                </div>

                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={24} />
                </div>
              </div>

              {/* Detail Rows */}
              <div className="w-full space-y-1.5 border-t border-slate-50 pt-2 mt-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  <span>{order.frequency}</span>
                </div>
                {order.instructions && (
                  <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded w-full">
                    <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{order.instructions}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-gray-50 border-t border-slate-100 sm:justify-between items-center">
          <p className="text-xs text-slate-400 pl-2 hidden sm:block">
            Esc to cancel
          </p>
          <DialogClose asChild>
            <Button variant="ghost" className="text-slate-500 hover:text-slate-800">
              Cancel Administration
            </Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}