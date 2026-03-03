"use server"

import { createClient } from "@supabase/supabase-js";
import { Tables } from "../../database.types";

type Student = Tables<"users">

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

export async function provisionStudents(students: Student[]) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch existing users by email to preserve their IDs
  const emails = students.map(s => s.email);
  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("id, email")
    .in("email", emails);

  if (fetchError) throw new Error(`Fetch failed: ${fetchError.message}`);

  const existingMap = new Map(existing?.map(u => [u.email, u.id]) ?? []);

  const { error } = await supabase
    .from("users")
    .upsert(
      students.map(s => ({
        id: existingMap.get(s.email) ?? crypto.randomUUID(),
        email: s.email,
        full_name: s.full_name,
        role: "student",
      })),
      { onConflict: "email" }
    );

  if (error) throw new Error(`Upsert failed: ${error.message}`);

  return { provisioned: students };
}