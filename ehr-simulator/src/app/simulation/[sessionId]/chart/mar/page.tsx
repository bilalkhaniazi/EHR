'use client'

import { addMinutes, differenceInMinutes } from 'date-fns'
import MedCard from "@/app/simulation/[sessionId]/chart/mar/components/medCard";
import { useEffect, useMemo, useState } from "react";
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from "./components/marData";
import MedAdministrationPanel from "./components/medAdministrationPanel";
import { medicationOrders, allMedications, medAdministrations } from './components/marData';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { ClipboardClock, Filter, PillBottle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { MultiMedPopover } from './components/multiMedPopover';
import { toast } from 'sonner';
import WrongPatientAlert from './components/wrongPatientAlert';
import { createColumns } from '@/app/admin/case-builder/form/medication-administrations/page';


export interface NewAdministrationData {
  [medOrderId: string]: MedAdministrationInstance;
}

export interface MedCardColumns {
  startTime: Date;
  endTime: Date;
  colHeader: string;
  associatedAdministrations?: MedAdministrationInstance[];
}

const patientMRN = 'pt12345678'

const filterOptions = ["Scheduled", "Continuous", "PRN"]
export default function Mar() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [administrations, setAdministrations] = useState<MedAdministrationInstance[]>(medAdministrations)
  const [newAdministrations, setNewAdministrations] = useState<NewAdministrationData>({});
  const [orderFilter, setOrderFilter] = useState<string>('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isDue, setIsDue] = useState<boolean | undefined>(false)
  const [isScanned, setIsScanned] = useState(false);
  // const [scannedSymbol, setScannedSymbol] = useState('')
  const [isMultiOrderPopoverOpen, setIsMultiOrderPopoverOpen] = useState<boolean>(false)
  const [associatedOrders, setAssociatedOrders] = useState<MedicationOrder[]>([])
  const [isWrongPtScan, setIsWrongPtScan] = useState<boolean>(false)
  const [isMedAdminPanelOpen, setIsMedAdminPanelOpen] = useState(false);
  const [anchorDate] = useState<Date>(new Date());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const handleScan = (symbol: string) => {
    // setScannedSymbol(symbol)
    // handle patient wristband scans
    if (symbol.slice(0, 2) === 'pt') {
      if (symbol === patientMRN) {
        setIsScanned(true)
        return
      } else {
        if (!isWrongPtScan) {
          setIsWrongPtScan(true)
          return
        }
      }
    }
    // find all orders that use this medication
    const newAssociatedOrders = medicationOrders.filter(order => order.medicationId === symbol)
    const associatedOrderIds = newAssociatedOrders
      .map(order => order.id)
      .filter(id => !selectedOrders.includes(id))

    if (associatedOrderIds.length === 0) {
      toast.info(`Order already scanned or no associated orders found with ${symbol}`)
      return
    }

    if (newAssociatedOrders.length > 1) {
      console.warn("more than one order shares this med")
      setAssociatedOrders(newAssociatedOrders)
      setIsMultiOrderPopoverOpen(true)
      return
    }

    if (!isPopoverOpen) {
      setIsMedAdminPanelOpen(true)
    }
    setSelectedOrders(prev => {
      return [...prev, associatedOrderIds[0]]
    })

    setNewAdministrations(prev => ({
      ...prev,
      [associatedOrderIds[0]]: {
        medicationOrderId: associatedOrderIds[0],
        status: "Given",
        administratorId: "currentUser",
        adminTimeMinuteOffset: 0,
        administeredDose: 0,
        visibleInPresim: false, // doesn't matter - this entry will not affect case template
        notes: '',
      }
    }));
  }

  const handleMultiOrderPopoverChoice = (orderId: string) => {
    setSelectedOrders(prev => [...prev, orderId])
    setNewAdministrations(prev => ({
      ...prev,
      [orderId]: {
        medicationOrderId: orderId,
        status: "Given",
        administratorId: "currentUser",
        adminTimeMinuteOffset: 0,
        administeredDose: 0,
        visibleInPresim: false, // doesn't matter - this entry will not affect case template
        notes: '',
      }
    }))

    setIsMultiOrderPopoverOpen(false)
    if (!isMedAdminPanelOpen) {
      setIsMedAdminPanelOpen(true)
    }
    setAssociatedOrders([])
  }

  const handleMultiOrderPopoverClose = () => {
    setIsMultiOrderPopoverOpen(false)
    setAssociatedOrders([])

  }

  const handleRemoveOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newOrders = prev.filter(order => order !== orderId)
      return newOrders
    })
    setNewAdministrations(prev => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    })
  }


  useSymbologyScanner(handleScan,
    {
      scannerOptions: { prefix: '~', suffix: '', maxDelay: 20 },
      symbologies: ["Data Matrix"]
    },
  )

  const handleMedCheckboxChange = (payload: { id: string, checked: boolean }) => {
    const { id, checked } = payload;
    if (checked) {
      setSelectedOrders(prev => [...prev, id]);

      setNewAdministrations(prev => ({
        ...prev,
        [id]: {
          medicationOrderId: id,
          status: "Given",
          administratorId: "currentUser",
          adminTimeMinuteOffset: 0,
          administeredDose: 0,
          visibleInPresim: false // doesn't matter - this entry will not affect case template
        }
      }));
      console.log(selectedOrders)
    } else {
      setSelectedOrders(prev => prev.filter(medId => medId !== id));

      setNewAdministrations(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleFilterChange = (option: string, checked: boolean | "indeterminate") => {
    setOrderFilter(() => {
      if (checked === true) {
        return option;
      } else {
        return ''
      }
    });
  };

  const handleUpdateAdministration = (medicationOrderId: string, field: keyof MedAdministrationInstance, value: number | string) => {
    setNewAdministrations(prev => {
      const currentInstance = prev[medicationOrderId];
      if (!currentInstance) return prev;

      return {
        ...prev,
        [medicationOrderId]: {
          ...currentInstance,
          [field]: value
        }
      };
    });
  };

  const handleClearAll = () => {
    setSelectedOrders([]);
    setNewAdministrations({});
    setOrderFilter('')
  };

  const handleClearFilters = () => {
    setOrderFilter('');
    setIsDue(false);
    setIsPopoverOpen(false)
  };


  const handleAdministerMeds = (medAdmins: MedAdministrationInstance[]) => {
    const newAdminTimes = new Map(medAdmins.map(admin => [admin.medicationOrderId, admin.adminTimeMinuteOffset]))

    setAdministrations(prev => {
      const filteredAdministrations = prev.filter(existingAdmin => {
        if (existingAdmin.status !== 'Due') {
          return true
        }
        const newAdminTime = newAdminTimes.get(existingAdmin.medicationOrderId)
        if (newAdminTime === undefined) {
          return true
        }
        const minuteDifference = Math.abs(differenceInMinutes(newAdminTime, existingAdmin.adminTimeMinuteOffset))
        return minuteDifference > 60
      })
      return [...filteredAdministrations, ...medAdmins]
    })
    handleClearAll()
  }


  const groupedAdministrationsByOrder = useMemo(() => {
    return administrations.reduce((acc, admin) => {
      if (!acc[admin.medicationOrderId]) {
        acc[admin.medicationOrderId] = [];
      }
      acc[admin.medicationOrderId].push(admin)
      return acc
    }, {} as { [orderId: string]: MedAdministrationInstance[] })
  }, [administrations]);

  const medsById = useMemo(() => {
    return allMedications.reduce((acc, med) => {
      acc[med.id] = med;
      return acc;
    }, {} as { [id: string]: AllMedicationTypes });
  }, []);

  const filteredMedOrders = useMemo(() => {
    if (!orderFilter && !isDue) return medicationOrders;

    return medicationOrders.filter((order) => {
      if (isDue) {
        const orderAdmins = groupedAdministrationsByOrder[order.id];
        if (!orderAdmins?.some((admin) => admin.status === 'Due')) {
          return false;
        }
      }

      if (!orderFilter) return true;

      switch (orderFilter) {
        case "PRN":
          return order.priority === "PRN";
        case "Continuous":
          return order.frequency === "Continuous";
        case "Scheduled":
          return order.priority !== "PRN" && order.frequency !== "Continuous";
        default:
          return true;
      }
    });
  }, [orderFilter, isDue, groupedAdministrationsByOrder]);


  useEffect(() => {
    // Update the elsapseMinutes every minute
    const interval = setInterval(() => {
      const now = new Date();
      setElapsedMinutes(differenceInMinutes(now, anchorDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [anchorDate]);

  const currentSimTime = anchorDate
    ? addMinutes(anchorDate, elapsedMinutes)
    : new Date();

  const displayColumns = createColumns(currentSimTime)
  console.log(medicationOrders.length)
  console.log(filteredMedOrders.length)
  return (
    <div className="flex flex-col p-2 pt-0 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto">
      <div className='flex gap-2 py-2'>
        {associatedOrders.length > 0 &&
          <MultiMedPopover
            isOpen={isMultiOrderPopoverOpen}
            associatedOrders={associatedOrders}
            handleClose={handleMultiOrderPopoverClose}
            handleSelection={handleMultiOrderPopoverChoice}
            medication={medsById[associatedOrders[0].medicationId] || undefined}
          />
        }
        <WrongPatientAlert
          scanStatus={isWrongPtScan}
          onWrongScanChange={setIsWrongPtScan}
        />
        {/* <p className='fixed top-4 left-4 bg-white p-4'>{scannedSymbol}</p> */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-fit h-8 bg-white shadow-xs">
              <Filter className={`${orderFilter ? 'fill-blue-300 stroke-blue-500' : ''}`} />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-4 border rounded-lg shadow">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                {filterOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${option}`}
                      checked={orderFilter.includes(option)}
                      onCheckedChange={(checked) => handleFilterChange(option, checked)}
                    />
                    <Label htmlFor={`filter-${option}`} className="font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {filterOptions.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-6 border shadow"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Toggle
          pressed={isDue}
          onPressedChange={setIsDue}
          aria-label="Toggle bookmark"
          size="sm"
          variant="outline"
          className="data-[state=on]:*:[svg]:fill-blue-300 data-[state=on]:*:[svg]:stroke-blue-500 w-fit shrink-0 bg-white h-8 text-xs "
        >
          <ClipboardClock />
          Due
        </Toggle>
        <MedAdministrationPanel
          selectedMedIds={selectedOrders}
          newAdministrations={newAdministrations}
          onUpdateAdministration={handleUpdateAdministration}
          onClearAll={handleClearAll}
          allOrders={medicationOrders}
          medicationLookup={medsById}
          administrationsLookup={groupedAdministrationsByOrder}
          sessionStart={anchorDate}
          isScanned={isScanned}
          onPtScan={setIsScanned}
          onAdministerMeds={handleAdministerMeds}
          isOpen={isMedAdminPanelOpen}
          handlePopoverClose={setIsMedAdminPanelOpen}
          onOrderRemove={handleRemoveOrder}
          elapsedMinutes={elapsedMinutes}
        />

      </div>

      <div className="flex w-full h-full flex-col flex-1 gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {filteredMedOrders.length === 0 && (
          <div className="h-52 border-2 mt-8 mx-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
            <PillBottle className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium">No orders match the selected filters.</p>
            <p className="text-sm">Clear filters to view all orders.</p>
          </div>
        )}
        {filteredMedOrders.map((order) => {
          const isSelected = selectedOrders.includes(order.id);
          const associatedMedication = medsById[order.medicationId]
          const orderSpecifcAdministrations = groupedAdministrationsByOrder[order.id] || [];

          if (!associatedMedication) {
            console.warn(`Med ${order.medicationId} not found for order ${order.id}`)
            return null
          }

          return (
            <MedCard
              key={order.id}
              medication={associatedMedication}
              administrations={orderSpecifcAdministrations}
              order={order}
              columns={displayColumns}
              sessionStart={anchorDate}
              onSelectionChange={handleMedCheckboxChange}
              isSelected={isSelected}
            />
          )
        })}
      </div>
    </div>
  )
}
