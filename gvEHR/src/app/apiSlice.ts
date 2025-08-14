import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { generateAllInitialLabTimes, generateInitialLabData, labTemplate, type LabTableData } from '@/components/labs/labsData'
import { sampleNotes, type NoteData } from '@/components/notes/notesData';
import { labratoryOrders, medOrders, nursingOrders, respiratoryOrders, type MedOrderData, type OrderData } from '@/components/orders/orderData';
import { generateInitialChartingData, getAllTimeOffsets, type tableData } from '@/components/flexSheets/tableData';
import { jamesAllen, type ChartData } from '@/components/chart/chartData';
import { allMedications, medAdministrations, medicationOrders, type AllMedicationTypes, type MedAdministrationInstance, type MedicationOrder } from '@/components/mar/marData';
import { differenceInMinutes } from 'date-fns';

interface GetLabsResponse {
  labTableData: LabTableData[];
  timePoints: number[];
}

interface GetFlexSheetsResponse {
  chartingData: tableData[];
  timeOffsets: number[]
}

export interface GetOrdersResponse {
  nursingOrders: OrderData[];
  labratoryOrders: OrderData[];
  respiratoryOrders: OrderData[];
  medicationOrders: MedOrderData[];
}

interface GetMarResponse {
  allMedications: AllMedicationTypes[];
  medicationOrders: MedicationOrder[];
  medAdministrations: MedAdministrationInstance[];
  sessionStartDateString: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints: (builder) => ({
    // LabPage
    getLabs: builder.query<GetLabsResponse, number | null>({
      queryFn: async (simStartTime) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if ( !simStartTime) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Time has not been initialized.' } };        
        }
        const allTimePoints = generateAllInitialLabTimes(simStartTime);
        const timeColumnDateKeys = allTimePoints.map(timePoint => timePoint.dateKey)
        
        const initialLabTableData = generateInitialLabData(allTimePoints, labTemplate);
        const filteredLabTableData = 
          initialLabTableData.filter(row => {
            if (!row.hideable) {
              return true
            }
            // if (row.rowType === "divider") {
            //   return true
            // }
            const allValuesEmpty = timeColumnDateKeys.every(dateKey => {
              const labValue = row[dateKey]
              return !labValue
              }
            )
            return !allValuesEmpty
          })
        return { data: { labTableData: filteredLabTableData, timePoints: timeColumnDateKeys }};
      }
    }),
    // addLabColumn: builder.mutation<
    //   { message: string},
    //   { newDateKey: string, initialLabResults?: {labName: string, value: string }[] }
    // >({ 
    //   queryFn: async({ newDateKey }) => {
    //     await new Promise(resolve => setTimeout(resolve, 500));
    //     return { data: { message:  `Column ${newDateKey} added successfully`}}
    //   },
    //   async onQueryStarted({ newDateKey, initialLabResults }, { dispatch, queryFulfilled }) {
    //     // Optimistic update for the mock
    //     const patchResult = dispatch(
    //       apiSlice.util.updateQueryData('getLabs', undefined, (draft) => {
    //         // Apply the column addition logic directly to the cached data
    //         const now = new Date();
    //         //object containing whatever new labs are being populated
    //         const newTimePoint = {
    //           dateKey: newDateKey,
    //           daysOffset: 0,
    //           hours: now.getHours(),
    //           labs: initialLabResults || [],
    //         };
    //         draft.timePoints.push(newTimePoint);
    //         draft.timePoints.sort((a: LabTimePoint , b: LabTimePoint) => {
    //           const dateA = new Date(a.dateKey.replace('/', '-').replace(' ', 'T'));
    //           const dateB = new Date(b.dateKey.replace('/', '-').replace(' ', 'T'));
    //           return dateA.getTime() - dateB.getTime();
    //         });

    //         draft.labTableData.forEach((row: LabTableData) => {
    //           const matchingResult = initialLabResults?.find(lr => lr.labName === row.field);
    //           row[newDateKey] = matchingResult ? matchingResult.value : '';
    //         });
    //       })
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    // }),

