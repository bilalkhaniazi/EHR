'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CompleteFormType, defaultIoData, defaultOrders, DemographicFormData, FormBlob, HistoryFormData, IntakeOutputFormData, MedOrderFormData, TableFormData } from '@/utils/form';
import { ClinicalNote } from '@/app/simulation/[sessionId]/chart/notes/components/notesData';
import { OrderType } from '@/app/simulation/[sessionId]/chart/orders/components/orderData';
import { LabTableData, labTemplate } from '@/app/simulation/[sessionId]/chart/labs/components/labsData';
import { FlexSheetData, flexSheetTemplate } from '@/app/simulation/[sessionId]/chart/charting/components/flexSheetData';
import { MedAdministrationInstance } from '@/app/simulation/[sessionId]/chart/mar/components/marData';
import { useUser } from '@/context/UserContext';
import { CaseBuilderDraftData, CaseBuilderDraftPayload, getDraft, setDraft, clearDraft } from '@/utils/drafts/caseBuilderDraft';

interface FormContextType {
  demographicData: DemographicFormData;
  historyData: HistoryFormData;
  noteData: ClinicalNote[];
  orderData: OrderType[];
  labData: TableFormData<LabTableData>;
  chartingData: TableFormData<FlexSheetData>;
  ioData: IntakeOutputFormData[];
  medOrderData: MedOrderFormData;
  medAdministrationData: MedAdministrationInstance[];
  onDataChange: (key: keyof FormBlob, data: CompleteFormType) => void;
  saveDraftNow: () => void;
  resetDraft: () => void;
  lastSavedAt: string | null;
  updateLastVisitedPath: (path: string) => void;
}

const defaultDemographicData: DemographicFormData = {
  DOBDay: '',
  DOBMonth: '',
  admissionDateOffest: '',
  admissionTime: '',
  admittingDiagnosis: '',
  age: '',
  attendingProviderName: '',
  attendingProviderTitle: '',
  caseName: '',
  codeStatus: '',
  dosingWeight: '',
  employment: '',
  firstName: '',
  heightFeet: '',
  heightInches: '',
  insurance: '',
  language: '',
  needsInterpreter: false,
  lastName: '',
  precautions: '',
  relationshipStatus: '',
  religion: '',
  summary: '',
  contact: '',
  contactRelationship: ''
}
const defaultHistoryData = {
  medicalHistory: [],
  surgicalHistory: [],
  allergies: [],
  socialHistory: [],
  livingSituation: [],
  alerts: [],
  familyHistory: []
}
const FormContext = createContext<FormContextType>({
  onDataChange: () => { },
  demographicData: defaultDemographicData,
  historyData: defaultHistoryData,
  noteData: [],
  orderData: [],
  labData: { data: [], timePoints: [0], timePointsInPreSim: new Set(), visibleItems: new Set() },
  chartingData: { data: [], timePoints: [0], timePointsInPreSim: new Set(), visibleItems: new Set() },
  ioData: [],
  medOrderData: { createdOrders: [], selectedMeds: [] },
  medAdministrationData: [],
  saveDraftNow: () => { },
  resetDraft: () => { },
  lastSavedAt: null,
  updateLastVisitedPath: () => { },
});

