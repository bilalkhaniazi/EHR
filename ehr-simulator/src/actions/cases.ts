"use server"

import { createClient, PostgrestError, QueryData } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { revalidatePath } from "next/cache";

export type SectionAssignment = Database['public']['Tables']['section_assignments']['Row'];
export type SectionAssignmentInsert = Database['public']['Tables']['section_assignments']['Insert'];
export type SectionAssignmentUpdate = Database['public']['Tables']['section_assignments']['Update'];

export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T | null;
  error?: PostgrestError;
};

export async function getAllSimCases() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("case_data")
    .select("*")

  if (error) {
    const result: ActionResponse = {
      success: false,
      message: 'Failed to retrieve Sim Cases',
      error,
      data
    }
    return result
  }

  return {
    success: true,
    data,
    message: 'Successfully retrieved Sim Cases'
  };
}

export async function getSimCaseById(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)

  if (error) {
    const result = {
      success: false,
      message: 'Failed to retrieve specified Sim Case',
      error,
      data
    }
    return result
  }
  return {
    success: true,
    data,
    message: 'Successfully retrieved Sim Cases'
  };
}


export async function getCaseByCourseId(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("course_cases")
    .select(`
      case_id,
      course_id,
      case_data(
        name
      )
      `)
    .eq("course_id", id)

  if (error) {
    const result = {
      success: false,
      message: 'Failed to retrieve Sim Case paired with this course.',
      error,
      data
    }
    return result
  }

  // Auto-generated Supabase types wouldn't recognize the PK/FK relationship between case_data and course_case
  // Force case data to be single object, not array
  const cleanData = data?.map((item) => {
    const _caseData = Array.isArray(item.case_data)
      ? item.case_data[0]
      : item.case_data;

    return {
      ...item,
      case_data: _caseData || { name: "Unknown Case" }
    };
  });

  return {
    success: true,
    data: cleanData,
    message: 'Successfully retrieved Sim Cases paired with this course',
  };
}

export async function getSimAssignments(courseId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sectionSimulationsQuery = supabase
    .from('sections')
    .select(`
      id,
      name,
      meeting_time,
      section_assignments (
        id,
        sim_time,
        presim_time,
        case_data!section_assignments_case_id_fkey!inner (
          id,
          name
        )
      )
    `)
    .eq('course_id', courseId);

  type SectionAssignment = QueryData<typeof sectionSimulationsQuery>;
  const { data, error } = await sectionSimulationsQuery

  if (error) {
    const result = {
      success: false,
      message: 'Failed to retrieve Sim Case paired with this course.',
      error,
      data: null
    };
    return result
  }
  return {
    success: true,
    message: 'Successfully retrieved Sim Assignment for this section.',
    data: data as SectionAssignment,
  }
}

export async function createCaseAssignment(payload: SectionAssignmentInsert): Promise<ActionResponse<SectionAssignment>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('section_assignments')
    .upsert(payload)
    .select()
    .single()

  if (error) {
    console.error("Upsert Error:", error);
    return {
      success: false,
      message: "Failed to save the assignment. Please try again.",
      error
    };
  }

  revalidatePath('/courses');

  return {
    success: true,
    message: "Assignment saved successfully.",
    data
  };
}

export async function deleteCaseAssignment(id: string): Promise<ActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('section_assignments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Delete Error:", error);
    return {
      success: false,
      message: "Failed to delete assignment. Please try again.",
      error
    };
  }

  revalidatePath('/courses');

  return {
    success: true,
    message: "Assignment deleted successfully."
  };
}

// extracts type of data from ActionResponse for use in frontend
type ExtractData<T extends (...args: any) => Promise<ActionResponse<any>>> =
  NonNullable<Awaited<ReturnType<T>>['data']>;

export type SectionSimulationsData = ExtractData<typeof getSimAssignments>;
export type CasesData = ExtractData<typeof getCaseByCourseId>;