    // NotesPage
    getNotes: builder.query<{notesData: NoteData[]}, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { data: { notesData: sampleNotes } };
      }
    }),
    addNote: builder.mutation<NoteData, NoteData>({ 
      queryFn: async(newNote) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: newNote }
      },
      async onQueryStarted(newNote, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getNotes', undefined, (draft) => {
            if (!Array.isArray(draft.notesData)) {
              draft.notesData = []
            }
            draft.notesData.unshift(newNote);
          })
        )
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo()
        }
      }
    }),

    // OrderPage
    getOrders: builder.query<GetOrdersResponse, void> ({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {data: 
          {
            nursingOrders: nursingOrders, 
            respiratoryOrders: respiratoryOrders, 
            labratoryOrders: labratoryOrders,
            medicationOrders: medOrders
          }
        }
      }
    }),
    // could add new order mutation
    
    getChart: builder.query<{chartData: ChartData}, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: { chartData: jamesAllen }
        }
      }
  }),

    // FlexSheets
    getFlexSheetCharting: builder.query<GetFlexSheetsResponse, number | null>({
      queryFn: async (sessionStartDate) => {

        if (!sessionStartDate) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Time has not been initialized.' } };
        }
        const nowTimestamp = sessionStartDate;

        await new Promise(resolve => setTimeout(resolve, 1000));
        const allTimeOffsets = getAllTimeOffsets(nowTimestamp);
        const initialData = generateInitialChartingData(allTimeOffsets);
        return { data: { chartingData: initialData, timeOffsets: allTimeOffsets}}
      },
    }),
    addTimeColumn: builder.mutation<
      { message: string, newTimeOffset: number }, // Expected response
      { newTimeOffset: number } // Payload: just the new time string
    >({
      queryFn: async ({ newTimeOffset }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Mock backend received request to add time column: ${newTimeOffset}`);
        return { data: { message: `Time column ${newTimeOffset} added successfully`, newTimeOffset } };
      
      
      // pre-redux column adding logic
      //   const handleColumnAdd = useCallback((newTime: string) => {
      //     setTimeColumns(prevColumns => {
      //         const updatedColumns = [...prevColumns, newTime].sort();
      //         return updatedColumns;
      //     });

      //     setData(prevData =>
      //         prevData.map(row => {
      //             const newRow = { ...row };
      //             newRow[newTime] = '';
      //             return newRow;
      //         })
      //     );
      // }, []);
      },
    }),
    updateFlexSheetData: builder.mutation<
      { message: string, updatedData: tableData[] }, // Expected response from backend
      tableData[] // Payload: array of modified rows (the full current state of the sheet)
    >({
      queryFn: async (updatedRows) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Mock backend received FlexSheet update:", updatedRows);
        // 🚨 Mock backend logic: For a real backend, you'd save `updatedRows` to your DB.
        // For our current mock, we'll just return it.
        return { data: { message: "FlexSheet data updated successfully", updatedData: updatedRows } };
      },
      // Invalidate after save so getFlexSheetData re-fetches the latest *saved* state
      // (This is crucial for ensuring the UI is in sync with the "database" after a save)
      // invalidatesTags: ['FlexSheetData'],
    }),
    getMar: builder.query<GetMarResponse, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const allMedAdministrations: MedAdministrationInstance[] = medAdministrations
        const ptMedicationOrders: MedicationOrder[] = medicationOrders
        const allPtMedications: AllMedicationTypes[] = allMedications
        const simStartTime = new Date().toISOString()

        return { data: { medicationOrders: ptMedicationOrders, medAdministrations: allMedAdministrations, allMedications: allPtMedications, sessionStartDateString: simStartTime}}
      }
    }),

    submitNewAdministrations: builder.mutation<
      { newAdministrations: MedAdministrationInstance[] },
      { administrations: MedAdministrationInstance[] }
    >({
      // The queryFn simulates an API call
      queryFn: async (payload) => {
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // A real backend would return a success message and the new data.
        // For this mock, we'll just return the payload as the new data.
        return { data: { newAdministrations: payload.administrations } };
      },

      // onQueryStarted is used for the optimistic update
      async onQueryStarted({ administrations }, { dispatch, queryFulfilled }) {



        // Update the 'getMar' query cache optimistically
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getMar', undefined, (draft) => {
            const newAdminTimes = new Map(administrations.map(admin => [admin.medicationOrderId, admin.adminTimeMinuteOffset]));

            const filteredAdministrations = draft.medAdministrations.filter(existingAdmin => {
              if (existingAdmin.status !== "Due"){
                return true;
              }

              const newAdminTime = newAdminTimes.get(existingAdmin.medicationOrderId);

              if (newAdminTime === undefined) {
                return true;
              }
              const minuteDifference = Math.abs(differenceInMinutes(newAdminTime, existingAdmin.adminTimeMinuteOffset));
              return minuteDifference > 60
            })

            draft.medAdministrations = filteredAdministrations;

            draft.medAdministrations.push(...administrations);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // If the API call fails, revert the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});



export const { 
  useGetLabsQuery,
  // useAddLabColumnMutation,
  useGetNotesQuery,
  useAddNoteMutation,
  useGetOrdersQuery,
  useGetFlexSheetChartingQuery,
  useAddTimeColumnMutation,
  useUpdateFlexSheetDataMutation,
  useGetChartQuery,
  useGetMarQuery,
  useSubmitNewAdministrationsMutation
} = apiSlice