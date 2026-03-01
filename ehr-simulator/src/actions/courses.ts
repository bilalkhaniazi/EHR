"use server"

import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { ActionResponse } from "./cases";
export type Course = Database['public']['Tables']['courses']['Row'];

export async function getAllCourses(): Promise<ActionResponse<Course[] | null>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order('code', { ascending: false })

  if (error) {
    const result: ActionResponse = {
      success: false,
      message: 'Failed to fetch courses.',
      error,
    }
    return result

  }
  return {
    success: true,
    data,
    message: 'Successfully retrieved all courses.'
  }
}

export async function getCourseById(id: string): Promise<ActionResponse<Course | null>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)


  if (error) {
    const result: ActionResponse = {
      success: false,
      error,
      message: 'Failed to retrieve course.'
    }
    return result
  }

  const cleanData = Array.isArray(data)
    ? data[0]
    : data

  return {
    success: true,
    data: cleanData,
    message: 'Successfully retrieved course.'
  }
}

export async function getSectionsByCourseId(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("course_id", id)

  if (error) {
    const result: ActionResponse = {
      success: false,
      error,
      message: 'Failed to retrieve sections.'
    }
    return result;
  }

  return {
    success: true,
    data,
    message: 'Successfully retrieved sections.',
  }
}



