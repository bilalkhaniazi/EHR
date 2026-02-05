"use server"

import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { revalidatePath } from "next/cache";

export type SectionAssignment = Database['public']['Tables']['section_assignments']['Row'];
export type SectionAssignmentInsert = Database['public']['Tables']['section_assignments']['Insert'];
export type SectionAssignmentUpdate = Database['public']['Tables']['section_assignments']['Update'];

export async function getAllSimCases() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("cases")
    .select("*")

  if (error) throw new Error(error.message);

  return data || [];
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

  if (error) throw new Error(error.message);

  return data[0] || null;
}

export async function getCaseByCourse(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("course_cases")
    .select(`
      case_id,
      course_id,
      case_template(
        name
      )
      `)
    .eq("course_id", id)

  if (error) throw new Error(error.message);

  return data || null;
}

export async function createCaseAssignment(payload: SectionAssignmentInsert) {
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
    throw new Error(error.message);
  }

  revalidatePath('/courses');
  return data || null;
}

export async function deleteCaseAssignment(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('section_assignments')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath('/courses');
}



