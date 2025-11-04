import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { generateAllInitialLabTimes, generateInitialLabData, labTemplate, type LabTableData } from '@/app/simulation/[sessionId]/chart/labs/components/labsData'
import { sampleNotes, type NoteData } from '@/app/simulation/[sessionId]/chart/notes/components/notesData';
import { consultOrders, laboratoryOrders, nursingOrders, respiratoryOrders, type MedOrderData, type OrderData } from '@/app/simulation/[sessionId]/chart/orders/components/orderData';
import { generateInitialChartingData, getAllTimeOffsets, type tableData } from '@/app/simulation/[sessionId]/chart/charting/components/flexSheetData';
import { jamesAllen, type ChartData } from '../simulation/[sessionId]/chart/components/chartData';
import { allMedications, medAdministrations, medicationOrders } from '@/app/simulation/[sessionId]/chart/mar/components/marData';
import type { AllMedicationTypes, MedAdministrationInstance, MedicationOrder } from '@/app/simulation/[sessionId]/chart/mar/components/marData';
import { differenceInMinutes } from 'date-fns';
import { getMedDose } from '../simulation/[sessionId]/chart/mar/components/marHelpers';

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
  labOrders: OrderData[];
  respiratoryOrders: OrderData[];
  medicationData: MedOrderData[];
  consultOrders: OrderData[];
}

interface SimDisplayData {
  name: string;
  age: number;
  diagnosis: string;
  overview: string;
  tasks: string[]
  gender:string;
  id: string;
}

interface GetSimPrepsResponse {
  simPreps: SimDisplayData[]
}


interface GetMarResponse {
  allMedications: AllMedicationTypes[];
  medicationOrders: MedicationOrder[];
  medAdministrations: MedAdministrationInstance[];
  sessionStartDateString: string;
}

interface GetChartResponse {
  chartData: ChartData, 
  marData: {
    prn: number,
    scheduled: number,
    continuous: number
  }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints: (builder) => ({
    // LabPage
    getLabs: builder.query<GetLabsResponse, number | null>({
      queryFn: async (simStartTime) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!simStartTime) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Time has not been initialized.' } };        
        }
        
        const allTimePoints = generateAllInitialLabTimes(simStartTime);

        // get list of all time offsets for tanstack table columns
        const timeColumnDateKeys = allTimePoints.map(timePoint => timePoint.dateKey)
        
        // assign lab results to their corresponding rows
        const initialLabTableData = generateInitialLabData(allTimePoints, labTemplate);

        // remove rarely used labs if every value in its row is empty
        const filteredLabTableData = 
          initialLabTableData.filter(row => {
            if (!row.hideable) {
              return true
            }
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
          const medications = allMedications
          const orders = medicationOrders

          const medLookup = medications.reduce<Record<string, AllMedicationTypes>>((acc, med) => {
            acc[med.id] = med
            return acc;
          }, {})

          

          const medData = orders.map(order => {
            const brandName = medLookup[order.medicationId].brandName ? `(${medLookup[order.medicationId].brandName})` : ''
            const dose = getMedDose(medLookup[order.medicationId], order)
            return(
              {
                displayName: `${medLookup[order.medicationId].genericName} ${brandName}`,
                route: medLookup[order.medicationId].route,
                dose: dose,
                frequency: order.frequency,
                priority: order.priority,
                administrationInstructions: order.instructions ? order.instructions : '',
                orderingProvider: order.orderingProvider
              } as MedOrderData
            )
          })
        return {data: 
          {
            nursingOrders: nursingOrders, 
            respiratoryOrders: respiratoryOrders, 
            labOrders: laboratoryOrders,
            medicationData: medData,
            consultOrders: consultOrders
          }
        }
      }
    }),

    // Chart Sidebar
    getChart: builder.query<{chartData: ChartData, marData: {prn: number, scheduled: number, continuous: number}}, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const orderCounts = medicationOrders.reduce((acc, order) => {
          if (order.frequency === "PRN") {
            acc["prn"]++ 
          } else if (order.frequency === "Continuous") {
            acc['continuous']++
          } else {
            acc['scheduled']++
          }
          return acc
        }, {prn: 0, continuous: 0, scheduled: 0})


        return { 
          data: { chartData: jamesAllen, marData: orderCounts }
        }
      }
    }),

    // FlexSheets
    getFlexSheetCharting: builder.query<GetFlexSheetsResponse, number | null>({
      queryFn: async (sessionStartDate) => {
        // timeSlice should have initialized session's start time 
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
      //   const handleColumnAdd = (newTime: string) => {
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
      // }
      },
    }),
    updateFlexSheetData: builder.mutation<
      { message: string, updatedData: tableData[] }, // Expected response from backend
      tableData[] // Payload: array of modified rows (the full current state of the sheet)
    >({
      queryFn: async (updatedRows) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Mock backend received FlexSheet update:", updatedRows);
        // fake response 
        return { data: { message: "FlexSheet data updated successfully", updatedData: updatedRows } };
      },
      
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
      queryFn: async (payload) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // fake response
        return { data: { newAdministrations: payload.administrations } };
      },

      // directly modifying marSlice to demonstrate functionality with no database
      async onQueryStarted({ administrations }, { dispatch, queryFulfilled }) {
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
    
    // Gets all sim preps currently available to students
    // needs sim name, age, gender, dx, overview statement, and potentially specified tasks
    // unique ID for sim to be requested
    getSimPreps: builder.query<GetSimPrepsResponse, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const simPrepData1: SimDisplayData = { 
          name: 'Mark Smith',
          age: 67,
          gender: "Male",
          diagnosis: 'COPD',
          overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, tempore omnis animi veniam, libero similique, aspernatur sunt aperiam et nesciunt.',
          tasks: ["Review chart", "Construct timeline of patients hospital stay.", "Review labratory values and connect them to the patient's diagnosis."],
          id: "sadfF32EfsfU786H"
        }
        const simPrepData2: SimDisplayData = { 
          name: 'Mark Smith',
          age: 67,
          gender: "Male",
          diagnosis: 'COPD',
          overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, tempore omnis animi veniam, libero similique, aspernatur sunt aperiam et nesciunt.',
          tasks: ["Review chart", "Construct timeline of patients hospital stay.", "Review labratory values and connect them to the patient's diagnosis."],
          id: "sadfF32EfsfU786H"
        }
        const simData: SimDisplayData[] = [simPrepData1, simPrepData2]

        return { data: {simPreps:  simData }};
      }
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
  useSubmitNewAdministrationsMutation,
  useGetSimPrepsQuery
} = apiSlice