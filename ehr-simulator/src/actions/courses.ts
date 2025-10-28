"use server"

import { createClient } from "@supabase/supabase-js";

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
