"use server"

import { createClient } from "@supabase/supabase-js";

export async function getAllUsers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .select("*")

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getAllStudentUsers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "student")
  if (error) throw new Error(error.message);

  return data || []
}

export async function getAllAdminUsers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "admin")
  if (error) throw new Error(error.message);

  return data || []
}

export async function getAllFacultyUsers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "faculty")
  if (error) throw new Error(error.message);

  return data || []
}