'use client'

import { format } from 'date-fns'
import MedCard from "@/app/simulation/[sessionId]/chart/mar/components/medCard";
import { useEffect, useMemo, useState } from "react";
import type { AllMedicationTypes, MedAdministrationInstance } from "./components/marData";
import MedAdministrationPanel from "./components/medAdministrationPanel";
import { medicationOrders, allMedications, medAdministrations } from './components/marData';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Filter, PillBottle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

// --- Types (Previously in Slice) ---

export interface NewAdministrationData {
  [medOrderId: string]: MedAdministrationInstance;
}

export interface MedCardColumns {
  startTime: Date;
  endTime: Date;
  colHeader: string;
  associatedAdministrations?: MedAdministrationInstance[];
}

const routes = ["PO", "IV", "SC", "IM", "Topical", "Inhalation", "SL"]
export default function Mar() {
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [newAdministrations, setNewAdministrations] = useState<NewAdministrationData>({});
  const [realWorldNow, setRealWorldNow] = useState(new Date());
  const [medFilters, setMedFilters] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isPRN, setIsPRN] = useState<boolean | undefined>(false)

  const handleMedChange = (payload: { id: string, checked: boolean }) => {
    const { id, checked } = payload;
    if (checked) {
      setSelectedMeds(prev => [...prev, id]);
      setNewAdministrations(prev => ({
        ...prev,
        [id]: {
          medicationOrderId: id,
          status: "Given",
          administratorId: "currentUser",
          adminTimeMinuteOffset: 0,
          administeredDose: 0
        }
      }));
    } else {
      setSelectedMeds(prev => prev.filter(medId => medId !== id));

      setNewAdministrations(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleFilterChange = (route: string, checked: boolean | "indeterminate") => {
    setMedFilters(prev => {
      if (checked === true) {
        return [...prev, route];
      } else {
        return prev.filter(s => s !== route);
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
    setSelectedMeds([]);
    setNewAdministrations({});
    setMedFilters([])
  };
  const handleClearFilters = () => {
    setMedFilters([]);
    setIsPRN(false);
    setIsPopoverOpen(false)
  };


  const groupedAdministrationsByOrder = useMemo(() => {
    return medAdministrations.reduce((acc, admin) => {
      if (!acc[admin.medicationOrderId]) {
        acc[admin.medicationOrderId] = [];
      }
      acc[admin.medicationOrderId].push(admin)
      return acc
    }, {} as { [orderId: string]: MedAdministrationInstance[] })
  }, []);

  const medsById = useMemo(() => {
    return allMedications.reduce((acc, med) => {
      acc[med.id] = med;
      return acc;
    }, {} as { [id: string]: AllMedicationTypes });
  }, []);

  const filteredMedOrders = useMemo(() => {
    return medicationOrders.filter(order => {
      const med = medsById[order.medicationId];
      const matchesRoute = medFilters.length === 0 || medFilters.includes(med.route);
      const matchesPRN = !isPRN || order.priority === "PRN";

      return matchesRoute && matchesPRN;
    });
  }, [medFilters, medsById, isPRN]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRealWorldNow(new Date());
    }, 60 * 1000)
    return () => clearInterval(intervalId);
  }, []);


  const sessionStartDateNumber = new Date(realWorldNow).getTime();

  const columnAnchorTime = new Date(
    realWorldNow.getFullYear(),
    realWorldNow.getMonth(),
    realWorldNow.getDate(),
    realWorldNow.getHours(),
    0, 0, 0
  )

  const columnCount = 6
  const displayColumns = [] as MedCardColumns[]

  // Create 6 columns: 2 future hours, current hour, 3 past hours
  for (let i = 0; i < columnCount; i++) {
    const colStartTime = new Date(columnAnchorTime.getTime() - ((i - 2) * 60 * 60 * 1000));
    const colEndTime = new Date(colStartTime.getTime() + (60 * 60 * 1000) - 1);
    const colHeader = format(colStartTime, 'HH00');

    displayColumns.unshift({
      startTime: colStartTime,
      endTime: colEndTime,
      colHeader: colHeader
    })
  }

  return (
    <div className="flex flex-col p-2 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto">
      <div className='flex gap-2'>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-fit h-8 bg-white shadow-sm">
              Route
              <Filter className="ml-1 h-2 w-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-4 border rounded-lg shadow">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                {routes.map(route => (
                  <div key={route} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${route}`}
                      checked={medFilters.includes(route)}
                      onCheckedChange={(checked) => handleFilterChange(route, checked)}
                    />
                    <Label htmlFor={`filter-${route}`} className="font-normal">
                      {route}
                    </Label>
                  </div>
                ))}
              </div>
              {routes.length > 0 && (
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
          pressed={isPRN}
          onPressedChange={setIsPRN}
          aria-label="Toggle bookmark"
          size="sm"
          variant="outline"
          className="data-[state=on]:*:[svg]:fill-blue-300 data-[state=on]:*:[svg]:stroke-blue-500 w-22 bg-white h-8 mb-2 text-xs"
        >
          <PillBottle />
          PRNs
        </Toggle>
        <MedAdministrationPanel
          selectedMedIds={selectedMeds}
          newAdministrations={newAdministrations}
          onUpdateAdministration={handleUpdateAdministration}
          onClearAll={handleClearAll}
          allOrders={medicationOrders}
          medicationLookup={medsById}
          administrationsLookup={groupedAdministrationsByOrder}
          sessionStartTime={sessionStartDateNumber}
          realWorldTime={realWorldNow}
        />
      </div>

      <div className="flex w-full h-full flex-col flex-1 gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {filteredMedOrders.map((order) => {
          const isSelected = selectedMeds.includes(order.id);
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
              sessionStartTime={sessionStartDateNumber}
              onSelectionChange={handleMedChange}
              isSelected={isSelected}
            />
          )
        })}
      </div>
    </div>
  )
}