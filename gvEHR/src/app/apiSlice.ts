import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { generateAllInitialLabTimes, generateInitialLabData, labTemplate, type LabTimePoint, type LabTableData } from '@/components/labs/labsData'
import { sampleNotes, type NoteData } from '@/components/notes/notesData';
import { labratoryOrders, medOrders, nursingOrders, respiratoryOrders, type MedOrderData, type OrderData } from '@/components/orders/orderData';

interface GetLabsResponse {
  labTableData: LabTableData[];
  timePoints: LabTimePoint[];
}

export interface GetOrdersResponse {
  nursingOrders: OrderData[];
  labratoryOrders: OrderData[];
  respiratoryOrders: OrderData[];
  medicationOrders: MedOrderData[];
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints: (builder) => ({
    // LabPage
    getLabs: builder.query<GetLabsResponse, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const referenceDate = new Date();
        const allTimePoints = generateAllInitialLabTimes(referenceDate);
        const initialLabTableData = generateInitialLabData(allTimePoints, labTemplate);
        return { data: { labTableData: initialLabTableData, timePoints: allTimePoints }};
      }
    }),
    addLabColumn: builder.mutation<
      { message: string},
      { newDateKey: string, initialLabResults?: {labName: string, value: string }[] }
    >({ 
      queryFn: async({ newDateKey }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: { message:  `Column ${newDateKey} added successfully`}}
      },
      async onQueryStarted({ newDateKey, initialLabResults }, { dispatch, queryFulfilled }) {
        // Optimistic update for the mock
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getLabs', undefined, (draft) => {
            // Apply the column addition logic directly to the cached data
            const now = new Date();
            //object containing whatever new labs are being populated
            const newTimePoint = {
              dateKey: newDateKey,
              daysOffset: 0,
              hours: now.getHours(),
              labs: initialLabResults || [],
            };
            draft.timePoints.push(newTimePoint);
            draft.timePoints.sort((a: LabTimePoint , b: LabTimePoint) => {
              const dateA = new Date(a.dateKey.replace('/', '-').replace(' ', 'T'));
              const dateB = new Date(b.dateKey.replace('/', '-').replace(' ', 'T'));
              return dateA.getTime() - dateB.getTime();
            });

            draft.labTableData.forEach((row: LabTableData) => {
              const matchingResult = initialLabResults?.find(lr => lr.labName === row.field);
              row[newDateKey] = matchingResult ? matchingResult.value : '';
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

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
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {data: 
          {
            nursingOrders: nursingOrders, 
            respiratoryOrders: respiratoryOrders, 
            labratoryOrders: labratoryOrders,
            medicationOrders: medOrders
          }
        }
      }
    })
  }),
});


export const { 
  useGetLabsQuery,
  useAddLabColumnMutation,
  useGetNotesQuery,
  useAddNoteMutation,
  useGetOrdersQuery
} = apiSlice