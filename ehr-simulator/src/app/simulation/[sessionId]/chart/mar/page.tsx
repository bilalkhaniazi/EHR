'use client'

import { format } from 'date-fns'
import MedCard from "@/app/simulation/[sessionId]/chart/mar/components/medCard";
import { useEffect, useMemo, useState } from "react";
import type { AllMedicationTypes, MedAdministrationInstance } from "./components/marData";
import MedAdministrationPanel from "./components/medAdministrationPanel";
import { medicationOrders, allMedications, medAdministrations } from './components/marData';

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

// --- Main Component ---

export default function Mar() {
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [newAdministrations, setNewAdministrations] = useState<NewAdministrationData>({});
  const [realWorldNow, setRealWorldNow] = useState(new Date());

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
    <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] grid gap-4 p-4 pb-0 bg-gray-100 overflow-y-auto">

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

      <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {medicationOrders.map((order) => {
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