export function FormContextProvider({ children }: { children: React.ReactNode }) {
  const [demographicData, setDemographicData] = useState<DemographicFormData>(defaultDemographicData);
  const [historyData, setHistoryData] = useState<HistoryFormData>(defaultHistoryData);
  const [noteData, setNoteData] = useState<ClinicalNote[]>([]);
  const [orderData, setOrderData] = useState<OrderType[]>(defaultOrders);
  const [labData, setLabData] = useState<TableFormData<LabTableData>>({
    data: labTemplate,
    timePoints: [0],
    timePointsInPreSim: new Set<number>(),
    visibleItems: new Set()
  });
  const [chartingData, setChartingData] = useState<TableFormData<FlexSheetData>>({
    data: flexSheetTemplate,
    timePoints: [0],
    timePointsInPreSim: new Set<number>(),
    visibleItems: new Set()
  });
  const [ioData, setIoData] = useState<IntakeOutputFormData[]>(defaultIoData);
  const [medOrderData, setMedOrderData] = useState<MedOrderFormData>({ createdOrders: [], selectedMeds: [] });
  const [medAdministrationData, setMedAdministrationData] = useState<MedAdministrationInstance[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isRestoringFromDraft, setIsRestoringFromDraft] = useState<boolean>(false);
  const [lastVisitedPath, setLastVisitedPath] = useState<string | null>(null);

  const { user } = useUser();
  const userId = user?.id as string | undefined;

  const onDataChange = (key: keyof FormBlob, value: CompleteFormType) => {
    switch (key) {
      case 'demographics':
        setDemographicData(value as DemographicFormData);
        break;
      case 'history':
        setHistoryData(value as HistoryFormData);
        break;
      case 'notes':
        setNoteData(value as ClinicalNote[]);
        break;
      case 'orders':
        setOrderData(value as OrderType[]);
        break;
      case 'labs':
        setLabData(value as TableFormData<LabTableData>);
        break;
      case 'charting':
        setChartingData(value as TableFormData<FlexSheetData>);
        break;
      case 'intakeOutput':
        setIoData(value as IntakeOutputFormData[]);
        break;
      case 'medOrders':
        setMedOrderData(value as MedOrderFormData);
        break;
      case 'medAdministrationInstances':
        setMedAdministrationData(value as MedAdministrationInstance[]);
        break;
    }
  }

  const buildSerializableState = useCallback((): CaseBuilderDraftData => {
    return {
      demographicData,
      historyData,
      noteData,
      orderData,
      labData: {
        ...labData,
        timePointsInPreSim: Array.from(labData.timePointsInPreSim ?? new Set<number>()),
        visibleItems: labData.visibleItems ? Array.from(labData.visibleItems) : [],
      },
      chartingData: {
        ...chartingData,
        timePointsInPreSim: Array.from(chartingData.timePointsInPreSim ?? new Set<number>()),
        visibleItems: chartingData.visibleItems ? Array.from(chartingData.visibleItems) : [],
      },
      ioData,
      medOrderData,
      medAdministrationData,
    };
  }, [demographicData, historyData, noteData, orderData, labData, chartingData, ioData, medOrderData, medAdministrationData]);

  const saveDraftInternal = useCallback(() => {
    if (!userId) return;
    const data = buildSerializableState();
    const payload: CaseBuilderDraftPayload | null = setDraft(userId, data, {
      lastVisitedPath: lastVisitedPath ?? undefined,
    });
    if (payload) {
      setLastSavedAt(payload.updatedAt);
      // Extra visibility from the context side
      console.log("AUTOSAVE draft (FormContext)", {
        updatedAt: payload.updatedAt,
        lastVisitedPath: payload.lastVisitedPath,
      });
    }
  }, [userId, buildSerializableState, lastVisitedPath]);

  const saveDraftNow = useCallback(() => {
    if (!userId) return;
    saveDraftInternal();
  }, [userId, saveDraftInternal]);

  const resetDraft = useCallback(() => {
    if (userId) {
      clearDraft(userId);
    }
    setDemographicData(defaultDemographicData);
    setHistoryData(defaultHistoryData);
    setNoteData([]);
    setOrderData(defaultOrders);
    setLabData({
      data: labTemplate,
      timePoints: [0],
      timePointsInPreSim: new Set<number>(),
      visibleItems: new Set()
    });
    setChartingData({
      data: flexSheetTemplate,
      timePoints: [0],
      timePointsInPreSim: new Set<number>(),
      visibleItems: new Set()
    });
    setIoData(defaultIoData);
    setMedOrderData({ createdOrders: [], selectedMeds: [] });
    setMedAdministrationData([]);
    setLastSavedAt(null);
    setLastVisitedPath(null);
  }, [userId]);

  const updateLastVisitedPath = useCallback((path: string) => {
    setLastVisitedPath(path);
  }, []);

  // Restore from draft on mount / when user changes
  useEffect(() => {
    if (!userId) return;

    const draft = getDraft(userId);
    if (!draft) return;

    setIsRestoringFromDraft(true);

    try {
      const data = draft.data;

      if (data.demographicData) setDemographicData(data.demographicData);
      if (data.historyData) setHistoryData(data.historyData);
      if (data.noteData) setNoteData(data.noteData);
      if (data.orderData) setOrderData(data.orderData);

      if (data.labData) {
        setLabData({
          ...data.labData,
          timePointsInPreSim: new Set<number>(data.labData.timePointsInPreSim || []),
          visibleItems: data.labData.visibleItems ? new Set<string>(data.labData.visibleItems) : new Set<string>(),
        });
      }

      if (data.chartingData) {
        setChartingData({
          ...data.chartingData,
          timePointsInPreSim: new Set<number>(data.chartingData.timePointsInPreSim || []),
          visibleItems: data.chartingData.visibleItems ? new Set<string>(data.chartingData.visibleItems) : new Set<string>(),
        });
      }

      if (data.ioData) setIoData(data.ioData);
      if (data.medOrderData) setMedOrderData(data.medOrderData);
      if (data.medAdministrationData) setMedAdministrationData(data.medAdministrationData);

      setLastSavedAt(draft.updatedAt || null);
      setLastVisitedPath(draft.lastVisitedPath ?? null);

      console.log("RESTORE draft (FormContext)", {
        updatedAt: draft.updatedAt,
        lastVisitedPath: draft.lastVisitedPath,
      });
    } catch {
      // Corrupted or incompatible draft – clear and start fresh
      clearDraft(userId);
    } finally {
      setIsRestoringFromDraft(false);
    }
  }, [userId]);

  // Debounced autosave on any state change
  useEffect(() => {
    if (!userId || isRestoringFromDraft) return;

    const handle = window.setTimeout(() => {
      saveDraftInternal();
    }, 600);

    return () => {
      window.clearTimeout(handle);
    };
  }, [userId, isRestoringFromDraft, saveDraftInternal]);

  return (
    <FormContext.Provider value={{
      demographicData,
      historyData,
      noteData,
      orderData,
      labData,
      chartingData,
      ioData,
      medOrderData,
      medAdministrationData,
      onDataChange,
      saveDraftNow,
      resetDraft,
      lastSavedAt,
      updateLastVisitedPath,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  return useContext(FormContext);
}