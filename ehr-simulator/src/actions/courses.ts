"use server"

import { createClient, QueryData } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export async function getAllCourses() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getCourseById(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)

  if (error) throw new Error(error.message);

  return data[0] || null;
}

export async function getSections(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("course_id", id)

  if (error) throw new Error(error.message);

  return data || null;
}

export async function getCourseSimulations(courseId: string) {
  const supabase = createClient<Database>(
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
        case_template!inner (
          id,
          name
        )
      )
    `)
    .eq('course_id', courseId);

  type SectionSimulationsQuery = QueryData<typeof sectionSimulationsQuery>

  const { data, error } = await sectionSimulationsQuery
  if (error) throw error;

  const sectionSimulations: SectionSimulationsQuery = data
  return sectionSimulations || null;
}